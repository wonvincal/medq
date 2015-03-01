/* 
 * This is a helper class to provide helper method for Ticket related operation
 * Copyright 2014 Calvin Wong.
 *
 * There should be two type of tickets:
 * 1. Create on the fly
 * 2. Create base on an existing appointment
 *    i. An existing appointment can turn into a Scheduled ticket automatically or manually (an option on an appointment perhaps)
 */
var EntityModel = require('./EntityModel');
var TicketStatus = require('../constants/TicketStatus.js');

var cid = 0;

function TicketModel() {
    EntityModel.call(this);
    this.queueId = null;
    this.apt = null;
    this.status = TicketStatus.INVALID;
    this.scheduledTime = null;
}

TicketModel.prototype = Object.create(EntityModel.prototype);

TicketModel.prototype.createInstance = function(){
    return new TicketModel();
};

TicketModel.prototype.deepClone = function(){
    var clone = EntityModel.prototype.deepClone.call(this);
    if (this.apt !== null){
        clone.apt = this.apt.deepClone();
    }
    return clone;
};

TicketModel.prototype.getNextCid = function(){
    return cid++;
};

TicketModel.prototype.isEqual = function(ticket){
    return (ticket != null && (this.id === ticket.id || this.cid === ticket.cid));
};

TicketModel.prototype.mergeOwnProps = function(ticket) {
    this.queueId = ticket.queueId;
    this.scheduledTime = ticket.scheduledTime;
    this.status = parseInt(ticket.status);
    return true;
};

TicketModel.prototype.getScheduledTime = function() {
    return (this.scheduledTime !== null) ? this.scheduledTime : ((this.apt !== null) ? this.apt.aptDateTime : null);
}
/*
TicketModel.prototype.mergeProps = function(ticket){
    this.mergeOwnProps(ticket);
    this.apt.mergeProps(ticket.apt);
    return true;
};
*/
module.exports = TicketModel;