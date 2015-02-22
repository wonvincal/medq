/**
 * Created by Calvin on 1/25/2015.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var AppConstant = require('../constants/AppConstant.js');
var _ = require('lodash');

var AppWorkspaceStore = _.extend({}, EventEmitter.prototype, {
    // Public methods
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

AppWorkspaceStore.dispatchToken = AppDispatcher.register(function(payload){
    var action = payload.action;

    switch (action.actionType){
        default:
            return true;
    }
    AppWorkspaceStore.emitChange();
    return true;
});

module.exports = AppWorkspaceStore;