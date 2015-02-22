var AptStatus = require('../constants/AptStatus');
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
var EntityModel = require('./EntityModel');
var moment = require('moment');

var cid = 0;

function AptModel(){
    EntityModel.call(this);
    this.schdId = null;
    this.status = AptStatus.INVALID;
    this.custName = null;
    this.phone = null;
    this.custId = null;
    this.receiveSMS = false;
    this.receiveCall = false

    // property names need to be better
    this.aptDateTime = null;
    this.arrivalTime = null;
    this.estAptTime = null;
    this.elapsedTimeInSec = null;

    // each appointment should have some custom-made fields that are
    // industry specific, the rendering of those fields can be
    // configured as well
}

AptModel.prototype = Object.create(EntityModel.prototype);

AptModel.prototype.createInstance = function(){
    return new AptModel();
};

AptModel.prototype.getNextCid = function(){
    return cid++;
};

AptModel.prototype.isEqual = function(apt){
    return (apt != null && this.schdId ===  apt.schdId && (this.id === apt.id || this.cid === apt.cid));
};

AptModel.prototype.mergeOwnProps = function(apt){
    this.status = parseInt(apt.status);
    this.custName = apt.custName;
    this.phone = apt.phone;
    this.custId = apt.custId;
    this.receiveSMS = apt.receiveSMS;
    this.receiveCall = apt.receiveCall;
    this.schdId = apt.schdId;
    if (typeof apt.aptDateTime === 'object'){
        this.aptDateTime = apt.aptDateTime.clone();
    }
    else{
        this.aptDateTime = moment(apt.aptDateTime);
    }
    this.arrivalTime = apt.arrivalTime;
    this.estAptTime = apt.estAptTime;
    this.elapsedTimeInSec = apt.elapsedTimeInSec;
    // todo return true only if there is a change
    return true;
};

AptModel.prototype.mergeProps = function(apt){
    return this.mergeOwnProps(apt);
};

module.exports = AptModel;