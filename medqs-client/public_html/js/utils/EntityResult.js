/**
 * Created by Calvin on 3/12/2015.
 */
var EntityResultSet = require('./EntityResultSet');
var AppConstant = require('../constants/AppConstant');

function EntityResult(){
    this.type = null;
    this.obj = null;
}

EntityResult.prototype.toEntityResultSet = function(){
    var result = new EntityResultSet();
    if (this.type === AppConstant.ENTITY_ADDED_OR_UPDATED){
        result.addUpdate(this.obj);
    }
    else if (this.type == AppConstant.ENTITY_DELETED){
        result.addDelete(this.obj);
    }
    else{
        result.addRead(this.obj);
    }
    return result;
};

module.exports = EntityResult;