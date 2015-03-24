/**
 * Helper function to compare objects
 *
 * All shouldMerge* methods are not NaN friendly; that is, these methods would return true if dest is NaN.
 *
 * Note on NaN - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
 * NaN never equals to NaN.  If a dest is NaN, we are not going to merge it.
 * I don't want to use _.isNaN() here to avoid more string conversion operation.
 *
 * Created by Calvin on 3/10/2015.
 */
var moment = require('moment');
var _ = require('lodash');

module.exports = {
    shouldMerge: function(source, dest, equalFunc){
        if (_.isUndefined(dest)) {
            return false;
        }
        if (dest === null) {
            return (source !== null);
        }
        // At this point, dest is not null and is not undefined
        if (!source) {
            return true;
        }
        if (!equalFunc){
            return (source !== dest);
        }
        return equalFunc(source, dest);
    },
    shouldMergeMoments: function(source, dest, gran) {
        // Copy and paste the whole method to avoid a tiny bit of performance penalty
        // from closure
        if (gran === undefined){
            return this.shouldMerge(source, dest, function(s, d){
                return !(s.isSame(d, 'second'));
            });
        }
        return this.shouldMerge(source, dest, function(s, d){
            return !(s.isSame(d, gran));
        });
    },
    mergePropertyByName: function(sourceObj, destObj, property){
        return this.mergeProperty(sourceObj, property, destObj[property]);
    },
    mergeProperty: function(sourceObj, property, destVal){
        if (this.shouldMerge(sourceObj[property], destVal)){
            sourceObj[property] = destVal;
            return true;
        }
        return false;
    },
    /**
     * destVal can be a string or a moment object.
     * If destVal is a moment, a clone of that will be made.
     */
    mergeMomentPropertyByName: function(sourceObj, destObj, property, gran){
        var momentValue;
        var destVal = destObj[property];
        if (_.isUndefined(destVal)) {
            return false;
        }
        if (destVal === null) {
            if (sourceObj[property] === null){
                return false;
            }
            else{
                sourceObj[property] = null;
                return true;
            }
        }
        if (moment.isMoment(destVal)){
            momentValue = destVal.clone();
        }
        else{
            momentValue = moment(destVal);
        }
        if (this.shouldMergeMoments(sourceObj[property], momentValue, gran)){
            sourceObj[property] = momentValue;
            return true;
        }
        return false;
    },
    isEqual: function(entity1, entity2){
        if (entity1 === undefined){
            return (entity2 === undefined);
        }
        if (entity1 === null){
            return (entity2 === null);
        }
        return entity1.isEqual(entity2);
    },
    containsSameEntities: function(entities1, entities2){
        var ids = {};
        var cids = {};
        _.forEach(entities1, function(obj){
            if (obj.id){
                ids[obj.id] = true;
            }
            if (obj.cid){
                cids[obj.cid] = true;
            }
        });
        for (var i = 0; i < entities2.length; i++){
            if (entities2[i].id){
                var found = ids[entities2[i].id];
                if (found !== undefined){
                    return false;
                }
                ids[entities2[i].id] = false;
            }
            if (entities2[i].cid){
                var found = ids[entities2[i].cid];
                if (found !== undefined){
                    return false;
                }
                cids[entities2[i].cid] = false;
            }
        }
        // If any true value exists, the arrays are different
        var anyDiff = _.some(ids, function(item){ return item; }) ||
                        _.some(cids, function(item){ return item; });
        return !anyDiff;
    }
};