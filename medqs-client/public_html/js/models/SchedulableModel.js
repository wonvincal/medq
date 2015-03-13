/**
 * Created by Calvin on 3/3/2015.
 */
var EntityModel = require('./EntityModel');

function SchedulableModel(){
    EntityModel.call(this);
}

SchedulableModel.prototype = Object.create(EntityModel.prototype);

SchedulableModel.prototype.deepCompare = function(obj){
    return EntityModel.prototype.deepCompare.call(this, obj);
};

SchedulableModel.prototype.deepClone = function(){
    var clone = EntityModel.prototype.deepClone.call(this);
    return clone;
};

SchedulableModel.prototype.getScheduleStartTime = function(){};

module.exports = SchedulableModel;