/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var keyMirror = require('react/lib/keyMirror');

var COLORS = keyMirror({blue: null, red: null});

// Define action constants
module.exports = keyMirror({
    // Appointment
    RECEIVE_APTS: null,

    // Company
    RECEIVE_COMPANIES: null,

    // Heatmap
    SELECTED_HEATMAP_DATE: null,
    SELECTED_HEATMAP_FILTER: null,

    // Queue
    AFTER_SELECT_QUEUE: null,
    BEFORE_SELECT_QUEUE: null,
    RECEIVE_QUEUES: null,
    SELECT_QUEUE: null,

    // Ticket
    ADDED_TICKET: null,
    AFTER_SELECT_TICKET: null,
    BEFORE_SELECT_TICKET: null,
    CANCELLED_TICKET: null,
    EDIT_TICKET: null,
    SELECT_TICKET: null,
    RECEIVE_TICKETS: null,
    UPDATED_TICKET: null,

    // Schedule
    SELECTED_SCHEDULE: null,
    RECEIVE_SCHEDULES: null,

    // Worker
    RECEIVE_WORKERS: null,
    SELECTED_WORKER: null,

    APP_TICKET_SELECTED: null,
    TICKET_MOVE: null,
    TICKET_UPDATE: null,
    QUEUE_ADD: null,
    QUEUE_UPDATE: null,
    APPOINTMENT_ADD: null,
    APPOINTMENT_DELETE: null,
    APPOINTMENT_UPDATE: null,
    SET_SELECTED_TICKET: null,
    SET_SELECTED_APPOINTMENT: null,
    SEARCH: null,
    RECEIVE_TICKET_DATA: null,
    RECEIVE_SEARCH_RESULT: null,
    SOURCE_SERVICE_ACTION: null,
    SOURCE_VIEW_ACTION: null,

    // Other
    MODE_ADD: null,
    MODE_EDIT: null,

    FILTER_TYPE_QUEUE: null,
    FILTER_TYPE_WORKER: null
});
