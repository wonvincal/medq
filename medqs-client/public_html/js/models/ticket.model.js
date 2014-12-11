/* 
 * This is a helper class to provide helper method for Ticket related operation
 * Copyright 2014 Calvin Wong.
 */
var Ticket = function(id, appt) {
    this.id = id;
    this.status = "Arrived";
    this.appointment = appt;
};

module.exports = Ticket;

