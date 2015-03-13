/**
 * Created by Calvin on 12/14/2014.
 */
var TicketStatus = { ARRIVED : 1, SCHEDULED : 2, PROCESSING : 3, CANCELLED: 4, INVALID : -1 };

TicketStatus.getString = function(item) {
    switch (item)
    {
        case 1:
            return "Arrived";
            break;
        case 2:
            return "Scheduled";
            break;
        case 3:
            return "Processing";
            break;
        case 4:
            return "Cancelled";
            break;
        default:
            return "Invalid";
    }
};

TicketStatus.getEnum = function(value){
    switch (value)
    {
        case 1:
            return this.ARRIVED;
            break;
        case 2:
            return this.SCHEDULED;
            break;
        case 3:
            return this.PROCESSING;
            break;
        case 4:
            return this.CANCELLED;
            break;
        default:
            return this.INVALID;
    }
};

TicketStatus.values = [1, 2, 3, 4, -1];
Object.freeze(TicketStatus);
module.exports = TicketStatus;
