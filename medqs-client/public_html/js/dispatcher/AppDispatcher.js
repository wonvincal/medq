/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 * 1. appointment.store
 * 2. ticket.store
 * 3. queue.store, schedule.store, info.store, heatmap.store
 */
var Dispatcher = require('flux').Dispatcher;
var AppConstant = require('../constants/AppConstant.js');

var AppDispatcher = new Dispatcher();

AppDispatcher.handleAction = function(action){
    console.log("AppDispatcher handleAction for service");
    this.dispatch({
        source: AppConstant.SOURCE_SERVICE_ACTION,
        action: action
    });
};

AppDispatcher.handleViewAction = function(action){
    console.log("AppDispatcher handleAction for view");
    this.dispatch({
        source: AppConstant.SOURCE_VIEW_ACTION,
        action: action
    });
};

module.exports = AppDispatcher;