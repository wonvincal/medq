/**
 * Created by Calvin on 3/5/2015.
 */
function EntityResultSet(){
    this.reads = [];
    this.updates = [];
    this.deletes = [];
}

EntityResultSet.prototype.addRead = function(item){
    this.reads.push(item);
};
EntityResultSet.prototype.getReads = function(){
    return this.updates;
};
EntityResultSet.prototype.addUpdate = function(item){
    this.updates.push(item);
};
EntityResultSet.prototype.getUpdates = function(){
    return this.updates;
};
EntityResultSet.prototype.addDelete = function(item){
    this.deletes.push(item);
};
EntityResultSet.prototype.getDeletes = function(){
    return this.deletes;
};
EntityResultSet.prototype.hasReadOrUpdates = function(){
    return (this.reads.length > 0) || (this.updates.length > 0);
};
EntityResultSet.prototype.hasChange = function(){
    return (this.updates.length > 0 || this.deletes.length > 0);
};

module.exports = EntityResultSet;