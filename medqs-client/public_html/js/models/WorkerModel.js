/**
 * Created by Calvin on 2/18/2015.
 */
var EntityModel = require('./EntityModel');

var WorkerModel = function(){
    this.id = null;
    this.lastName = null;
    this.firstName = null;
    this.phone = null;
    this.email = null;
    this.timePerSlotInMin = null;
    this.aptPerSlot = null;
    this.officeHours = [];

    // Other Entity
    // TODO company can be broken down into locations/branches, each location can have its own office hours
    // However each doctor may work in different locations
    this.company = null;
};

WorkerModel.prototype = Object.create(EntityModel.prototype);

WorkerModel.prototype.createInstance = function(){
    return new WorkerModel();
};

WorkerModel.prototype.mergeOwnProps = function(obj) {
    this.lastName = obj.lastName;
    this.firstName = obj.firstName;
    this.phone = obj.phone;
    this.email = obj.email;
    this.timePerSlotInMin = obj.timePerSlotInMin;
    this.aptPerSlot = obj.aptPerSlot;
    // TODO this way of merge may not be correct
    this.officeHours = obj.officeHours;
    return true;
};

WorkerModel.prototype.getOfficeHoursForDay = function(day){
    if (this.officeHours !== null && this.officeHours.length > 0){
        return _.map(this.officeHours[day], function(session) {
            return [session[0].clone(), session[1].clone()];
        });
    }
    return this.company.getOfficeHoursForDay(day);
};

module.exports = WorkerModel;