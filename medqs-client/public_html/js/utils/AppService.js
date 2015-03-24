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
var SubscriptionManager = require('../utils/SubscriptionManager');
var EntityType = require('../constants/EntityType');
var _ = require('lodash');

var _entityProviders = {};
_entityProviders[CompanyEntityProvider.entityType] = CompanyEntityProvider;
_entityProviders[WorkerEntityProvider.entityType] = WorkerEntityProvider;
_entityProviders[QueueEntityProvider.entityType] = QueueEntityProvider;
_entityProviders[TicketEntityProvider.entityType] = TicketEntityProvider;
_entityProviders[AptEntityProvider.entityType] = AptEntityProvider;
_entityProviders[WorkerEntityProvider.entityType] = WorkerEntityProvider;

function processResult(json){
    var result = {};
    for (var entityType in json){
        var jsonEntityResult = json[entityType];
        if (_.isArray(jsonEntityResult)){
            result[entityType] = _entityProviders[entityType].mergeWithJSONs(jsonEntityResult);
        }
        else {
            result[entityType] = _entityProviders[entityType].mergeWithJSON(jsonEntityResult).toEntityResultSet();
        }
    }
    return result;
}

module.exports = {
    getQueues: function(){
        return new Promise(function(resolve, reject){
            // getSession

            // Simulate getting queues from server - strings from wire
            var result = processResult(JSON.parse(AppServerMock.getQueues()));
            var queueResult = result[EntityType.QUEUE];
            if (!_.isUndefined(queueResult) && queueResult.hasReadOrUpdates()) {
                resolve(result);
            }
            else{
                reject("cannot get queues");
            }
        });
    },
    getCompanies: function(){
        return new Promise(function(resolve, reject){
            // getSession

            var result = processResult(JSON.parse(AppServerMock.getCompanies()));
            var companyResult = result[EntityType.COMPANY];
            if (!_.isUndefined(companyResult) && companyResult.hasReadOrUpdates()) {
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

            var result = processResult(JSON.parse(AppServerMock.getWorkers()));
            var workerResult = result[EntityType.WORKER];
            if (!_.isUndefined(workerResult) && workerResult.hasReadOrUpdates()) {
                resolve(result);
            }
            else{
                reject("cannot get workers");
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
    addTicketAndApt: function(queue, ticket, apt){
        return new Promise(function (resolve, reject) {
            var result = processResult(JSON.parse(AppServerMock.addTicketAndApt(queue, ticket, apt)));
            if (!_.isUndefined(result[EntityType.TICKET]) && !_.isUndefined(result[EntityType.APT])){
                resolve(result);
            }
            else{
                reject("cannot add ticket");
            }
        });
    },
    updateTicket: function(queue, ticket){
        return new Promise(function(resolve, reject){
            var result = processResult(JSON.parse(AppServerMock.updateTicket(queue, ticket)));
            if (!_.isUndefined(result[EntityType.TICKET])){
                resolve(result);
            }
            else{
                reject("cannot update ticket");
            }
        });
    },
    subcribeAndGetQueues: function(subscribeBy){
        SubscriptionManager.subscriptionFuncs(this.getQueues, subscribeBy)
    },
    /**
     * Server should NOT maintain a subscription reference count for a particular client
     * This should be done at the client side
     */
    subscribeAndGetEntityAndChildren: function(entityTypeName, entityId, subscribeBy) {
        return null;
    },
    subscribeAndGetEntity: function(entityTypeName, entityId, subscribeBy) {
        return null;
    },
    subscribeAndGetEntitiesAndChildren: function(entityTypeName, entityIds, subscribeBy) {
        return null;
    },
    subscriberAndGetEntities: function(entityTypeName, entityIds, subscribeBy){
        return null;
    },
    subscribeAndGetEntities: function(entityName, filterFunc){
        return new Promise(function(resolve, reject){
            var str = AppServerMock.subscribeAndGetEntities(entityName, filterFunc);
            var json = JSON.parse(str);

            // Result returns from GetEntities call should be in the form of
            // { "[entityTypeName]" : [ {}, {}, {}],
            //   "[entityTypeName]" : [ {}, {}, {}]

            // Merge data into EntityProvider

            // Return result to AppActionCreator
            // mark subscription
        });
    },
    subscribeAndGetQueries: function(subscribeBy){
        return SubscriptionManager.subscribeByFunc(this.getQueues, subscribeBy);
    },
/*    cancelTicket: function(queue, ticket){
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
    },*/
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