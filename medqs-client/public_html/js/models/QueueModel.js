/* 
 * Queue Model - hold data of a queue.  We should be very conscious about the
 * amount of data stored on the client side: 1) security, 2) size
 * 1) don't send over data that is not necessary
 * 2) don't store data that is not necessary
 *
 * Copyright 2014 Calvin Wong.
 * Status: Completed
 */
var EntityModel = require('./EntityModel');

var cid = 0;

function QueueModel(){
    EntityModel.call(this);
    this.name = null;
    this.numWaiting = 0;
    this.nextTicketId = "-";

    // Other entities
    this.tickets = [];
    // Can a queue has more than one worker? Sure.  What's the use of 'workers'?  In our case, it is used to display
    // heatmap - define the heatmap duration base on the office hours of the workers.
    this.workers = [];
    this.company = null;
}

QueueModel.prototype = Object.create(EntityModel.prototype);

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
    this.name = obj.name;
    this.numWaiting = parseInt(obj.numWaiting);
    this.nextTicketId = obj.nextTicketId;
    return true;
};

QueueModel.prototype.getOfficeHours = function(){
    if (this.workers !== null && this.workers.length > 0){
        // TODO union the office hours of list of workers
        return this.workers[0].getOfficeHours();
    }
    return this.company.getOfficeHours();
};

module.exports = QueueModel;