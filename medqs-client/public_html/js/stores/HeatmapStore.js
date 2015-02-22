/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ConfigModel = require('../models/ConfigModel');
var AppConstant = require('../constants/AppConstant');
var _ = require('lodash');

var _asOf = null;
var _timeFormat = null;
var _slots = [];  // generate from a source (or different source)

// Set slot definition
// Set links
// Set callback of each link
// Set source

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

function handleSelectedHeatmapSource(data){
    // source is either tickets in a queue or a particular worker
    // queue
    // listen to all tickets (scheduledTime) and appointments (scheduledTime)
    // worker
    // listen to all tickets and appointments
    return false;
}

function handleReceiveQueues(data){
    return false;
}

function handleSelectHeatmapDate(date){
    if (_asOf !== null && _asOf.isSame(date, "day")){
        return false;
    }
    _asOf = date;
    _timeFormat = ConfigModel.getHeatmapSlotTimeDisplayFormat();
    var officeHours = ConfigModel.getOfficeHoursForDay(date.day());
    var slotSize = ConfigModel.getHeatmapSlotDurInMin();
    var slots = [];
    _.forEach(officeHours, function(session){
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
            slots.push({"start" : periodStart, "end" : end});
        }
        else{
            do{
                slots.push({"start" : periodStart, "end" : start.clone()});
                periodStart = start.clone();
                start.add(slotSize, 'minutes');
            }
            while (start.isBefore(end, 'minute'))
            slots.push({"start" : periodStart, "end" : end});
        }
    });
    _slots = slots;
    return true;
};

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
        case AppConstant.SELECTED_HEATMAP_DATE:
            changed = handleSelectHeatmapDate(data);
            break;
        case AppConstant.RECEIVE_TICKETS:
            changed = handleReceiveTickets(data);
            break;
        case AppConstant.RECEIVE_APTS:
            changed = handleReceiveApts(data);
            break;
        case AppConstant.SELECTED_HEATMAP_SOURCE:
            changed = handleSelectedHeatmapSource(data);
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