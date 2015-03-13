/**
 * Created by Calvin on 1/25/2015.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var AppConstant = require('../constants/AppConstant.js');
var _ = require('lodash');

var _isQueueSectionVisible = false;
var _isInfoVisible = false;
var _isPlannerSectionVisible = false;
var _isHeatmapVisible = false;
var _isTicketAptEditorSectionVisible = false;

function handleClickQueueOnHeader(){
    _isQueueSectionVisible = true;
    _isInfoVisible = true;
    _isPlannerSectionVisible = false;
    _isHeatmapVisible = true;
    _isTicketAptEditorSectionVisible = true;
    return true;
}
function handleClickPlannerOnHeader(){
    _isQueueSectionVisible = false;
    _isInfoVisible = true;
    _isPlannerSectionVisible = true;
    _isHeatmapVisible = true;
    _isTicketAptEditorSectionVisible = true;
    return true;
}
function handleClickReportOnHeader(){
    _isQueueSectionVisible = false;
    _isInfoVisible = false;
    _isPlannerSectionVisible = false;
    _isHeatmapVisible = false;
    _isTicketAptEditorSectionVisible = false;
    return true;
}

var AppWorkspaceStore = _.extend({}, EventEmitter.prototype, {
    // Public methods
    isQueueSectionVisible: function(){
        return _isQueueSectionVisible;
    },
    isInfoVisible: function(){
        return _isInfoVisible;
    },
    isPlannerSectionVisible: function(){
        return _isPlannerSectionVisible;
    },
    isHeatmapVisible: function(){
        return _isHeatmapVisible;
    },
    isTicketAptEditorSectionVisible: function(){
        return _isTicketAptEditorSectionVisible;
    },
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
    var source = payload.source;
    if (source === AppConstant.SOURCE_SERVICE_ACTION){
        return true;
    }

    var action = payload.action;
    var changed = false;
    switch (action.actionType){
        case AppConstant.CLICK_QUEUE_ON_HEADER:
            changed = handleClickQueueOnHeader();
            break;
        case AppConstant.CLICK_PLANNER_ON_HEADER:
            changed = handleClickPlannerOnHeader();
            break;
        case AppConstant.CLICK_REPORT_ON_HEADER:
            changed = handleClickReportOnHeader();
            break;
        default:
            break;
    }
    if (changed){
        AppWorkspaceStore.emitChange();
    }
    return true;
});

module.exports = AppWorkspaceStore;