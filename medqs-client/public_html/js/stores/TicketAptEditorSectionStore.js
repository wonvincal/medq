/**
 * Store for TicketApptEditor
 * Created by Calvin on 1/9/2015.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstant = require('../constants/AppConstant');
var QueueSectionStore = require('./QueueSectionStore');
var TicketEntityProvider = require('../models/TicketEntityProvider');
var AptEntityProvider = require('../models/AptEntityProvider');
var TimeService = require('../utils/TimeService');
var _ = require('lodash');

var _workerForApt = null;
var _queueForAdd = null;
var _ticketForAdd = null;
var _queueForEdit = null;
var _ticketForEdit = null;
var _isTicketForEditDirty = false;

function handleReceiveQueues(entityResultSet){
    if (_queueForAdd !== null){
        var index = _.findIndex(entityResultSet.getUpdates(), _queueForAdd);
        if (index !== -1){
            return handleSelectedWorker(_queueForAdd.getSelectedWorker());
        }
    }
    // todo check for delete
    // todo check for _queueForEdit
    return false;
}

function handleSelectedWorker(worker){
    console.log("TicketAptEditorSectionStore: handleSelectedWorker");
    if (_workerForApt === null || !_workerForApt.isEqual(worker)){
        _workerForApt = worker;
        _ticketForAdd = createTicketForAdd(_queueForAdd, _workerForApt);
        return true;
    }
    return false;
}

/***
 * When a queue is selected, we should set selectedQueue.  Then we should notify the react
 * component.code.
 * If there is a change in queue,
 *      If no ticket is being created, update the nextTicketId.
 *      If ticket is being created, it should alert user and ask if we want to discard the change.
 *      If not discard, select back the original queue.
 * @param data
 */
function handleBeforeSelectTicket(data /* {ticket, cancel)*/){
    console.log("TicketAptEditorSectionStore: handleBeforeSelectTicket");
    if (_isTicketForEditDirty){
        console.log("TicketAptEditorSectionStore: edit is dirty, cancel BEFORE_SELECT_TICKET");
        data.cancel = true;
    }
    return false;
}
/**
 * Check if we should allow select queue
 * @param data
 */
function handleBeforeSelectQueue(data /* {queue, cancel} */){
    console.log("TicketAptEditorSectionStore: handleBeforeSelectQueue");
    return false;
}

function handleAfterSelectQueue(queue){
    // todo assert queue !== null
    console.log("TicketAptEditorSectionStore: handleAfterSelectQueue");
    if (_queueForAdd == null || !_queueForAdd.isEqual(queue)){
        _queueForAdd = queue;
        _workerForApt = _queueForAdd.getSelectedWorker();
        _ticketForAdd = createTicketForAdd(_queueForAdd, _workerForApt);
        return true;
    }
    return false;
}

function createTicketForAdd(queue, worker) {
    if (queue === null || worker === null) {
        return null;
    }
    var ticket = TicketEntityProvider.createWithNextCid(queue.id);
    ticket.apt = AptEntityProvider.createWithNextCid();
    ticket.apt.aptDateTime = TimeService.now();
    ticket.apt.worker = worker;
    return ticket;
}

function handleAddedTicket(data /* {queue, ticket}*/){
    console.log("TicketAptEditorSectionStore: handleAddedTicket");
    _ticketForAdd = createTicketForAdd(_queueForAdd, _workerForApt);
    return true;
}
/***
 * When a ticket is selected in the app, we should set selectedTicket.  Then, we
 * should notify the react component.
 * If a ticket is not being edited, it should display the ticket right away.
 * If a ticket is being edited, it should create a prompt and ask if we want to discard the
 * change.  If yes, discard the change
 * If there is a change in queue
 * If there is no change in queue
 * @param data
 */
function handleAfterSelectTicket(data){
    _ticketForEdit = data.ticket;
    _isTicketForEditDirty = false;
    return true;
}

function handleEditTicket(changedTicket){
    var isDirty = !_.isEqual(_ticketForEdit, changedTicket);
    if (isDirty != _isTicketForEditDirty){
        _isTicketForEditDirty = isDirty;
        return true;
    }
    return false;
}

function handleCancelledTicket(data){
    if (_ticketForEdit !== null &&_ticketForEdit.isEqual(data.ticket)){
        _queueForEdit = null;
        _ticketForEdit = null;
        _isTicketForEditDirty = false;
        return true;
    }
    return false;
}

function handleUpdatedTicket(data){
    if (_ticketForEdit !== null &&_ticketForEdit.isEqual(data.ticket)){
        return true;
    }
    return false;
}

var TicketAptEditorSectionStore = _.extend({}, EventEmitter.prototype, {
    // Public methods
    getQueueForAdd: function(){
        return _queueForAdd;
    },
    getTicketForAdd: function(){
        return _ticketForAdd;
    },
    getQueueForEdit: function(){
        return _queueForEdit;
    },
    getTicketForEdit: function(){
        return _ticketForEdit;
    },
    isTicketForEditDirty: function(){
        return _isTicketForEditDirty;
    },
    getSectionVisible: function(){
        return _sectionVisible;
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

TicketAptEditorSectionStore.dispatcherToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    var data = action.data;
    var changed = false;

    switch (action.actionType){
        case AppConstant.RECEIVE_QUEUES:
            changed = handleReceiveQueues(data);
            break;
        case AppConstant.BEFORE_SELECT_QUEUE:
            changed = handleBeforeSelectQueue(data);
            break;
        case AppConstant.AFTER_SELECT_QUEUE:
            changed = handleAfterSelectQueue(data);
            break;
        case AppConstant.ADDED_TICKET:
            changed = handleAddedTicket(data);
            break;
        case AppConstant.BEFORE_SELECT_TICKET:
            changed = handleBeforeSelectTicket(data);
            break;
        case AppConstant.AFTER_SELECT_TICKET:
            changed = handleAfterSelectTicket(data);
            break;
        case AppConstant.EDIT_TICKET:
            changed = handleEditTicket(data);
            break;
        case AppConstant.CANCELLED_TICKET:
            changed = handleCancelledTicket(data);
            break;
        case AppConstant.UPDATED_TICKET:
            changed = handleUpdatedTicket(data);
            break;
        default:
            return true;
    }
    if (changed){
        TicketAptEditorSectionStore.emitChange();
    }
    return true;
});

module.exports = TicketAptEditorSectionStore;