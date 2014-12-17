/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AppDispatcher = require('../dispatcher/app.dispatcher');
var MedqsConstants = require('../constants/medqs.constants');
var _ = require('underscore');

// Define action object
var MedqsActions = {
    receiveTicket: function(data){
        console.log("receiveTicket");
        AppDispatcher.handleAction({
            actionType: MedqsConstants.RECEIVE_TICKET_DATA,
            data: data
        });
    },
    // Receive queues data - either snapshot or partial updates
    receiveQueues: function(data){
        AppDispatcher.handleAction({
            actionType: MedqsConstants.RECEIVE_QUEUES_DATA,
            data: data
        });
    },
    // Receive initial schedule data
    receiveSchedules: function(data){
        console.log("receiveSchedules");
        AppDispatcher.handleAction({
            actionType: MedqsConstants.RECEIVE_SCHEDULES_DATA,
            data: data
        });
    },
    selectTicketFromQueue: function(data){
        AppDispatcher.handleViewAction({
            actionType: MedqsConstants.RECEIVE_QUEUES_DATA,
            data: data
        });
    },
    selectAppointmentFromPlanner: function(data){
        
    },
    selectAppointmentFromHeatMap: function(data){
        
    }
};

module.exports = MedqsActions;