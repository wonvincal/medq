/**
 * Created by Calvin on 2/11/2015.
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

EntityProvider.prototype.getBy = function(dict, id){
    var obj = dict[id];
    if (!_.isUndefined(obj)){
        return obj;
    }
    return null;
};

EntityProvider.prototype.getById = function(id){
    return this.getBy(this.entities, id);
};

EntityProvider.prototype.getByCid = function(cid){
    return this.getBy(this.entitiesByCid, cid);
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

// Merge with JSON
// server will instruct whether to create / update / delete an objects
// With current design, a new entity (i.e. Ticket) can be asynchronously by
// 1) indirectly through its first reference in a Queue entity, or
// 2) directly through its first reference in a Ticket entity update
// Therefore, we will only provide way to tell if a entity has been changed or deleted
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

EntityProvider.prototype.mergeWithJSONs = function(jsons){
    //var result = [];
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
/*        var obj = this.mergeWithJSON(json);
        if (obj !== null){
            result.push(obj);
        }*/
    }, this);
    //return result;
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