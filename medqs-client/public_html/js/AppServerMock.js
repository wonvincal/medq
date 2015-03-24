/**
 * Created by Calvin on 1/28/2015.
 */
var TicketStatus = require('./constants/TicketStatus');
var EntityState = require('./constants/EntityState');
var EntityType = require('./constants/EntityType');
var _ = require('lodash');
var _nextIds = {};
var moment = require('moment');

_.forEach(EntityType, function(entityType){
    _nextIds[entityType] = 0;
});

function getAndIncId(entityType){
    return _nextIds[entityType]++;
}

function zeroFill( number, width ) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

function extractId(obj){
    var clone = {};
    clone.id = obj.id;
    var cid = obj.cid;
    if (!_.isUndefined(cid)){
        clone.cid = cid;
    }
    return clone;
}

function trimQueue(obj){
    // Remove company details
    obj.company = extractId(obj.company);
    // Remove ticket details
    obj.tickets = _.map(obj.tickets, function(item){
        return extractId(item);
    });
    // Remove worker details
    obj.workers = _.map(obj.workers, function(item){
        return extractId(item);
    });
    return obj;
}

function trimTicket(obj){
    obj.apt = extractId(obj.apt);
    return obj;
}

function trimApt(obj){
    obj.workers = _.map(obj.workers, function(worker){
        return extractId(worker);
    });
    return obj;
}

function trimWorker(obj){
    obj.company = extractId(obj.company);
    return obj;
}

module.exports = {
    /**
     * Pretend getting queues from the server.  Return queues details, but only ID of other entity
     * types.
     * @returns {*}
     */
    getQueues: function(){
        // Take away other entities details
        var str = localStorage.getItem('queues');
        var json = JSON.parse(str);

        var result = {};
        result[EntityType.QUEUE] = _.map(json, function(queue){
            return trimQueue(queue);
        });

        return JSON.stringify(result);
    },
    /**
     * Pretend getting companies from the server.  Return queues details, but only ID of other entity
     * types.
     * @returns {*}
     */
    getCompanies: function(){
        var result = {};
        result[EntityType.COMPANY] = JSON.parse(localStorage.getItem('companies'));
        return JSON.stringify(result);
    },
    /**
     * Pretend getting workers from the server.  Return queues details, but only ID of other entity
     * types.
     * @returns {*}
     */
    getWorkers: function(){
        var str = localStorage.getItem('workers');
        var json = JSON.parse(str);

        var result = {};
        result[EntityType.WORKER] = _.map(json, function(worker){
            return trimWorker(worker);
        });

        return JSON.stringify(result);
    },
    /**
     * Pretend creating new appointment at the server side, actually storing it in localStorage
     * @param apt
     * @returns String of apt
     */
    addApt: function(company, apt){
        if (apt === null) {
            throw new Error("Trying to add an appointment with invalid inputs");
        }
        if (apt.id !== null) {
            throw new Error("Trying to create an appointment with id already");
        }
        if (apt.cid === null) {
            throw new Error("Trying to create an appointment with no cid");
        }
        var existingCollection = JSON.parse(localStorage.getItem('apts'));
        var existing = _.find(existingCollection, { "cid": apt.cid });
        if (!_.isUndefined(existing)){
            throw new Error("Trying to create an appointment with a cid that already exists: " + apt.cid);
        }

        // Save the new appointment
        var clonedApt = apt.deepClone();
        clonedApt.id = getAndIncId(EntityType.APT);
        clonedApt.version++;
        clonedApt.state = EntityState.ACTIVE;
        existingCollection.push(clonedApt);
        localStorage.setItem('apts', JSON.stringify(existingCollection));

        clonedApt = trimApt(clonedApt);
        var result = {};
        result[EntityType.APT] = clonedApt;
        return JSON.stringify(result);
    },
    /**
     * Pretend updating appointment at the server side, actually updating it in localStorage
     * @param apt
     * @returns String of apt
     */
    updateApt: function(company, apt){
        if (apt === null) {
            throw new Error("Trying to update an apt with invalid inputs");
        }
        if (apt.id === null) {
            throw new Error("Trying to update an apt with no id");
        }
        var existingCollection = JSON.parse(localStorage.getItem('apts'));
        var index = _.findIndex(existingCollection, { "id": apt.id });
        if (index === -1){
            throw new Error("Trying to update an appointment that does not exist on the server: " + apt.id);
        }
        var clonedApt = apt.deepClone();
        clonedApt.version++;
        existingCollection[index] = clonedApt;
        localStorage.setItem('apts', JSON.stringify(existingCollection));

        clonedApt = trimApt(clonedApt);
        var result = {};
        result[EntityType.APT] = clonedApt;
        return JSON.stringify(result);
    },
    /**
     * Since adding a ticket and an appointment normal goes together, there should be
     * a method to do these two operations at the same time.
     *
     * Note: Methods are designed with less flexibility, so that the client must know
     * what it is doing.
     *
     * @param company
     * @param queue
     * @param ticket
     * @param apt
     * @returns {*}
     */
    addTicketAndApt: function(queue, ticket, apt) {
        // Check input parameters
        if (queue === null || ticket === null || apt === null){
            console.error("invalid inputs: null queue or ticket or apt");
            return null;
        }
        if (ticket.id !== null){
            console.error("invalid input: ticket already exists: " + ticket.id);
            return null;
        }
        if (apt.id !== null){
            console.error("invalid input: apt already exists: " + apt.id);
            return null;
        }
        var existingQueue = null;
        var existingQueues = JSON.parse(localStorage.getItem('queues'));
        if (existingQueues != null && existingQueues.length > 0) {
            existingQueue = _.find(existingQueues, {"id": queue.id});
        }
        if (existingQueue === null) {
            console.error("no queue can be found with id: " + queue.id);
            return null;
        }

        var clonedApt = null;
        var result = this.addApt(queue.company, apt);
        if (result !== null){
            result = JSON.parse(result);
            clonedApt = result[EntityType.APT];
        }

        var clonedTicket = ticket.deepClone();
        clonedTicket.displayId = existingQueue.nextTicketDisplayId;
        clonedTicket.id = getAndIncId(EntityType.TICKET);
        clonedTicket.version++;
        clonedTicket.state = EntityState.ACTIVE;
        clonedTicket.apt = clonedApt;
        existingQueue.tickets.push(clonedTicket);
        existingQueue.version++;

        var ticketIdPrefix = existingQueue.nextTicketDisplayId.substring(0, 1);
        var ticketIdSeq = zeroFill(parseInt(existingQueue.nextTicketDisplayId.substring(1)) + 1, 3);
        existingQueue.nextTicketDisplayId = ticketIdPrefix + ticketIdSeq;
        localStorage.setItem('queues', JSON.stringify(existingQueues));

        var result = {};
        result[EntityType.QUEUE] = trimQueue(existingQueue);
        result[EntityType.TICKET] = trimTicket(clonedTicket);
        result[EntityType.APT] = trimApt(clonedApt);
        return JSON.stringify(result);
    },
    updateTicket: function(company, queue, ticket) {
        if (queue === null || ticket === null){
            console.error("invalid inputs: null queue or ticket");
            return null;
        }

        var existingQueue = null;
        var existingQueues = JSON.parse(localStorage.getItem('queues'));
        if (existingQueues != null && existingQueues.length > 0) {
            existingQueue = _.find(existingQueues, {"id": queue.id});
        }
        if (existingQueue === null) {
            console.error("no queue can be found with id: " + queue.id);
            return null;
        }
        var index = _.findIndex(existingQueue.tickets, {"id": ticket.id});
        if (index === -1){
            console.error("no ticket can be found with id: " + ticket.id);
            return null;
        }
        var clonedTicket = ticket.deepClone();
        clonedTicket.version++;
        existingQueue.tickets[index] = clonedTicket;
        localStorage.setItem('queues', JSON.stringify(existingQueues));

        var result = {};
        result[EntityType.QUEUE] = trimQueue(existingQueue);
        result[EntityType.TICKET] = trimTicket(clonedTicket);
        return JSON.stringify(result);
    }
    /*,
    cancelTicket: function(q, t) {
        var queues = JSON.parse(localStorage.getItem('queues'));
        var queue = _.find(queues, function (item) {
            return (item.id === q.id);
        });
        if (queue === null) {
            return null;
        }
        var tickets = queue.tickets;
        var removedTicket = null;
        var i = _.findIndex(tickets, function (item) {
            if ((item.id !== null && item.id === t.id) || (item.cid !== null && item.cid === t.cid)) {
                return true;
            }
            return false;
        });
        if (i !== -1) {
            removedTicket = tickets.splice(i, 1)[0];
            removedTicket.status = TicketStatus.CANCELLED;
            removedTicket.version++;
            // Need to store this somewhere - technically
        }
        console.log(queues);
        localStorage.setItem('queues', JSON.stringify(queues));

        var data = {};
        data.queue = queue;
        data.ticket = removedTicket;
        return JSON.stringify(data);
    }*/
};
