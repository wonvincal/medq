/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppService = require('../utils/AppService');
var AppConstant = require('../constants/AppConstant');
var QueueSectionStore = require('../stores/QueueSectionStore');
var moment = require('moment');
var _ = require('lodash');

// Define action object
var AppActionCreator = {
    initMock: function(){
        // Pretend getting data from server
        AppService.getQueues().then(
            function(data){
                this.receiveQueues(data);
            }.bind(this),
            function(err){
                console.log("error from getQueues: " + err);
            }
        );
        AppService.getCompanies().then(
            function(data){
                this.receiveCompanies(data);
            }.bind(this),
            function(err){
                console.log("error from getSchedules: " + err);
            }
        );
        AppService.getWorkers().then(
            function(data){
                this.receiveWorkers(data);
            }.bind(this),
            function(err){
                console.log("error from getSchedules: " + err);
            }
        );
        this.selectHeatmapDate(moment());
    },
    // Receive queues data - snapshot
    receiveQueues: function(data){
        AppDispatcher.handleAction({
            actionType: AppConstant.RECEIVE_QUEUES,
            data: data
        });
        var queue = QueueSectionStore.shouldSelectQueue();
        if (queue){
            this.selectQueue(queue);
        }
    },
    receiveCompanies: function(data){
        AppDispatcher.handleAction({
            actionType: AppConstant.RECEIVE_COMPANIES,
            data: data
        });
    },
    receiveWorkers: function(data){
        AppDispatcher.handleAction({
            actionType: AppConstant.RECEIVE_WORKERS,
            data: data
        });
        var workers = data;
        if (workers.length > 0){
            this.selectWorker(workers[0]);
        }
    },
    selectHeatmapDate: function(date){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.SELECTED_HEATMAP_DATE,
            data: date
        });
    },
    selectWorker: function(worker){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.SELECTED_WORKER,
            data: worker
        });
    },
    selectHeatMapFilter: function(type, data){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.SELECTED_HEATMAP_FILTER,
            data: { "filterType": type, "filter": data}
        });
    },
    selectQueue: function(queue){
        var data = {};
        data.queue = queue;
        data.cancel = false;
        AppDispatcher.handleViewAction({
            actionType: AppConstant.BEFORE_SELECT_QUEUE,
            data: data
        });
        if (!data.cancel){
            AppDispatcher.handleViewAction({
                actionType: AppConstant.SELECT_QUEUE,
                data: queue
            });
            AppDispatcher.handleViewAction({
                actionType: AppConstant.AFTER_SELECT_QUEUE,
                data: queue
            });
            this.selectHeatMapFilter(AppConstant.FILTER_TYPE_QUEUE, queue);
        }
    },
    selectTicket: function(ticket){
        var data = {};
        //data.queue = queue;
        data.ticket = ticket;
        data.cancel = false;
        AppDispatcher.handleViewAction({
            actionType: AppConstant.BEFORE_SELECT_TICKET,
            data: data
        });

        delete data.cancel;
        if (!data.cancel){
            AppDispatcher.handleViewAction({
                actionType: AppConstant.SELECT_TICKET,
                data: data
            });

            AppDispatcher.handleViewAction({
                actionType: AppConstant.AFTER_SELECT_TICKET,
                data: data
            });
        }
    },
    addTicket: function(queue, ticket, apt){
        // Pretend getting data from server
        AppService.addTicket(queue, ticket, apt).then(
            function(data){
                if (data.apt !== null){
                    AppDispatcher.handleAction({
                        actionType: AppConstant.RECEIVE_APTS,
                        data: [ data.apt ]
                    });
                }
                if (data.ticket !== null){
                    AppDispatcher.handleAction({
                        actionType: AppConstant.RECEIVE_TICKETS,
                        data: [ data.ticket ]
                    });
                    AppDispatcher.handleAction({
                        actionType: AppConstant.ADDED_TICKET,
                        data: data.ticket
                    });
                }
                if (data.queue != null){
                    AppDispatcher.handleAction({
                        actionType: AppConstant.RECEIVE_QUEUES,
                        data: [ data.queue ]
                    });
                }
            },
            function(err){
                console.log("error from addTicket: " + err);
            }
        );
    },
    editTicket: function(changedTicket){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.EDIT_TICKET,
            data: changedTicket
        });
    },
    cancelTicket: function(queue, ticket){
        // Pretend getting data from server
        AppService.cancelTicket(queue, ticket).then(
            function(data){
                if (data.queue != null){
                    AppDispatcher.handleAction({
                        actionType: AppConstant.RECEIVE_QUEUES,
                        data: [ data.queue ]
                    });
                }
                AppDispatcher.handleAction({
                    actionType: AppConstant.CANCELLED_TICKET,
                    data: data
                });
            },
            function(err){
                console.log("error from removeTicket: " + err);
            }
        );
    },
    updateTicket: function(queue, ticket){
        AppService.updateTicket(queue, ticket).then(
            function(data){
                if (data.queue != null){
                    AppDispatcher.handleAction({
                        actionType: AppConstant.RECEIVE_QUEUES,
                        data: [ data.queue ]
                    });
                }
                AppDispatcher.handleAction({
                    actionType: AppConstant.UPDATED_TICKET,
                    data: data
                });
            },
            function(err){
                console.log("error from updateTicket: " + err);
            }
        );
    }
    /*
    receiveTicket: function(data){
        console.log("receiveTicket");
        AppDispatcher.handleAction({
            actionType: AppConstant.RECEIVE_TICKET_DATA,
            data: data
        });
    },
    receiveQueue: function(data){
        console.log("receiveQueue");
        AppDispatcher.handleAction({
            actionType: AppConstant.RECEIVE_QUEUE_DATA,
            data: data
        });
    },
    // Receive initial schedule data
    receiveSchedules: function(data){
        console.log("receiveSchedules");
        AppDispatcher.handleAction({
            actionType: AppConstant.RECEIVE_SCHEDULES_DATA,
            data: data
        });
    },
    selectTicketFromQueue: function(data){
        AppDispatcher.handleViewAction({
            actionType: AppConstant.RECEIVE_QUEUES_DATA,
            data: data
        });
    },
    selectAppointmentFromPlanner: function(data){
        
    },
    selectAppointmentFromHeatMap: function(data){
        
    }*/
};

module.exports = AppActionCreator;