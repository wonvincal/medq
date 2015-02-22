/**
 * After following the suggestion to use a Store to store queues, I found it really not too helpful to stick to this
 * rule.  This is what I can an Entity Store, and this is always the first store to receive server data (and convert)
 *
 * Created by Calvin on 1/24/2015.
 */
var QueueModel = require('./QueueModel');
var TicketEntityProvider = require('./TicketEntityProvider');
var WorkerEntityProvider = require('./WorkerEntityProvider');
var EntityProvider = require('./EntityProvider');
var _ = require('lodash');

function QueueEntityProvider(){
    EntityProvider.call(this);
}

QueueEntityProvider.prototype = Object.create(EntityProvider.prototype);

QueueEntityProvider.prototype.entityName = "Queue";

QueueEntityProvider.prototype.create = function(id){
    var obj = new QueueModel();
    if (!_.isUndefined(id)){
        obj.id = id;
    }
    return obj;
}

QueueEntityProvider.prototype.mergeOtherEntitiesWithJSON = function(obj, json){
    var tickets = [];
    if (!_.isUndefined(json.tickets) && json.tickets !== null && _.isArray(json.tickets)) {
        _.forEach(json.tickets, function (jsonObj) {
            // Merging of tickets are done by TicketEntityProvider separately
            tickets.push(TicketEntityProvider.getOrCreateObj(jsonObj.id, jsonObj.cid));
        });
    }
    obj.tickets = tickets;

    var workers = [];
    if (!_.isUndefined(json.workers) && json.workers !== null && _.isArray(json.workers)) {
        _.forEach(json.workers, function (jsonObj) {
            workers.push(WorkerEntityProvider.getOrCreateObj(jsonObj.id, jsonObj.cid));
        });
    }
    obj.workers = workers;
}

QueueEntityProvider.prototype.getQueues = function(){
    // todo should be a combination of _queues + _queuesByCid
    return _.values(this.entities);
}

var instance = new QueueEntityProvider();

module.exports = instance;