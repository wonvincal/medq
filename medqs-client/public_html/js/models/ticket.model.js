/* 
 * This is a helper class to provide helper method for Ticket related operation
 * Copyright 2014 Calvin Wong.
 *
 * There should be two type of tickets:
 * 1. Create on the fly
 * 2. Create base on an existing appointment
 *    i. An existing appointment can turn into a Scheduled ticket automatically or manually (an option on an appointment perhaps)
 */
var TicketStatus = require('./ticketstatus.model');

var cid = 0;

var Ticket = function() {
    this.cid = cid++;
    this.appointment = null;
    this.id = null;
    this.status = TicketStatus.INVALID;
}

module.exports = Ticket;

