/* 
 * QueueStore: Store for all queues related views
 * 
 * Copyright 2014 Calvin Wong.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var MedqsConstants = require('../constants/MedqsConstants');
var _ = require('underscore');

// Define initial data points
var _queues = [];
var _selectedQueue = null;
var _selectedTicket = null;
var _sectionVisible = false;

// Private methods
// Method to receive queues data from mock API
function receiveQueuesData(data){
    _queues = data;
}

function addQueue(queue){
    
}

function removeQueue(queue){
    
}

function changeQueueDisplayOrder(data){
    
}

function addTicket(queue, ticket){
    
}

function updateTicket(queue, ticket){
    
}

function removeTicket(queue, ticket){
    
}

var QueueStore = _.extend({}, EventEmitter.prototype, {
    // Public methods
    getSectionVisible: function(){
        return _sectionVisible;
    },    
    getQueues: function(){
        return _queues;
    },
    getName: function(){
        
    },
    getNumTickets: function(){
        
    },
    getTotalWaitingTime: function(){
        
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

// Register calllback with AppDispatcher
AppDispatcher.register(function(payload){
    var action = payload.action;
    var text;
    
    switch (action.actionType){
        // Respond to a list of actions
        case MedqsConstants.RECEIVE_QUEUES_DATA:
            receiveQueuesData(action.data);
            break;
        default:
            return true;
    }    
    QueueStore.emitChange();    
    return true;
});

module.exports = QueueStore;