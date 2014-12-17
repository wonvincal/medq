/* 
 * Copyright 2014 Calvin Wong.
 */
var cid = 0;

var AppointmentModel = function(id){
    this.id = id;
    this.cid = cid++;
    this.custName = "Patient Name";
    this.custId = "Patient ID";
    
    // property names need to be better
    this.appointmentTime = null;
    this.arrivalTime = null;
    this.estimatedAppointmentTime = null;
    this.elapsedTimeInSec = null;

    // each appointment should have some custom-made fields that are
    // industry specific, the rendering of those fields can be
    // configured as well
};

module.exports = AppointmentModel;
