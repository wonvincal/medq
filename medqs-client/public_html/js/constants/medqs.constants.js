/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var keyMirror = require('react/lib/keyMirror');

// Define action constants
module.exports = keyMirror({
    TICKET_ADD: null,
    TICKET_DELETE: null,
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
    RECEIVE_QUEUES_DATA: null,
    RECEIVE_SCHEDULES_DATA: null,
    SOURCE_SERVICE_ACTION: null,
    SOURCE_VIEW_ACTION: null
});
