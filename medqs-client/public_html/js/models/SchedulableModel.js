/**
 * Created by Calvin on 3/3/2015.
 */
var EntityModel = require('./EntityModel');

function SchedulableModel(){
    EntityModel.call(this);
}

SchedulableModel.prototype = Object.create(EntityModel.prototype);

SchedulableModel.prototype.entityName = "Schedulable";

SchedulableModel.prototype.deepCompare = function(obj){
    return EntityModel.prototype.deepCompare.call(this, obj);
};

SchedulableModel.prototype.deepClone = function(){
    return EntityModel.prototype.deepClone.call(this);
};

SchedulableModel.prototype.getScheduleStartTime = function(){};

module.exports = SchedulableModel;