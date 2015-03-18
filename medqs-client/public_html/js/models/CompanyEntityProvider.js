/**
 * Created by Calvin on 2/22/2015.
 */
var CompanyModel = require('./CompanyModel');
var EntityProvider = require('./EntityProvider');
var EntityType = require('../constants/EntityType');
var _ = require('lodash');

function CompanyEntityProvider(){
    EntityProvider.call(this);
}

CompanyEntityProvider.prototype = Object.create(EntityProvider.prototype);

CompanyEntityProvider.prototype.entityType = EntityType.COMPANY;

CompanyEntityProvider.prototype.create = function(id){
    var obj = new CompanyModel();
    if (!_.isUndefined(id)){
        obj.id = id;
    }
    return obj;
};

var instance = new CompanyEntityProvider();

module.exports = instance;