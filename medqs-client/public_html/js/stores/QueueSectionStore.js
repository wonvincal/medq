/* 
 * QueueSectionStore: Store for all queues related views
 * 
 * Copyright 2014 Calvin Wong.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstant = require('../constants/AppConstant');
var QueueEntityProvider = require('./../models/QueueEntityProvider');
var _ = require('lodash');

// Define initial data points
var _selectedQueue = null;
var _selectedTicket = null;
var _sectionVisible = false;

// Private methods
function receiveQueues(){
    // Determine if anything has changed
    // Control whether to emit change event
    return true;
}

function handleBeforeSelectQueue(data /*{queue, cancel}*/){
    console.log("QueueSectionStore: handleBeforeSelectQueue");
    if (_selectedQueue != null && _selectedQueue.isEqual(data.queue)){
        data.cancel = true;
    }
    return false;
}

function handleSelectQueue(queue){
    console.log("QueueSectionStore: handleSelectQueue");
    if (_selectedQueue == null || (_selectedQueue.id !== queue.id)){
        _selectedQueue = queue;
        return true;
    }
    return false;
}

function handleSelectTicket(data){
    var ticket = data.ticket;
    if (_selectedTicket == null || ((_selectedTicket.id !== ticket.id) && (_selectedTicket.cid !== ticket.cid))){
        _selectedTicket = ticket;
        return true;
    }
    return false;
}

function handleRemovedTicket(data){
    if (_selectedTicket !== null && _selectedTicket.isEqual(data.ticket)){
        _selectedTicket = null;
        return true;
    }
    return false;
}

var QueueSectionStore = _.extend({}, EventEmitter.prototype, {
    // Public methods
    shouldSelectQueue: function() {
        if (_selectedQueue == null) {
            var queues = this.getQueues();
            if (queues != null && queues.length > 0) {
                return queues[0];
            }
        }
        return null;
    },
    getSelectedQueue: function(){
        return _selectedQueue;
    },
    getSelectedTicket: function(){
        return _selectedTicket;
    },
    getSectionVisible: function(){
        return _sectionVisible;
    },
    getQueues: function(){
        return QueueEntityProvider.getQueues();
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

QueueSectionStore.dispatcherToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    var changed = false;
    var data = action.data;

    switch (action.actionType){
        case AppConstant.RECEIVE_QUEUES:
            console.log("QueueSectionStore: receive action: RECEIVE_QUEUES");
            changed = receiveQueues();
            break;
        case AppConstant.BEFORE_SELECT_QUEUE:
            console.log("QueueSectionStore: receive action: BEFORE_SELECT_QUEUE");
            changed = handleBeforeSelectQueue(data);
            break;
        case AppConstant.SELECT_QUEUE:
            console.log("QueueSectionStore: receive action: SELECT_QUEUE");
            changed = handleSelectQueue(data);
            break;
        case AppConstant.SELECT_TICKET:
            console.log("QueueSectionStore: receive action: SELECT_TICKET");
            changed = handleSelectTicket(data);
            break;
        case AppConstant.REMOVED_TICKET:
            console.log("QueueSectionStore: receive action: REMOVED_TICKET");
            changed = handleRemovedTicket(data);
            break;
        default:
            break;
    }
    if (changed){
        QueueSectionStore.emitChange();
    }
    return true;
});

module.exports = QueueSectionStore;