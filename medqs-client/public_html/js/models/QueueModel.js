/* 
 * Queue Model - hold data of a queue.  We should be very conscious about the
 * amount of data stored on the client side: 1) security, 2) size
 * 1) don't send over data that is not necessary
 * 2) don't store data that is not necessary
 *
 * Copyright 2014 Calvin Wong.
 * Status: Completed
 */
var _ = require('lodash');
var EntityModel = require('./EntityModel');
var EntityType = require('../constants/EntityType');
var Comparator = require('../utils/Comparator');

var cid = 0;

function QueueModel(){
    EntityModel.call(this);
    this.name = null;
    this.numWaiting = 0;
    this.nextTicketDisplayId = "-";

    // Other entities
    this.tickets = [];
    // Can a queue has more than one worker? Sure.  What's the use of 'workers'?  In our case, it is used to display
    // heatmap - define the heatmap duration base on the office hours of the workers.
    // this doesn't make much sense !!!!
    this.workers = [];
    this.company = null;
}

QueueModel.prototype = Object.create(EntityModel.prototype);

QueueModel.prototype.entityName = EntityType.QUEUE;

// TODO who knows, we may have a way to set default worker for a particular queu
QueueModel.prototype.getSelectedWorker = function(){
    if (this.workers.length > 0){
        return this.workers[0];
    }
};

QueueModel.prototype.hasTicket = function(input){
    return !_.isUndefined(_.find(this.tickets, function(ticket){
        return input.isEqual(ticket);
    }));
};

QueueModel.prototype.createInstance = function(){
    return new QueueModel();
};

QueueModel.prototype.deepClone = function(){
    throw new Error("Not implemented");
};

QueueModel.prototype.getNextCid = function(){
    return cid++;
};

QueueModel.prototype.mergeOwnProps = function(obj) {
    var merged = 0;
    if (!_.isUndefined(obj.numWaiting)){
        merged |= Comparator.mergeProperty(this, "numWaiting", parseInt(obj.numWaiting));
    }

    var properties = ["name", "nextTicketDisplayId"];
    _.forEach(properties, function(prop){
        merged |= Comparator.mergePropertyByName(this, obj, prop);
    }, this);
    return (merged != 0);
};

QueueModel.prototype.getOfficeHoursForDay = function(day){
    if (this.workers !== null && this.workers.length > 0){
        // TODO union the office hours of list of workers
        return this.workers[0].getOfficeHoursForDay(day);
    }
    return this.company.getOfficeHoursForDay(day);
};

module.exports = QueueModel;