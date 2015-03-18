/**
 * Created by Calvin on 2/18/2015.
 */
var EntityModel = require('./EntityModel');
var EntityType = require('../constants/EntityType');
var Comparator = require('../utils/Comparator');
var _ = require('lodash');

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

WorkerModel.prototype.entityName = EntityType.WORKER;

WorkerModel.prototype.createInstance = function(){
    return new WorkerModel();
};

WorkerModel.prototype.mergeOwnProps = function(obj) {
    var merged = 0;
    var properties = ["lastName", "firstName", "phone", "email", "timePerSlotInMin", "aptPerSlot"];
    _.forEach(properties, function(prop){
        merged |= Comparator.mergePropertyByName(this, obj, prop);
    }, this);

    // TODO this way of merge may not be correct
    this.officeHours = obj.officeHours;

    return (merged != 0);
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