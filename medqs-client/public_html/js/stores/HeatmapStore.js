/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ConfigModel = require('../models/ConfigModel');
var AppConstant = require('../constants/AppConstant');
var TicketEntityProvider = require('../models/TicketEntityProvider');
var AptEntityProvider = require('../models/AptEntityProvider');
var _ = require('lodash');

var _asOf = null;
var _timeFormat = null;
var _slots = [];  // generate from a source (or different source)
var _extraSlot = {"start" : undefined, "end" : undefined, "items" : []};
var _filter = {};
var _officeHours = [];

var _tickets = {};
var _aptsWithTicket = {};
var _apts = {};

//var _all = null;
var _status = "";

// Use Case
// For slots
// #1 global settings from ConfigModel (after logged in)
// For apts
// #1 heatmap for tickets for a selected queue (for queue view)
// #2 heatmap for appointments for a selected worker (for apt view)
// #3 heatmap for appointments (of a queue, of a worker) on a particular day
// queue vs worker
// What is office hour?
// office hours of a worker is specific to a worker
// office hours of a queue is the office hours of default workers of the queue
// Detect ConfigModel change to generate slots

// get tickets
// get appointments

// 1. If filter changes or slot changes, call generateHeatmap
// 2.   Keep listening to changes of tickets and apts
function generateHeatmap() {
    var tickets = [];
    var apts = [];
    var filterQueue = _filter[AppConstant.FILTER_TYPE_QUEUE];
    var filterWorker = _filter[AppConstant.FILTER_TYPE_WORKER];
    if (_asOf === null || (_.isUndefined(filterQueue) && _.isUndefined(filterWorker))) {
        return false;
    }
    if (!_.isUndefined(filterQueue)){
        _officeHours = filterQueue.getOfficeHoursForDay(_asOf.day());
        tickets = TicketEntityProvider.getByQueue(filterQueue);
    }
    else{
        _officeHours = filterWorker.getOfficeHoursForDay(_asOf.day());
        tickets = TicketEntityProvider.getByWorkers([filterWorker]);
        apts = AptEntityProvider.getByWorkers([filterWorker]);
    }
    if (_officeHours.length <= 0){
        _status = "Office hours info not available";
        return true;
    }

    // Create slots - need to find a good place for reading time display format and slot size
    _timeFormat = ConfigModel.getHeatmapSlotTimeDisplayFormat();
    _slots = generateSlots(_officeHours, ConfigModel.getHeatmapSlotDurInMin());

    // Organize tickets and apts
    _tickets = {};
    _aptsWithTicket = {};
    _.forEach(tickets, function(ticket){
        _tickets[ticket.id] = ticket;
        _aptsWithTicket[ticket.apt.id] = true;
        addTicketToSlot(ticket);
    });
    _apts = {};
    _.forEach(apts, function(apt){
        if (_.isUndefined(_aptsWithTicket[apt.id])){
            _apts[apt.id] = apt;
        }
        addAptToSlot(apt);
    });
    return true;
}

function addTicketToSlot(ticket){
    return addItemToSlot({"entityType": "ticket", "entity": ticket, "time": ticket.getScheduleStartTime()}, _slots, _extraSlot);
}

function addAptToSlot(apt){
    return addItemToSlot({"entityType": "apt", "entity": apt, "time": apt.aptDateTime}, _slots, _extraSlot);
}

function addItemToSlot(item, slots, extraSlot){
    if (item.time.isBefore(slots[0])){
        extraSlot.items.push(item);
        return;
    }
    for (var index = 1; index < slots.length; index++){
        if (item.time.isBefore(slots[index].start)){
            slots[index - 1].items.push(item);
            return;
        }
    }
    extraSlot.items.push(item);
}

function generateSlots(officeHoursForDay, slotSize){
    var slots = [];
    _.forEach(officeHoursForDay, function(session){
        // 9:00 (start) to 10:00 (end)
        // 15
        // 9:00 (prev) 9:15 (start) - saved
        // 9:15 (prev) 9:30 (start) - saved
        // 9:30 (prev) 9:45 (start) - saved
        // 9:45 (prev) 10:00 (start)
        var start = session[0];
        var end = session[1];

        var periodStart = start.clone();
        start.add(slotSize, 'minutes');
        if (!start.isBefore(end, 'minute')){
            slots.push({"start" : periodStart, "end" : end, "items" : []});
        }
        else{
            do{
                slots.push({"start" : periodStart, "end" : start.clone(), "items" : []});
                periodStart = start.clone();
                start.add(slotSize, 'minutes');
            }
            while (start.isBefore(end, 'minute'));
            slots.push({"start" : periodStart, "end" : end, "items" : []});
        }
    });
    return slots;
}

function handleSelectHeatmapDate(date){
    if (_asOf !== null && _asOf.isSame(date, "day")){
        return false;
    }
    _asOf = date;
    return generateHeatmap();
}

function handleSelectedHeatmapFilter(data){
    var selectedFilterType = data.filterType;
    var otherFilterType = (selectedFilterType === AppConstant.FILTER_TYPE_QUEUE) ?
        AppConstant.FILTER_TYPE_WORKER : AppConstant.FILTER_TYPE_QUEUE;
    _filter[otherFilterType] = undefined;

    var existing = _filter[selectedFilterType];
    if (!_.isUndefined(existing) && existing.isEqual(data.filter)){
        return false;
    }
    _filter[selectedFilterType] = data.filter;
    return generateHeatmap();
}

function handleReceiveApts(entityResultSet /** EntityResultSet */){
    return false;
}

function handleReceiveTickets(entityResultSet){
    var changed = false;
    var filterQueue = _filter[AppConstant.FILTER_TYPE_QUEUE];
    if (!_.isUndefined(filterQueue)){
        // todo process deletes as well
        _.forEach(entityResultSet.getUpdates(), function(ticket){
            if (filterQueue.hasTicket(ticket)){
                // check if ticket already exists
                var exist = _tickets[ticket.id];
                if (_.isUndefined(exist)){
                    _tickets[ticket.id] = ticket;
                    _aptsWithTicket[ticket.apt.id] = true;
                    addTicketToSlot(ticket);
                    changed = true;
                }
            }
        });
    }
    return changed;
}

var HeatmapStore = _.extend({}, EventEmitter.prototype, {
    getAsOf: function(){
        return _asOf;
    },
    getHeatmapSlots: function(){
        return _slots;
    },
    getTimeFormat: function(){
        return _timeFormat;
    },
    emitChange: function(){
        this.emit('change');
    },
    addChangeListener: function(callback){
        this.on('change', callback);
    },
    removeChangeListener: function(callback){
        this.removeListener('change', callback);
    }
});

HeatmapStore.dispatcherToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    var changed = false;
    var data = action.data;

    switch (action.actionType){
        case AppConstant.RECEIVE_TICKETS:
            changed = handleReceiveTickets(data);
            break;
        case AppConstant.RECEIVE_APTS:
            changed = handleReceiveApts(data);
            break;
        case AppConstant.SELECTED_HEATMAP_DATE:
            changed = handleSelectHeatmapDate(data);
            break;
        case AppConstant.SELECTED_HEATMAP_FILTER:
            changed = handleSelectedHeatmapFilter(data);
            break;
        default:
            break;
    }
    if (changed){
        HeatmapStore.emitChange();
    }
    return true;
});

module.exports = HeatmapStore;