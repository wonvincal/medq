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
    this.officeHours = null;

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
    return true;
};

WorkerModel.prototype.mergeProps = function(apt){
    return this.mergeOwnProps(apt);
};

WorkerModel.prototype.getOfficeHours = function(){
    if (this.officeHours !== null && this.officeHours.length > 0){
        return this.officeHours;
    }
    return this.company.getOfficeHours();
};

module.exports = WorkerModel;