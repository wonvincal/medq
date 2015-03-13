/**
 * After following the suggestion to use a Store to store queues, I found it really not too helpful to stick to this
 * rule.  This is what I can an Entity Store, and this is always the first store to receive server data (and convert)
 *
 * Created by Calvin on 1/24/2015.
 */
var QueueModel = require('./QueueModel');
var TicketEntityProvider = require('./TicketEntityProvider');
var WorkerEntityProvider = require('./WorkerEntityProvider');
var CompanyEntityProvider = require('./CompanyEntityProvider');
var EntityProvider = require('./EntityProvider');
var Comparator = require('../utils/Comparator');
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
};

QueueEntityProvider.prototype.mergeOtherEntitiesWithJSON = function(obj, json){
    var prevTickets = obj.tickets;
    var prevWorkers = obj.workers;
    var prevCompany = obj.company;
    obj.tickets = this.getOrCreateEntitiesWithJSON(json.tickets, TicketEntityProvider);
    obj.workers = this.getOrCreateEntitiesWithJSON(json.workers, WorkerEntityProvider);
    obj.company = this.getOrCreateEntityWithJSON(json.company, CompanyEntityProvider);
    return Comparator.containsSameEntities(prevTickets, obj.tickets) ||
            Comparator.containsSameEntities(prevWorkers, obj.workers) ||
            Comparator.isEqual(prevCompany, obj.company);
};

QueueEntityProvider.prototype.getQueues = function(){
    // todo should be a combination of _queues + _queuesByCid
    return _.values(this.entities);
};

var instance = new QueueEntityProvider();

module.exports = instance;