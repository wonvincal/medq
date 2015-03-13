/**
 * Created by Calvin on 2/28/2015.
 */
var AppConstant = require('../constants/AppConstant');
var Change = require('./EntityResultSet');
var TicketEntityProvider = require('../models/TicketEntityProvider');
var _  = require('lodash');

function HeatmapDataFilter(){
    this.asof = null;
    this.tickets = {};
    this.aptsWithTickets = {};
    this.aptsWithNoTickets = {};
}

HeatmapDataFilter.prototype.init = function(tickets, apts){
    // For each ticket
    // 1) add it to this.tickets
    // 2) add the apt to this.apts
    // 3) create a link of it and add it to this.links
    var result = [];
    this.tickets = {};
    this.aptsWithTickets = {};
    this.aptsWithNoTickets = {};
    _.forEach(tickets, function(ticket){
        var startTime = ticket.getScheduleStartTime();
        if (!startTime.isSame(this.asof, 'day')) {
            return;
        }
        this.tickets[ticket.id] = ticket;
        result.push(ticket);
        if (ticket.apt !== null){
            this.aptsWithTickets[ticket.apt.id] = true;
        }
    }, this);

    _.forEach(apts, function(apt){
        var startTime = apt.aptDateTime;
        if (!startTime.isSame(this.asof, 'day')) {
            return;
        }
        var existingApt = this.aptsWithTickets[apt.id];
        if (!_.isUndefined(existingApt)) {
            return;
        }
        this.aptsWithNoTickets[apt.id] = apt;
        result.push(apt);
    }, this);
    return result;
};

// change: modify, delete
//
HeatmapDataFilter.prototype.takeTicket = function(ticket){
    var existingApt = null;
    var change = new Change();
    var existingTicket = this.tickets[ticket.id];
    if (!_.isUndefined(existingTicket)){
        change.addCreate(ticket);
        this.tickets[ticket.id] = ticket;
        // Check if apt has been changed
        if (ticket.apt !== null){
            // Move from aptsWithNoTickets to aptsWithTickets
            // The list will need to be regenerated
            existingApt = this.aptsWithNoTickets[ticket.apt.id];
            if (!_.isUndefined(existingApt)) {
                this.aptsWithNoTickets[ticket.apt.id] = undefined;
                change.addDelete(existingApt);
            }
            this.aptsWithTickets[ticket.apt.id] = ticket.apt;
        }
    }
    else{
        // Is the change specific to Ticket or Apt
        var changed = existingTicket.deepCompare(ticket);
        if (changed){
            change.addUpdate(ticket);
        }
        if (existingTicket.apt !== ticket.apt){
            if (existingTicket.apt !== null){
                this.aptsWithTickets[existingTicket.apt.id] = undefined;
            }
        }
        if (ticket.apt !== null){
            // Move from aptsWithNoTickets to aptsWithTickets
            // The list will need to be regenerated
            existingApt = this.aptsWithNoTickets[ticket.apt.id];
            if (!_.isUndefined(existingApt)) {
                this.aptsWithNoTickets[ticket.apt.id] = undefined;
                change.addDelete(existingApt);
            }
            this.aptsWithTickets[ticket.apt.id] = ticket.apt;
        }
    }
    return changed;
};

HeatmapDataFilter.prototype.takeApt = function(apt){
    var existing = this.aptsWithTickets[apt.id];
    if (!_.isUndefined(existing)){
        this.tickets[ticket.id] = ticket;
        return true;
    }
    var changed = existing.deepCompare(ticket);
    this.tickets[ticket.id] = ticket;
    return changed;
};

HeatmapDataFilter.prototype.receiveAction = function(asof, actionType, data){
    var tickets = [];
    var apts = [];
    switch (actionType) {
        case AppConstant.RECEIVE_TICKETS:
            tickets = _.map(data, function(ticket){
               return (this.takeTicket(ticket));
            }, this);
            break;
        case AppConstant.RECEIVE_APTS:
            // data is an EntityResultSet
            apts = _.map(data, function(apt){
                return (this.takeApt(apt));
            }, this);
            break;
        default:
            break;
    }
    // Traverse the collection to return only the changes
};

module.exports = HeatmapDataFilter;

// Heatmap Data Filter returns the ticket
// Heatmap Store determines which slot has been changed
// EntityChange - Update, Add, Delete
// Should a 'canceled' entity be considered as Delete
// Queue.react.js
// - Show: Ticket with Status not in ('Canceled', 'Completed')
// - Hide: Ticket with Status in ('Canceled', 'Completed'), or Deleted
// Note: There will be
// TicketAptEditor.react.js
// - Show: Any Ticket or Apt that can be selected
// //Ticket with Status not in ('Canceled', 'Completed')
// - Show: Apt with Status not in
// Heatmap.react.js
// - Show: Any Ticket or Apt that can be selected
// Calendar.react.js
// - Show: Apt with Status not in ('Canceled')
// Ticket completed - notified the person

// Server will decide when to delete an entity