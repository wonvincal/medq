/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var InfoStore = _.extend({}, EventEmitter.prototype, {
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

InfoStore.dispatcherToken = AppDispatcher.register(function(payload){
    var action = payload.action;
    var changed = false;
    var data = action.data;

    switch (action.actionType){
        default:
            break;
    }
    if (changed){
        InfoStore.emitChange();
    }
    return true;
});

module.exports = InfoStore;