/* 
 * This is a helper class to provide helper method for Ticket related operation
 * Copyright 2014 Calvin Wong.
 *
 * There should be two type of tickets:
 * 1. Create on the fly
 * 2. Create base on an existing appointment
 *    i. An existing appointment can turn into a Scheduled ticket automatically or manually (an option on an appointment perhaps)
 */
var SchedulableModel = require('./SchedulableModel');
var EntityType = require('../constants/EntityType');
var TicketStatus = require('../constants/TicketStatus');
var Comparator = require('../utils/Comparator');
var _ = require('lodash');

var cid = 0;

function TicketModel() {
    SchedulableModel.call(this);
    this.displayId = null;
    this.apt = null;
    this.status = TicketStatus.INVALID;
    this.scheduledTime = null;
}

TicketModel.prototype = Object.create(SchedulableModel.prototype);

TicketModel.prototype.entityName = EntityType.TICKET;

TicketModel.prototype.createInstance = function(){
    return new TicketModel();
};

// TODO deepCompare not yet complete
TicketModel.prototype.deepCompare = function(obj){
    return SchedulableModel.prototype.deepCompare.call(this, obj);
};

TicketModel.prototype.deepClone = function(){
    var clone = SchedulableModel.prototype.deepClone.call(this);
    if (this.apt !== null){
        clone.apt = this.apt.deepClone();
    }
    return clone;
};

TicketModel.prototype.getNextCid = function(){
    return cid++;
};

TicketModel.prototype.mergeOwnProps = function(ticket) {
    var merged = 0;
    merged |= Comparator.mergeMomentPropertyByName(this, ticket, "scheduledTime");
    // Since we need to do a parseInt, it is possible that we will get a NaN in return.
    // And that will screw up the existing methods in Comparator.  Therefore, it is better
    // to do an extra isUndefined check now to avoid NaN.
    if (!_.isUndefined(ticket.status)){
        merged |= Comparator.mergeProperty(this, "status", parseInt(ticket.status));
    }
    if (!_.isUndefined(ticket.displayId)){
        merged |= Comparator.mergeProperty(this, "displayId", ticket.displayId);
    }

    return (merged != 0);
};

TicketModel.prototype.getScheduleStartTime = function() {
    return (this.scheduledTime !== null) ? this.scheduledTime : ((this.apt !== null) ? this.apt.getScheduleStartTime() : null);
};

module.exports = TicketModel;