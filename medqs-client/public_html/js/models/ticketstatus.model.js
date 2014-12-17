/**
 * Created by Calvin on 12/14/2014.
 */
var TicketStatus = { ARRIVED : 1, SCHEDULED : 2, PROCESSING : 3, INVALID : -1 }

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
        default:
            return "Invalid";
    }
}

TicketStatus.values = [1, 2, 3, -1];
Object.freeze(TicketStatus);
module.exports = TicketStatus;
