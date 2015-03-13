/**
 * Created by Calvin on 2/28/2015.
 */
var _id = 0;

function getNextId(){
    return _id++;
}

function Link(){
    this.entity = null;
    this.id = getNextId();
}

Link.prototype.getStartTime = function(){
    return this.entity.getScheduleStartTime();
}

module.exports = Link;