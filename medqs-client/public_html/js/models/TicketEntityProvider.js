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
var _ = require('lodash');

function TicketEntityProvider(){
    EntityProvider.call(this);
}

TicketEntityProvider.prototype = Object.create(EntityProvider.prototype);

TicketEntityProvider.prototype.create = function(id) {
    var obj = new TicketModel();
//    obj.queueId = queueId;
    obj.id = id;
    return obj;
};

TicketEntityProvider.prototype.mergeOtherEntitiesWithJSON = function(current, json) {
    if (!_.isUndefined(json.apt) && json.apt !== null) {
        var schId = json.apt.schId;
        var aptId = json.apt.id;
        if (!_.isUndefined(schId) && schId !== null && !_.isUndefined(aptId) && aptId !== null) {
            // Merging would be done separately
            current.apt = AptEntityProvider.getOrCreateObj(schId, aptId, json.apt.cid);
        }
    }
};

var instance = new TicketEntityProvider();

module.exports = instance;