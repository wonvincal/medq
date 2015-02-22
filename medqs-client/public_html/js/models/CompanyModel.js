/**
 * Each Shop has Queue(s) and Appointments.
 * Each Queue has Ticket(s) - fact.
 * Each Ticket can be consumed by one Actor - fact.
 * Each Queue can have more than one Actor (fan-out) - fact.
 * Each Queue is a sink to Tickets that satisfy certain criteria.
 * Each Ticket is associated with an Appointment - fact.
 * Each Appointment is owned by an Actor; an Appointment can have no Actor in the beginning.
 * Each Queue is owned by a Clinic.
 * Each Appointment is owned by a Clinic, later on assigned to a Doctor.
 *      Each Doctor has a list of assigned Appointments
 *      These Appointments turn into Tickets to the Doctor's Queue.
 * In a clinic scenario where a clinic has several doctors:
 *      Simple case:
 *          Doctor owns Appointments, which is belonged to Clinic
 *          Doctor owns one Queue, which is belonged to Clinic
 *          Doctor's Appointments are fed into the Doctor's Queue
 *      Large clinic case - fan out:
 *          Appointment is created, which is belonged to Clinic
 *          Queue is created, which is belonged to Clinic
 *          N Doctors
 *          Appointments are fed into the clinic's Queue.
 *          Doctors are Actors of Queue.
 *      Large clinic case - specific + fan out:
 *          Appointment is created, which is assigned to a Doctor, and is belonged to Clinic
 *          Appointment is created, with no assignee.
 *          Queue is created per Doctor.
 *          A Queue is created for the clinic, Appointments with no assignee turn into Ticket for this public Queue.
 *          Public Queue tickets are distributed in round robin to next available Doctor.
 *          Each doctor's Queue tickets will get inserted into the next Queue for medicine and billing.
 * Created by Calvin on 2/18/2015.
 */
var EntityModel = require('./EntityModel');

function CompanyModel() {
    EntityModel.call(this);
    this.name = null;
    this.officeHours = null;
}

CompanyModel.prototype = Object.create(EntityModel.prototype);

CompanyModel.prototype.createInstance = function(){
    return new CompanyModel();
};

CompanyModel.prototype.mergeOwnProps = function(obj) {
    this.name = obj.name;
    return true;
}

CompanyModel.prototype.mergeProps = function(apt){
    return this.mergeOwnProps(apt);
};


CompanyModel.prototype.getOfficeHours = function(){
    if (this.officeHours !== null && this.officeHours.length > 0){
        return this.officeHours;
    }
    return this.company.getOfficeHours();
};

module.exports = CompanyModel;