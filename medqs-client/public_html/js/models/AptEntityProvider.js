/**
 * Created by Calvin on 1/24/2015.
 */
var AptModel = require('../models/AptModel');
var AptStatus = require('../constants/AptStatus');
var EntityProvider = require('./EntityProvider');
var _ = require('lodash');

function AptEntityProvider(){
    EntityProvider.call(this);
}

AptEntityProvider.prototype = Object.create(EntityProvider.prototype);

AptEntityProvider.prototype.create = function(id){
    var obj = new AptModel();
    //obj.schdId = schdId;
    obj.id = id;
    //obj.status = AptStatus.ACTIVE;
    return obj;
}

var instance = new AptEntityProvider();

module.exports = instance;