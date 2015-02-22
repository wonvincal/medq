/**
 * Created by Calvin on 2/22/2015.
 */
var EntityModel = require('./EntityModel');

var cid = 0;

function CustomerModel(){
    EntityModel.call(this);
    this.lastName = null;
    this.firstName = null;
    this.phone = null;
    this.email = null;
}

CustomerModel.prototype = Object.create(EntityModel.prototype);

CustomerModel.prototype.createInstance = function(){
    return new CustomerModel();
};

CustomerModel.prototype.deepClone = function(){
    throw new Error("Not implemented");
};

CustomerModel.prototype.mergeOwnProps = function(obj) {
    this.lastName = obj.lastName;
    this.firstName = obj.firstName;
    this.phone = obj.phone;
    this.email = obj.email;
    return true;
};

module.exports = CustomerModel;