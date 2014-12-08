/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Dispatcher = require('flux').Dispatcher;
var MedqsConstants = require('../constants/MedqsConstants');

var AppDispatcher = new Dispatcher();

AppDispatcher.handleAction = function(action){
    console.log("handleAction");
    this.dispatch({
        source: MedqsConstants.SOURCE_SERVICE_ACTION,
        action: action
    });
};

AppDispatcher.handleViewAction = function(action){
    this.dispatch({
        source: MedqsConstants.SOURCE_VIEW_ACTION,
        action: action
    });
};

module.exports = AppDispatcher;