/**
 * Created by Calvin on 2/22/2015.
 */
function EntityModel(){
    this.id = null;
    this.cid = null;
}

EntityModel.prototype.createInstance = function(){
    throw new Error("Not implemented");
};

EntityModel.prototype.mergeOwnProps = function(/* obj */){
    throw new Error("Not implemented");
};

EntityModel.prototype.deepClone = function(){
    var clone = this.createInstance();
    clone.id= this.id;
    clone.cid = this.cid;
    clone.mergeOwnProps(this);
    return clone;
};

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

EntityModel.prototype.getNextCid = function(){
    return generateUUID();
};

EntityModel.prototype.applyNextCid = function(){
    this.cid = this.getNextCid();
};

EntityModel.prototype.isEqual = function(obj){
    return (obj != null && (this.id === obj.id || this.cid === obj.cid));
};

EntityModel.prototype.mergeId = function(obj){
    // id is created from server
    // cid is created locally
    // You don't want to change a model's identity
    //
    // Situations
    // 1) Receive a model from server (with id and cid), don't merge cid
    //    if cid found, merge id from server into local object
    //    if cid not found, don't merge id
    // 2) Create a model locally, set only cid and leave id as null
    if ((this.cid !== null && this.cid === obj.cid)
        && (this.id === null && obj.id !== null)){
        this.id = obj.id;
        return true;
    }
    return false;
};

module.exports = EntityModel;