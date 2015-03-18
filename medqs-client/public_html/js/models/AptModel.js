/**
 * Copyright 2014 Calvin Wong.
 *
 * Each model must either have id or cid.
 * Each model must either have an id or a cid
 * id - has to be unique within the whole system.  a primary key should be consist of
 * 1. a system generated id - a unique database-auto-incremented id
 * 2. there may also be different unique constraints
 * cid - has to be unique within the whole system (client id + guid is good)
 *
 * Apt
 * id - database auto generated id (mandatory on server side)
 * cid - client generated id (e.g. GUID)
 * company_id - company (clinic) of which this appointment belongs to (mandatory)
 * customer - (mandatory)
 *              1) a string of the customer name - doesn't matter, we will create a record for that
 *              2) a system account - not applicable
 *              3) a clinic specific account - not required
 * worker/actor(s) - (not mandatory)
 *              1) assign to a default worker (by clinic)
 *              2) can be assigned to more than one workers
 */
var SchedulableModel = require('./SchedulableModel');
var EntityType = require('../constants/EntityType');
var AptStatus = require('../constants/AptStatus');
var Comparator = require('../utils/Comparator');
var moment = require('moment');
var _ = require('lodash');

var cid = 0;

function AptModel(){
    SchedulableModel.call(this);
    this.schdId = null;
    this.status = AptStatus.INVALID;
    this.custName = null;
    this.phone = null;
    this.custId = null;
    this.receiveSMS = false;
    this.receiveCall = false;

    // property names need to be better
    this.aptDateTime = null;
    this.arrivalTime = null;
    this.estAptTime = null;
    this.elapsedTimeInSec = null;

    // each appointment should have some custom-made fields that are
    // industry specific, the rendering of those fields can be
    // configured as well

    // Other entities
    this.workers = [];
}

AptModel.prototype = Object.create(SchedulableModel.prototype);

AptModel.prototype.createInstance = function(){
    return new AptModel();
};

AptModel.prototype.entityName = EntityType.APT;

AptModel.prototype.getNextCid = function(){
    return cid++;
};

AptModel.prototype.mergeOwnProps = function(apt){
    var merged = 0;
    if (!_.isUndefined(apt.status)){
        merged |= Comparator.mergeProperty(this, "status", parseInt(apt.status));
    }
    var properties = ["custName", "phone", "custId", "receiveSMS", "receiveCall", "schdId", "elapsedTimeInSec"];
    _.forEach(properties, function(prop){
        merged |= Comparator.mergePropertyByName(this, apt, prop);
    }, this);

    var momentProps = ["aptDateTime", "arrivalTime", "estAptTime"];
    _.forEach(momentProps, function(prop){
        merged |= Comparator.mergeMomentPropertyByName(this, apt, prop);
    }, this);
    return (merged != 0);
};

AptModel.prototype.getScheduleStartTime = function() {
    return this.aptDateTime;
};

module.exports = AptModel;