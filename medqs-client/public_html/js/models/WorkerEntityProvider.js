/**
 * Created by Calvin on 2/22/2015.
 */
var WorkerModel = require('./WorkerModel');
var EntityProvider = require('./EntityProvider');
var CompanyEntityProvider = require('./CompanyEntityProvider');
var _ = require('lodash');

function WorkerEntityProvider(){
    EntityProvider.call(this);
}

WorkerEntityProvider.prototype = Object.create(EntityProvider.prototype);

WorkerEntityProvider.prototype.entityName = "Worker";

WorkerEntityProvider.prototype.create = function(id){
    var obj = new WorkerModel();
    obj.id = id;
    return obj;
};

WorkerEntityProvider.prototype.mergeOtherEntitiesWithJSON = function(obj, json) {
    obj.company = this.getOrCreateEntityWithJSON(json.company, CompanyEntityProvider);
};

var instance = new WorkerEntityProvider();

module.exports = instance;