/**
 * Created by Calvin on 2/14/2015.
 */
var moment = require('moment');

function TimeService(){
    this.ownNow = moment();
    this.isRunning = true;
}

TimeService.prototype.now = function(){
    if (this.isRunning){
        this.ownNow = moment();
    }
    return this.ownNow.clone();
};

TimeService.prototype.today = function(){
    return this.now().startOf('day');
};

TimeService.prototype.todayAsInt = function(){
    return parseInt(this.today().format('YYYYMMDD'));
};

TimeService.prototype.setOwnNow = function(value){
    this.ownNow = value;
    this.stop();
};

TimeService.prototype.stop = function(){
    this.isRunning = false;
}

TimeService.prototype.start = function(){
    this.isRunning = true;
}

var instance = new TimeService();
module.exports = instance;