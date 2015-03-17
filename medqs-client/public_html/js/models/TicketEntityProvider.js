/**
 * Created by Calvin on 1/31/2015.
 * A provider with reference to all Ticket entities created, include:
 * 1) Ticket received from server side
 * 2) Ticket created on client side
 *
 * There are two ways to keep track of all created entities within the application
 * 1) create them thru entity provider, or
 * 2) process them at AppService level, whichever an entity goes in/out of AppService
 *
 * Let's stick another function into this class - Factory method
 *
 * Rule
 * All API functions must be guarded (check param, check null, check undefined...)
 *
 */
var TicketModel = require('./TicketModel');
var AptEntityProvider = require('./AptEntityProvider');
var EntityProvider = require('./EntityProvider');
var Comparator = require('../utils/Comparator');
var _ = require('lodash');

function TicketEntityProvider(){
    EntityProvider.call(this);
}

TicketEntityProvider.prototype = Object.create(EntityProvider.prototype);

TicketEntityProvider.prototype.entityType = "Ticket";

TicketEntityProvider.prototype.create = function(id) {
    var obj = new TicketModel();
    obj.id = id;
    return obj;
};

TicketEntityProvider.prototype.mergeOtherEntitiesWithJSON = function(obj, json) {
    var prevApt = obj.apt;
    obj.apt = this.getOrCreateEntityWithJSON(json.apt, AptEntityProvider);
    return Comparator.isEqual(prevApt, obj.apt);
};

TicketEntityProvider.prototype.getByQueue = function(queue){
    return _.filter(this.entities, function(obj) {
        return (obj.queueId === queue.id);
    });
};

TicketEntityProvider.prototype.getByWorkers = function(workers){
    var ids = {};
    _.forEach(workers, function(worker){
        ids[worker.id] = true;
    });
    return _.filter(this.entities, function(ticket) {
        return (_.some(ticket.apt.workers, function(worker){
            return (!_.isUndefined(ids[worker.id]));
        }));
    });
};

TicketEntityProvider.prototype.getByApt = function(apt){
    _.forEach(this.entities, function(entity){
        if (entity.apt !== null && entity.apt.equals(apt)){
            return entity;
        }
    });
    return undefined;
};

var instance = new TicketEntityProvider();

module.exports = instance;