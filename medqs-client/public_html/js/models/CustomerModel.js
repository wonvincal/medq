/**
 * Created by Calvin on 2/22/2015.
 */
var EntityModel = require('./EntityModel');
var Comparator = require('../utils/Comparator');

var cid = 0;

function CustomerModel(){
    EntityModel.call(this);
    this.lastName = null;
    this.firstName = null;
    this.phone = null;
    this.email = null;
}

CustomerModel.prototype = Object.create(EntityModel.prototype);

CustomerModel.prototype.entityName = "Customer";

CustomerModel.prototype.createInstance = function(){
    return new CustomerModel();
};

CustomerModel.prototype.deepClone = function(){
    throw new Error("Not implemented");
};

CustomerModel.prototype.mergeOwnProps = function(obj) {
    var merged = 0;
    var properties = ["lastName", "firstName", "phone", "email"];
    _.forEach(properties, function(prop){
        merged |= Comparator.mergePropertyByName(this, obj, prop);
    }, this);

    return (merged != 0);
};

module.exports = CustomerModel;