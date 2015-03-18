/**
 * Created by Calvin on 2/22/2015.
 */
var WorkerModel = require('./WorkerModel');
var EntityProvider = require('./EntityProvider');
var CompanyEntityProvider = require('./CompanyEntityProvider');
var Comparator = require('../utils/Comparator');
var EntityType = require('../constants/EntityType');
var _ = require('lodash');

function WorkerEntityProvider(){
    EntityProvider.call(this);
}

WorkerEntityProvider.prototype = Object.create(EntityProvider.prototype);

WorkerEntityProvider.prototype.entityType = EntityType.WORKER;

WorkerEntityProvider.prototype.create = function(id){
    var obj = new WorkerModel();
    obj.id = id;
    return obj;
};

WorkerEntityProvider.prototype.mergeOtherEntitiesWithJSON = function(obj, json) {
    var prevCompany = obj.company;
    obj.company = this.getOrCreateEntityWithJSON(json.company, CompanyEntityProvider);
    return Comparator.isEqual(prevCompany, obj.company);
};

var instance = new WorkerEntityProvider();

module.exports = instance;