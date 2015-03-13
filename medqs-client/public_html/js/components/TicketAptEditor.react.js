/*
 * Component for display a specific selected Ticket or to get a new ticket
 * If ticket is not set, this component should be a 'Create New Ticket' component
 * If ticket is set, this component should be a 'Update Ticket' component
 *
 * Should we allow creation of ticket for different queues?
 * Why not?  IN the beginning, default to the main queue.  If people really want to
 * create ticket for a queue different from the primary one, we can do something
 *
 * State - Anything that can change, make that into a state.  However, if a changed field can affect
 *         multiple components, put that field as a state in the top most component in the hierarchy
 *
 * Support - should support selection of worker (or doctors)
 * Copy the props.ticket as state.ticket, so that we can tell if a ticket is dirty
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var TicketStatus = require('../constants/TicketStatus');
var AppActionCreator = require('../actions/AppActionCreator');
var AppConstant = require('../constants/AppConstant');
var DateTimeField = require('react-bootstrap-datetimepicker');

var TicketAptEditor = React.createClass({
    getInitialState: function() {
        // create state of ticket from prop so that we can use it to determine
        // if there is any change to the ticket
        var ticket = null;
        if (this.props.ticket != null){
            ticket = this.props.ticket.deepClone();
        }
        return {
            ticket: ticket
        };
    },
    propTypes: {
        mode: React.PropTypes.string.isRequired
    },
    getDefaultProps: function(){
        return {
            queue: null,
            ticket: null
        };
    },
    componentDidMount: function(){
        $('#inputState').selecter({
            cover: true
        });
    },
    componentWillUnmount: function(){
    },
    componentWillReceiveProps: function(nextProps){
        if (nextProps.ticket === null){
            this.setState({
                ticket : null
            });
            return;
        }

        if (this.props.ticket === null || (!this.props.ticket.isEqual(nextProps.ticket))){
            var ticket = nextProps.ticket.deepClone();
            this.setState({
                ticket : ticket
            });
        }
    },
    componentWillUpdate: function(nextProps, nextState){
        // Cannot use setState here
    },
    handleAddAndPrintClick: function(){
        this.handleAddClick();
        this.handlePrintClick();
    },
    handlePrintClick: function(event){
        alert("print");
    },
    handleCancelClick: function(event){
        AppActionCreator.cancelTicket(this.props.queue, this.state.ticket);
    },
    handleUpdateClick: function(event){
        AppActionCreator.updateTicket(this.props.queue, this.state.ticket);
    },
    handleAddClick: function(event){
        // Do not set ticket changes into this.props.ticket, because we
        // are not sure if the change will be saved successfully on the server
        // If yes, the change will be propagated from the server back to client successfully.
        AppActionCreator.addTicket(this.props.queue, this.state.ticket, this.state.ticket.apt);
    },
    sendActionIfEdit: function(ticket){
        if (this.props.mode == AppConstant.MODE_EDIT){
            AppActionCreator.editTicket(this.state.ticket);
        }
    },
    handleTicketChange: function(event){
        this.state.ticket[event.target.name] = event.target.value;
        this.setState({ ticket: this.state.ticket});
        this.sendActionIfEdit(this.state.ticket);
    },
    handleAptChange: function(event){
        console.log(event.target.value);
        this.state.ticket.apt[event.target.name] = event.target.value;
        this.setState({ ticket: this.state.ticket});
        this.sendActionIfEdit(this.state.ticket);
    },
    handleAptCheck: function(event){
        console.log(event.target.value);
        this.state.ticket.apt[event.target.name] = event.target.checked;
        this.setState({ ticket: this.state.ticket});
        this.sendActionIfEdit(this.state.ticket);
    },
    handleBookingTimeChange: function(time){
        var value = parseInt(time);
        var hour = Math.floor(value/100);
        var min = value % 100;
        var booking = this.state.ticket.apt.aptDateTime;
        booking.hour(hour);
        booking.minute(min);

        this.setState({ ticket: this.state.ticket});
        this.sendActionIfEdit(this.state.ticket);
    },
    handleBookingDateChange: function(date){
        var value = parseInt(date);
        var day = value % 100;
        value = (value - day) / 100;
        var month = value % 100;
        var year = (value - month) / 100;
        var booking = this.state.ticket.apt.aptDateTime;
        booking.year(year);
        booking.month(month);
        booking.date(day);

        this.setState({ ticket: this.state.ticket});
        this.sendActionIfEdit(this.state.ticket);
    },
    render: function(){
        var mode = this.props.mode;
        var queue = this.props.queue;
        if (queue === null && mode === AppConstant.MODE_ADD){
            return (<div>No queue is selected</div>);
        }
        var ticket = this.state.ticket;
        if (ticket === null){
            return (<div>No ticket is available</div>);
        }
        var apt = ticket.apt;
        var topButtons;
        if (mode === AppConstant.MODE_ADD){
            topButtons =
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-default" aria-label="Add and Print" onClick={this.handleAddAndPrintClick}>
                        <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                        <span className="glyphicon glyphicon-plus" aria-aria-hidden="true"></span>
                        <span className="glyphicon glyphicon-print" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" aria-label="Add" onClick={this.handleAddClick}>
                        <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                    </button>
                </div>;
        }
        else {
            topButtons =
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-default" aria-label="Delete" onClick={this.handleCancelClick}>
                        <span className="glyphicon glyphicon-trash" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" aria-label="Save" onClick={this.handleUpdateClick}>
                        <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" aria-label="Print">
                        <span className="glyphicon glyphicon-print" aria-aria-hidden="true"></span>
                    </button>
                </div>;
        }

        var options = TicketStatus.values.map(function(v, i){
            return <option key={v} value={v}>{TicketStatus.getString(v)}</option>;
        }, this);

        var ticketId = null;
        if (mode === AppConstant.MODE_ADD){
            ticketId = queue.nextTicketId;
        }
        else{
            ticketId = ticket.id;
        }
        var dirty = "";
        if (this.props.dirty){
            dirty = "(Changed)";
        }
        return (
                <form>
                    {topButtons}
                    <div className="form-group">
                    {
                        // This field is for reference only
                    }
                        <label htmFor="ticketId">Ticket ID {dirty}</label>
                        <input type="text" className="form-control" readOnly id="ticketId" value={ ticketId } ref="ticketId"/>
                    </div>
                    <div className="form-group">
                        <label htmFor="status">Status</label>
                        <select id="status" name="status" value={ticket.status} onChange={this.handleTicketChange}>
                            {options}
                        </select>
                    </div>
                    <hr/>
                    <div className="form-group">
                        <label htmFor="custName">Name</label>
                        <input type="text" className="form-control" id="custName" name="custName" value={apt.custName} onChange={this.handleAptChange} />
                    </div>
                    <div className="form-group">
                        <label htmFor="phone">Phone</label>
                        <input type="text" className="form-control" id="phone" name="phone" value={apt.phone} onChange={this.handleAptChange}/>
                    </div>
                    <div className="form-group">
                        <label htmFor="custId">Customer ID</label>
                        <input type="text" className="form-control" id="custId" name="custId" value={apt.custId} onChange={this.handleAptChange}/>
                    </div>
                    <div className="x-test">
                        <label htmFor="inputBookingTime">Booking Time</label>
                        <DateTimeField pickDate={false} dateTime={apt.aptDateTime.format('HHmm')} format='HHmm' inputFormat='hh:mm A' onChange={this.handleBookingTimeChange}/>
                    </div>
                    <div className="form-group x-test">
                        <label htmFor="inputBookingDate">Booking Date</label>
                        <DateTimeField pickTime={false} dateTime={apt.aptDateTime.format('YYYYMMDD')} format='YYYYMMDD' inputFormat='DD MMM YYYY' onChange={this.handleBookingDateChange}/>
                    </div>
                    <div className="form-group">
                        <label htmFor="inputBookingSuggestion">Booking Suggestions</label>
                        <select multiple className="form-group" id="inputBookingSuggestion">
                        </select>
                    </div>
                    <div className="checkbox">
                        <label htmFor="receiveSMS">
                            <input type="checkbox" id="receiveSMS" name="receiveSMS" checked={apt.receiveSMS} onChange={this.handleAptCheck}/>Receive SMS
                        </label>
                    </div>
                    <div className="checkbox">
                        <label htmFor="inputReceiveSMS">
                            <input type="checkbox" id="receiveCall" name="receiveCall" checked={apt.receiveCall} onChange={this.handleAptCheck}/>Receive Call
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmFor="inputExtraConsultingTime">Extra Consulting Time</label>
                        <input type="text" className="form-control" id="inputExtraConsultingTime" />
                    </div>
                    <div className="form-group">
                        <label htmFor="inputPreConsultingCheck">Pre Consulting Check</label>
                        <input type="text" className="form-control" id="inputPreConsultingCheck" />
                    </div>
                </form>
        );
    }
});

module.exports = TicketAptEditor;