/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Use react-router
var React = require('react');
var Header = require('./medqsapp.header.react');
var QueueSectionStore = require('../stores/queue.store');
var QueueSection = require('./queuesection.react');
var HeatMap = require('./heatmap.react');
var Ticket = require('./ticket.react');
var ScheduleSection = require('./schedulesection.react');
var Info = require('./info.react.js');
var MedqsService = require('../utils/medqsservice');

/*
var HeatMapStore = require('../stores/HeatMapStore');
var InfoStore = require('../stores/InfoStore');
var ScheduleSectionStore = require('../stores/ScheduleStore');
var AppointmentStore = require('../stores/AppointmentStore');
var QueueSection = require('./QueueSection.react');
*/
// Method to retrieve state from Stores
/*function getAppState(){
    return {
        queues: QueueSectionStore.getQueues(),
        selectedQueue: QueueSectionStore.getSelectedQueue(),
        selectedTicket: QueueSectionStore.getSelectedTicket(),
        schedules: ScheduleSectionStore.getSchedules(),
        selectedCalendar: ScheduleSectionStore.getSelectedCalendar(),
        selectedDate: ScheduleSectionStore.getSelectedDate(),
        selectedAppointment: ScheduleSectionStore.getSelectedAppointment(),
        selectedAppointmentSection: ScheduleSectionStore.getSelectedAppointmentSection(),
        selectedAppointmentFromHeatmap: HeatmapStore.getSelectedAppointment()
    };
}*/

function getAppState(){
    return {
        queues: QueueSectionStore.getQueues(),
        selectedTimeSlot: 0,
        selectedAppointment: null,
        selectedTicket: null,
        schedule: null,
        isQueueSectionVisible: true,
        isScheduleSectionVisible: false,
        isReportSectionVisible: false,
        isHeatMapVisible: true,
        isTicketVisible: true,
        isAppointmentVisible: true,
        isInfoVisible: true
    };
}

// Define main Controller View
// This controller-view subscribes to different stores and set appropriate
// states and properties into its child view
var MedqsApp = React.createClass({
    // Get initial state from stores
    getInitialState: function(){
        return getAppState();
    },
    // Add change listeners to stores
    componentDidMount: function(){
        QueueSectionStore.addChangeListener(this._onChange);
/*        ScheduleSectionStore.addChangeListener(this._onChange);
        InfoStore.addChangeListener(this._onChange);
        HeatmapStore.addChangeListener(this._onChange);
        AppointmentStore.addChangeListener(this._onChange);*/
    },
    //Remove change listeners from stores
    componentWillUnmount: function(){
        QueueSectionStore.removeChangeListener(this._onChange);
/*        ScheduleSectionStore.removeChangeListener(this._onChange);
        InfoStore.removeChangeListener(this._onChange);
        HeatmapStore.removeChangeListener(this._onChange);
        AppointmentStore.removeChangeListener(this._onChange);       */
    },
    handleTicketChange: function(value){
        // Save the changes on the server side
        // 1 - setState({ selectedTicket: returnValueFromServer}); - or -
        // 2 - wait until the asynchronous call returned from the server
        //     and setState will then be triggered from QueueStore
        MedqsService.addTicket(this.props.queue, value);

        // Update the following components:
        // - Ticket, QueueSection, Info
        // 1) Update the Ticket anyway, React will figure out if changes need to be made
        // 2) Update the Queue
        // 3) Update Info section
    },
    //Render our child components, passing state via props
    render: function(){
        return (
            <div className="container-fluid medqs-app">
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <QueueSection visible={this.state.isQueueSectionVisible} queues={this.state.queues} />
                            <ScheduleSection visible={this.state.isScheduleSectionVisible} schedule={this.state.schedule} />
                            <Info visible={this.state.isInfoVisible} />
                        </div>
                        <div className="col-md-2">
                            <HeatMap visible={this.state.isHeatMapVisible}
                                selectedTimeslot={this.state.selectedTimeSlot} appointments={this.state.appointments} />
                        </div>
                        <div className="col-md-2">
                        { (this.state.selectedTicket) ?
                            <Ticket visible={this.state.isTicketVisible} ticket={this.state.selectedTicket} onChange={this.handleTicketChange} /> :
                            <Ticket visible={this.state.isTicketVisible} onChange={this.handleTicketChange}/> }
                        </div>
                    </div>
                </div>
            </div>
        );
   },
    
    _onChange: function(){
       this.setState(getAppState());
   }
});

module.exports = MedqsApp;
