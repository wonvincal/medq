/**
 * Created by Calvin on 2/10/2015.
 */
var AptStatus = { ACTIVE : 1, CANCELLED: 2, INVALID : -1 };

AptStatus.getString = function(item) {
    switch (item)
    {
        case 1:
            return "Active";
            break;
        case 2:
            return "Cancelled";
            break;
        default:
            return "Invalid";
    }
};
AptStatus.getEnum = function(value){
    switch (value)
    {
        case 1:
            return this.ACTIVE;
            break;
        case 2:
            return this.CANCELLED;
            break;
        default:
            return this.INVALID;
    }
};
AptStatus.values = [1, 2, -1];
Object.freeze(AptStatus);
module.exports = AptStatus;
