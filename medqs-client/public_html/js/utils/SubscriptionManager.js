/**
 * Created by Calvin on 3/17/2015.
 */
var EntityType = require('../constants/EntityType');
var _ = require('lodash');

/**
 * IMPORTANT How subscription should be done?
 *
 * Phase 1: Client keeps track of each Subscribe method.  For each Subscribe method, there
 * has to be a Criteria.  Instead of calling Subscribe method on server, the client calls
 * a Get(Criteria) method instead.  From the response, the client
 * keeps track of all returned entities.  For every N seconds, the client will make a call
 * with Get(Criteria, accumulated entities).  The client will not include deleted entity in
 * subsequent call.
 *
 * Question: If I want to receive new Queues info, what should I do?
 * Answer: Call SubscribeAndGet(New Queues)
 *
 * Attempt #1: Client calls Subscribe method on server.  The server then keeps track of all
 * the subscription.  However, it will generate a lot of work if server needs to keep trace of
 * unlimited criteria for each client and run them through with each change.
 * Topic: /today_queue/* - queue changed today, ticket for today, apt for today, company, worker, ...etc
 * Topic: /today_planner/* - ticket for today, apt for today, company, worker, ...etc
 * Topic: /non_today/*
 * Topic: /apt/*
 * Topic: /apt/today
 * Topic: /today_ticket
 *
 * The most flexible way is to store each filter on server, and run each change on the server side
 * CONS: Not scalable
 *
 * Some kinds of structure must be setup on the server side
 * Use case for subscriptions:
 * 1. All queues related updates for today - Queue View
 * 2. All appointments related updates for today - Planner View
 * 3. All appointments related updates for a month - Calendar View
 * 4. All info for today - Info View
 * 5. All appointments related updates for a particular today - Planner View (date selected)
 * 6. All updates for a particular ticket - App View
 * 7. All updates for a particular appointment - App View
 * 8. All low frequency updates - Customer, Worker, Company Updates
 *
 * Phase 2: Server supports per entity change subscription.  We can optimize further if a
 * particular change is sent to a lot of subscribers unnecessarily.  For appointments, we
 * should not listen to old appointments by default, because we rarely want to make change to
 * an old appointment.  However, should we listen to changes that we don't care about, of
 * course not.
 *
 * @constructor
 */

function SubscriptionManager(){
    this.subscription = {};

    for (var entityType in EntityType){
        this.subscription[entityType] = {};
    }

    this.enableRefresh = false;
    this.subscriptionFuncs = {};
    this.refreshFreqInMs = 5000;
}

SubscriptionManager.prototype.refresh = function(){
    for (var func in this.subscriptionFuncs){
        func();
    }
    if (this.enableRefresh){
        setTimeout(this.refresh, this.refreshFreqInMs);
    }
};

SubscriptionManager.prototype.startRefresh = function(){
    if (this.enableRefresh){
        return;
    }
    this.enableRefresh = true;
    this.refresh();
};

SubscriptionManager.prototype.stopRefresh = function(){
    this.enableRefresh = false;
};

SubscriptionManager.prototype.subscribeByFunc = function(func, subscribeBy){
    var exist = this.subscriptionFuncs[func];
    if (!_.isUndefined(exist)){
        exist[subscribeBy] = true;
        return;
    }
    var createdPromise = Promise.resolve(func);
    createdPromise.then(function(resultSets){
        // TODO this is the idea
        // Check to see if the result is a EntityResultSet
        // Get each entity from the result
        /*
        for (var entityType in resultSets){
            var resultSet = resultSets[entityType];
            for (var read in resultSet.getReads()){
                this.subscribe(entityType, read.id, subscribeBy);
            }
            for (var update in resultSet.getUpdates()){
                this.subscribe(entityType, update.id, subscribeBy);
            }
            for (var removed in resultSet.getDeletes()){
                this.unsubscribe(entityType, removed.id, subscribeBy);
            }
        }
        */
        this.subscriptionFuncs[func] = {subscribeBy: true};
    });
    return createdPromise;
};

SubscriptionManager.prototype.unsubscribe = function(subscribeBy){
    var changed = false;
    for (var func in this.subscriptionFuncs){
        var subscription = this.subscriptionFuncs[func];
        if (_.isUndefined(subscription)){
            continue;
        }
        if (!_.isUndefined(subscription[subscribeBy])){
            // Call delete on this to safely remove reference to func
            delete subscription[subscribeBy];
            if (_.isEmpty(subscription)){
                delete this.subscriptionFuncs[func];
            }
            changed = true;
        }
    }

    // Need to check for subscription by entity ID
/*    for (var entityType in EntityType){
        for (var entityId in this.subscription[entityType]){
            var subscribers = this.subscription[entityType][entityId];
            if (_.isUndefined(subscribers)){
                continue;
            }
            var subscribed = subscribers[subscribeBy];
            if (_.isUndefined(subscribed)){
                continue;
            }
            subscribers[subscribeBy] = undefined;
            changed = true;
        }
    }*/
    return changed;
};

/*
SubscriptionManager.prototype.subscribe = function(entityType, entityId, subscribeBy){
    var subscribers = this.subscription[entityType][entityId];
    if (_.isUndefined(subscribers)){
        subscribers = {};
        this.subscription[entityType][entityId] = subscribers;
    }
    subscribers[subscribeBy] = true;
};
*/

var instance = new SubscriptionManager();

module.exports = instance;