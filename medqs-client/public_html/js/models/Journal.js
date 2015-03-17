/**
 * Created by Calvin on 3/14/2015.
 */
var EntityModel = require('./EntityModel');
var Comparator = require('../utils/Comparator');
var moment = require('moment');
var _ = require('lodash');

var cid = 0;

function JournalModel(){
    EntityModel.call(this);
    this.date = null;
    this.note = null;
}

JournalModel.prototype = Object.create(EntityModel.prototype);

JournalModel.prototype.entityName = "Journal";

JournalModel.prototype.createInstance = function(){
    return new JournalModel();
};

JournalModel.prototype.mergeOwnProps = function(obj) {
    var merged  = Comparator.mergePropertyByName(this, obj, "note");
    merged = Comparator.mergeMomentPropertyByName(this, obj, "date") || merged;
    return merged;
};

module.exports = JournalModel;