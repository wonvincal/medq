/**
 * Created by Calvin on 1/24/2015.
 */
var AptModel = require('../models/AptModel');
var EntityProvider = require('./EntityProvider');
var _ = require('lodash');

function AptEntityProvider(){
    EntityProvider.call(this);
}

AptEntityProvider.prototype = Object.create(EntityProvider.prototype);

AptEntityProvider.prototype.entityType = "Apt";

AptEntityProvider.prototype.create = function(id){
    var obj = new AptModel();
    obj.id = id;
    return obj;
};

AptEntityProvider.prototype.getByWorkers = function(workers){
    var ids = {};
    _.forEach(workers, function(worker){
        ids[worker.id] = true;
    });
    return _.filter(this.entities, function(apt) {
        return (_.some(apt.workers, function(worker){
            return (!_.isUndefined(ids[worker.id]));
        }));
    });
};

AptEntityProvider.prototype.getByWorkersAndDate = function(workers, aptDate){
    var apts = this.getByWorkers(workers);
    return _.filter(apts, function(apt){
        return (apt.aptDateTime.isSame(aptDate, "day"));
    });
};

var instance = new AptEntityProvider();

module.exports = instance;