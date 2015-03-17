/**
 * Created by Calvin on 2/11/2015.
 *
 * EntityProvider merges entity updates from wire.  The merge can only happen in two scenarios:
 * 1) AJAX response from a request that this client initiated
 * 2) Push request from technologies such as Websocket, Meteor, App Notifications...etc.
 *
 * Cautious: Merge must not happen elsewhere
 *
 * TODO Get entity changes since a sequence number.
 * TODO Get Web Worker to do the update of Entity - not sure how this works
 *
 * To get updates without worrying about concurrency issue (there shouldn't be any)
 * 1) Each EntityProvider should have a count for new (e.g. Arrays.length)
 * 2) Each Entity should have a sequence
 *
 * Each client component can maintain its own 'last new count' and 'last seq of each entity'
 *
 * 1) PlannerSectionStore calls EntityProvider with 'last new count' and 'last seq of each entity'
 * NOTE: "last new count and addition of new entity" must be atomic
 * NOTE: Update of objects must be atomic
 * 2) EntityProvider updates after it receives response from server
 * 3) PlannerSectionStore gets new, but only some of the updates
 * 4) ActionCreator sends out a RECEIVE_UDPATES event
 *
 */
var AppConstant = require('../constants/AppConstant');
var EntityResultSet = require('../utils/EntityResultSet');
var EntityResult = require('../utils/EntityResult');
var _ = require('lodash');

function EntityProvider(){
    this.entities = {};
    this.entitiesByCid = {};
    this.entitiesRemoved = {};
    this.entitiesByCidRemoved = {};
}

function getBy(dict, id){
    var obj = dict[id];
    if (!_.isUndefined(obj)){
        return obj;
    }
    return null;
}

/**
 * How to get new entities since last retrieve?
 * How to get updates since last retrieve
 *
 * @param filter
 * @returns {*}
 */
/*
EntityProvider.prototype.getUpdates = function(cachedVersions) {
    _.forOwn(cachedVersions, function (key) {
        var cachedVersion = cachedVersions[key];
        var currentItem = this.entities[key];
        if (_.isUndefined(currentItem)){
            currentitem = this.entitiesRemoved[key];
            if (_.isUndefined(currentItem)){
                // something is wrong
                // return everything
            }
        }
        if (cachedVersion < this.entities[key])
    });
};
*/
/*
EntityProvider.prototype.getEntitiesByFilter = function(filter){
    return _.filter(this.entities, filter);
};
*/
EntityProvider.prototype.entityType = null;

EntityProvider.prototype.getById = function(id){
    return getBy(this.entities, id);
};

EntityProvider.prototype.getByCid = function(cid){
    return getBy(this.entitiesByCid, cid);
};

 EntityProvider.prototype.getOrCreateBy = function(dict, id){
    var obj = dict[id];
    if (_.isUndefined(obj)) {
        obj = this.create(id);
        dict[id] = obj;
    }
    return obj;
};

EntityProvider.prototype.getOrCreateObj = function(id, cid){
    var obj = null;
    if (!_.isUndefined(cid) && cid !== null){
        obj = this.getByCid(cid);
        if (obj !== null){
            return obj;
        }
    }
    return this.getOrCreateBy(this.entities, id);
};

EntityProvider.prototype.create = function(/* id */){
    throw new Error("Not implemented");
};

EntityProvider.prototype.createWithNextCid = function(){
    var obj = this.create(null);
    obj.applyNextCid();
    this.entitiesByCid[obj.cid] = obj;
    return obj;
};

/**
 * Merge with JSON
 *
 * Server should have enough info to tell whether an object has been created / updated / deleted
 * With current design, a new entity (i.e. Ticket) can be asynchronously 'referenced' by
 * 1) indirectly through its first reference in a Queue entity, or
 * 2) directly through its first reference in a Ticket entity update
 * Therefore, we will only provide way to tell if a entity has been changed or deleted
 *
 * TODO Consider sequence number
 *
 * @param json
 * @returns {*}
 */
EntityProvider.prototype.mergeWithJSON = function (json) {
    if (_.isUndefined(json) || json === null) {
        return null;
    }
    var id = json.id;
    if (_.isUndefined(id) || id === null) {
        console.error("Entity must have Id when merging with JSON");
        return null;
    }

    var current = null;
    var cid = json.cid;
    if (!_.isUndefined(cid) && cid !== null) {
        current = this.getByCid(cid);
        if (current.mergeId(json)) {
            if (!_.has(this.entities, current.id)) {
                this.entities[current.id] = current;
            }
        }
    }

    var result = new EntityResult();
    result.type = AppConstant.ENTITY_NO_CHANGE;
    if (current === null) {
        current = this.getById(id);
        if (current === null) {
            current = this.create(id);
            this.entities[id] = current;
            result.type = AppConstant.ENTITY_ADDED_OR_UPDATED;
        }
    }
    if (current.mergeOwnProps(json)){
        result.type = AppConstant.ENTITY_ADDED_OR_UPDATED;
    }
    if (this.mergeOtherEntitiesWithJSON(current, json)){
        result.type = AppConstant.ENTITY_ADDED_OR_UPDATED;
    }
    result.obj = current;
    return result;
};

EntityProvider.prototype.mergeOtherEntitiesWithJSON = function(obj, json){
    return false;
};

EntityProvider.prototype.getOrCreateEntityWithJSON = function(jsonObj, entityProvider){
    if (!_.isUndefined(jsonObj) && jsonObj !== null) {
        var id = jsonObj.id;
        if (!_.isUndefined(id) && id !== null) {
            return entityProvider.getOrCreateObj(id, jsonObj.cid);
        }
    }
    return null;
};

EntityProvider.prototype.getOrCreateEntitiesWithJSON = function(jsonObjs, entityProvider) {
    if (!_.isUndefined(jsonObjs) && jsonObjs !== null && _.isArray(jsonObjs)) {
        return _.map(jsonObjs, function (jsonObj) {
            return entityProvider.getOrCreateObj(jsonObj.id, jsonObj.cid);
        });
    }
    return [];
};

EntityProvider.prototype.removeFilter = function(obj){
    return false;
};

/**
 * Merge JSONs into a collection of entities
 *
 * TODO Consider sequence number
 * TODO Do not return EntityResultSet, because that may not be useful at all once each client can query by seq number
 *
 * @param jsons
 * @returns {EntityResultSet}
 */
EntityProvider.prototype.mergeWithJSONs = function(jsons){
    var entityResult = new EntityResultSet();
    _.forEach(jsons, function(json){
        var result = this.mergeWithJSON(json);
        if (result.type === AppConstant.ENTITY_ADDED_OR_UPDATED){
            entityResult.addUpdate(result.obj);
        }
        else if (result.type == AppConstant.ENTITY_DELETED){
            entityResult.addDelete(result.obj);
        }
        else{
            entityResult.addRead(result.obj);
        }
    }, this);
    return entityResult;
};

EntityProvider.prototype.removeBy = function(id, grp, grpAlt, grpRemoved, propAlt){
    var removed = null;
    var found = grp[id];
    if (!_.isUndefined(found)) {
        removed = found;
        delete grp[id];
        var idAlt = removed[propAlt];
        if (!_.isUndefined(idAlt) && idAlt !== null && _.has(grpAlt, idAlt)) {
            delete grpAlt[idAlt];
        }
        grpRemoved[id] = removed;
    }
    return removed;
};

/**
 * Clear cache
 */
EntityProvider.prototype.clear = function(){
    this.entities = {};
    this.entitiesByCid = {};
    this.entitiesRemoved = {};
    this.entitiesByCidRemoved = {};
};

EntityProvider.prototype.removeObj = function(obj){
    var id = obj.id;
    var result = [];
    var removedById = this.removeBy(id, this.entities, this.entitiesByCid, this.entitiesRemoved, "cid");
    if (removedById !== null){
        result.push(removedById);
    }

    var cid = obj.cid;
    var removedByCid = this.removeBy(cid, this.entitiesByCid, this.entities, this.entitiesByCidRemoved, "id");
    if (removedByCid !== null){
        result.push(removedByCid);
    }

    if (removedById !== null && removedByCid !== null && removedById !== removedByCid){
        console.error("Remove with (id = " + id + ", cid = " + cid + ") but found out it is also associated with cid");
    }

    return result;
};

module.exports = EntityProvider;