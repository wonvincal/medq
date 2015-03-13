/**
 * Created by Calvin on 3/14/2015.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstant = require('../constants/AppConstant');

var ViewActionCreator = {
    clickQueueOnHeader: function(){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.CLICK_QUEUE_ON_HEADER,
            data: null
        });
    },
    clickPlannerOnHeader: function(){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.CLICK_PLANNER_ON_HEADER,
            data: null
        });
    },
    clickReportOnHeader: function(){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.CLICK_REPORT_ON_HEADER,
            data: null
        });
    }
};

module.exports = ViewActionCreator;