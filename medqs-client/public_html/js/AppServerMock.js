/**
 * Created by Calvin on 1/28/2015.
 */
var TicketStatus = require('./constants/TicketStatus');
var EntityState = require('./constants/EntityState');
var _ = require('lodash');

function zeroFill( number, width ) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

module.exports = {
    getQueues: function(){
        return localStorage.getItem('queues');
    },
    getCompanies: function(){
        return localStorage.getItem('companies');
    },
    getWorkers: function(){
        return localStorage.getItem('workers');
    },
    updateTicket: function(q, t){
        var queues = JSON.parse(localStorage.getItem('queues'));
        var queue = _.find(queues, function(item) { return (item.id === q.id);});
        if (queue === null){
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
    },
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
            // Need to store this somewhere - technically
        }
        console.log(queues);
        localStorage.setItem('queues', JSON.stringify(queues));

        var data = {};
        data.queue = queue;
        data.ticket = removedTicket;
        return JSON.stringify(data);
    },
    addOrUpdateApt: function (a) {
        // Create / update the appointment first
        var data = null;
        if (a.id === null) {
            data = this.addApt(a);
        }
        else {
            data = this.updateApt(a);
        }
        return data;
    },
    addApt: function(a){
        if (a === null) {
            throw new Error("Trying to add an appointment with invalid inputs");
        }
        if (a.id !== null) {
            throw new Error("Trying to create an appointment with id already");
        }
        if (a.cid === null) {
            throw new Error("Trying to create an appointment with no cid");
        }
        a.id = a.cid;
        a.state = EntityState.ACTIVE;
        var apts = JSON.parse(localStorage.getItem('apts'));
        var apt = _.find(apts, { "id": a.id });
        if (!_.isUndefined(apt)){
            throw new Error("Trying to create an appointment with a cid that already exists: " + a.cid);
        }
        apts.push(a);
        localStorage.setItem('apts', JSON.stringify(apts));

        var data = {};
        data.apt = a;
        return JSON.stringify(data);
    },
    updateApt: function(a){
        if (a === null) {
            throw new Error("Trying to update an apt with invalid inputs");
        }
        if (a.id === null) {
            throw new Error("Trying to update an apt with no id");
        }
        var apts = JSON.parse(localStorage.getItem('apts'));
        var index = _.findIndex(apts, { "id": a.id });
        if (index === -1){
            throw new Error("Trying to update an appointment that does not exist on the server: " + a.id);
        }
        apts[index] = a;
        localStorage.setItem('apts', JSON.stringify(apts));

        var data = {};
        data.apt = a;
        return JSON.stringify(data);
    },
    updateTicket: function(q, t) {
        if (q === null || t === null){
            console.error("invalid inputs: null queue or ticket");
            return null;
        }

        var queue = null;
        var queues = JSON.parse(localStorage.getItem('queues'));
        if (queues != null && queues.length > 0) {
            queue = _.find(queues, {"id": q.id});
        }
        if (queue === null) {
            console.error("no queue can be found with id: " + q.id);
            return null;
        }
        var index = _.findIndex(queue.tickets, function (item) {
            if ((item.id !== null && item.id === t.id) || (item.cid !== null && item.cid === t.cid)) {
                return true;
            }
            return false;
        });
        if (index === -1){
            console.error("no ticket can be found with id: " + t.id);
            return null;
        }

        // Add or update apt
        var apt = null;
        var result = this.addOrUpdateApt(t.apt);
        if (result !== null){
            result = JSON.parse(result);
            apt = result.apt;
        }
        t.apt = { "id" : apt.id, "cid" : apt.cid };

        console.log(queues);
        localStorage.setItem('queues', JSON.stringify(queues));

        var data = {};
        data.queue = queue;
        data.ticket = t;
        data.apt = apt;
        return JSON.stringify(data);
    },
    // Add Ticket + Add/Update Appointment
    addTicket: function(q, t, a) {
        // Check input parameters
        if (q === null || t === null){
            console.error("invalid inputs: null queue or ticket");
            return null;
        }
        var queue = null;
        var queues = JSON.parse(localStorage.getItem('queues'));
        if (queues != null && queues.length > 0) {
            queue = _.find(queues, {"id": q.id});
        }
        if (queue === null) {
            console.error("no queue can be found with id: " + q.id);
            return null;
        }

        // Add or update apt
        var apt = null;
        var result = this.addOrUpdateApt(a);
        if (result !== null){
            result = JSON.parse(result);
            apt = result.apt;
        }
        t.id = queue.nextTicketId;
        t.state = EntityState.ACTIVE;
        t.apt = { "id" : apt.id, "cid" : apt.cid};
        queue.tickets.push({ "id": t.id, "cid" : t.cid });
        var ticketIdPrefix = queue.nextTicketId.substring(0, 1);
        var ticketIdSeq = zeroFill(parseInt(queue.nextTicketId.substring(1)) + 1, 3);
        queue.nextTicketId = ticketIdPrefix + ticketIdSeq;
        console.log(queues);
        localStorage.setItem('queues', JSON.stringify(queues));

        var data = {};
        data.queue = queue;
        data.ticket = t;
        data.apt = apt;
        return JSON.stringify(data);
    }
}
