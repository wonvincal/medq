/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * This service communicates with server side to get latest data
 *
 * Below are the only ways to communicate with server
 * 1) Query server directly using REST
 * 2) Add/Delete from server directly using REST
 *
 * Below are the only ways to get updates from the server
 * 1) receive server-pushing updates of different entity types with seq
 * 2) receive synchronous updates from server with seq with timeout
 * 3) an entity state
 *
 * Periodic poll for connection-alive
 *
 */
var CompanyEntityProvider = require('../models/CompanyEntityProvider');
var WorkerEntityProvider = require('../models/WorkerEntityProvider');
var QueueEntityProvider = require('../models/QueueEntityProvider');
var TicketEntityProvider = require('../models/TicketEntityProvider');
var AptEntityProvider = require('../models/AptEntityProvider');
var AppServerMock = require('../AppServerMock');
var _ = require('lodash');

module.exports = {
    // Load mock data from localStorage into Stores via Action
    getCompanies: function(){
        return new Promise(function(resolve, reject){
            // getSession

            // Simulate getting queues from server - strings from wire
            var str = AppServerMock.getCompanies();
            var json = JSON.parse(str);

            var result = CompanyEntityProvider.mergeWithJSONs(json);
            if (result.hasReadOrUpdates()) {
                resolve(result);
            }
            else{
                reject("cannot get companies");
            }
        });
    },
    getWorkers: function(){
        return new Promise(function(resolve, reject){
            // getSession

            // Simulate getting queues from server - strings from wire
            var str = AppServerMock.getWorkers();
            var json = JSON.parse(str);

            var entityResultSet = WorkerEntityProvider.mergeWithJSONs(json);
            if (entityResultSet.hasReadOrUpdates()) {
                resolve(entityResultSet);
            }
            else{
                reject("cannot get workers");
            }
        });
    },
    getQueues: function(){
        return new Promise(function(resolve, reject){
            // getSession

            // Simulate getting queues from server - strings from wire
            var str = AppServerMock.getQueues();
            var json = JSON.parse(str);

            var result = QueueEntityProvider.mergeWithJSONs(json);
            if (result.hasReadOrUpdates()) {
                resolve(result);
            }
            else{
                reject("cannot get queues");
            }
        });
    },
    // Create a ticket, with appointment info if applicable
    // Expected return values from server:
    // Phase 1:
    // - queue: latest snapshot of the 'permissioned' queue with the added ticket
    // - ticket: saved ticket info
    // Phase 2:
    // - queue: delta changes wrt the latest snapshot of the 'permissioned' queue with the added ticket
    // - ticket: saved ticket info
    // Phase 3:
    // - support timeout
    addTicket: function(queue, ticket, apt){
        return new Promise(function (resolve, reject) {
            // Simulate getting queues from server
            var str = AppServerMock.addTicket(queue, ticket, apt);
            var json = JSON.parse(str);

            var result = {};
            if (_.has(json, "apt") && json.ticket !== null) {
                result.apt = AptEntityProvider.mergeWithJSON(json.apt).toEntityResultSet();
            }
            if (_.has(json, "queue") && json.queue !== null) {
                result.queue = QueueEntityProvider.mergeWithJSON(json.queue).toEntityResultSet();
            }
            if (_.has(json, "ticket") && json.ticket !== null) {
                result.ticket = TicketEntityProvider.mergeWithJSON(json.ticket).toEntityResultSet();
            }

            if (result.queue != null && result.ticket != null){
                resolve(result);
            }
            else{
                reject("cannot add ticket");
            }

            // Send ticket over to the server side, ajax
            // [ajax.(queue [with latest sequence number], ticket)]

            // After a ticket is added, we should get a response from the server side
            // We shouldn't wait for the periodic poll from the server
        });
    },
    updateTicket: function(queue, ticket){
        return new Promise(function(resolve, reject){
            // Simulate getting queues from server
            var str = AppServerMock.updateTicket(queue, ticket);
            var json = JSON.parse(str);

            var result = {};
            if (_.has(json, "queue") && json.queue !== null) {
                result.queue = QueueEntityProvider.mergeWithJSON(json.queue).toEntityResultSet();
            }
            if (_.has(json, "ticket") && json.ticket !== null) {
                result.ticket = TicketEntityProvider.mergeWithJSON(json.ticket).toEntityResultSet();
            }
            if (result.queue !== null && result.ticket !== null){
                resolve(result);
            }
            else{
                reject("cannot update ticket");
            }
        });
    },
    cancelTicket: function(queue, ticket){
        return new Promise(function(resolve, reject){
            // Simulate getting queues from server
            var str = AppServerMock.cancelTicket(queue, ticket);
            var json = JSON.parse(str);

            var result = {};
            if (_.has(json, "queue") && json.queue !== null) {
                result.queue = QueueEntityProvider.mergeWithJSON(json.queue).toEntityResultSet();
                if (_.has(json, "ticket") && json.ticket !== null) {
                    result.ticket = TicketEntityProvider.mergeWithJSON(json.ticket).toEntityResultSet();
                }
            }
            if (result.queue !== null && result.ticket !== null){
                resolve(result);
            }
            else{
                reject("cannot remove ticket");
            }
        });
    },
    // Login: send credentials to server, return:
    // 1) accounts
    // 2) settings
    // 3) queues
    // 4) schedules
    login: function(username, password){
        var data = JSON.parse(localStorage.getItem('session'));
        // Store into session
        // AppActionCreator.receiveQueues(data.queues);
        // AppActionCreator.receiveSchedules(data.schedules);
    },
    // Return session if available
    getSession: function(){
        var data = JSON.parse(localStorage.getItem('session'));
        // Store into session

        // Make JSON call to get queues (a bit more complicated once we get into snapshot vs updates
        // AppActionCreator.receiveQueues(data.queues);
        // Make JSON call to get schedules (a bit more complicated once we get into snapshot vs updates
        // AppActionCreator.receiveSchedules(data.schedules);
    }
};

// Entry points to the application
// 1) www.medqs.com
//    check session
//      if the person has not logged in, show "website browsing" view with "Login" button
//      if the person has logged in, show "real-time updates" view, similar to Facebook
// 2) direct link to a specific queue: www.medqs.com/queue/18271
//    check session
//      if the person has not logged in, show "real-time updates" view with "Login" button
//        put this queue into session
//        updates will be limited to "public" credentials only
//      if the person has logged in, show "real-time updates" view, similar to Facebook
// 3) direct link to something not appropriate: www.medqs.com/account/123
//    redirect back to www.medqs.com
//
//
//