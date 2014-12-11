/* 
 * Copyright 2014 Calvin Wong.
 */
var AppointmentModel = function(id){
    this.id = id;
    this.custName = "Patient Name";
    this.custId = "Patient ID";
    
    // property names need to be better
    this.appointmentTime = null;
    this.arrivalTime = null;
    this.estimatedAppointmentTime = null;
    this.elapsedTimeInSec = null;
};

module.exports = AppointmentModel;
