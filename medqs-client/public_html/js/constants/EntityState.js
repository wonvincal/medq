/**
 * Created by Calvin on 3/9/2015.
 */
var EntityState = { ACTIVE : 1, DELETED : 2, INVALID : -1 };

EntityState.getString = function(item) {
    switch (item)
    {
        case 1:
            return "Active";
            break;
        case 2:
            return "Deleted";
            break;
        default:
            return "Invalid";
    }
};

EntityState.getEnum = function(value){
    switch (value)
    {
        case 1:
            return this.ACTIVE;
            break;
        case 2:
            return this.DELETED;
            break;
        default:
            return this.INVALID;
    }
};

EntityState.values = [1, 2, -1];
Object.freeze(EntityState);
module.exports = EntityState;
