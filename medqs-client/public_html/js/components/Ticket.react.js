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
 * Props
 * - mode: own by parent
 * - nextTicketId: pass down by parent
 * - cid: pass down by parent
 *
 * State
 * - status: pass down by parent or self change
 * - id
 * - queue
 * - appointment
 *
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var TicketModel = require('../models/ticket.model');
var TicketStatus = require('../models/ticketstatus.model');
var MedqsService = require('../utils/medqsservice');

/**
 * Get the first part done first
 * 1. Get a ticket
 * @type {*|Function}
 */
var Ticket = React.createClass({
    propTypes: {
        queue: React.PropTypes.object.isRequired,
        ticket: React.PropTypes.object.isRequired,
        nextTicketId: React.PropTypes.string.isRequired,
        mode: React.PropTypes.string
    },
    getDefaultProps: function(){
        return {
            queue: null,
            ticket: new TicketModel(-1, null),
            nextTicketId: -1
        };
    },
    getInitialState: function(){
        return {
            mode: "create"
        };
    },
    componentDidMount: function(){
        $('#inputBookingDatePicker').datetimepicker({
            pickTime: false
        });
        $('#inputBookingTimePicker').datetimepicker({
            pickDate: false
        });
        $('#inputState').selecter({
            cover: true
        });
    },
    handleAddAndPrintClick: function(){
        this.handleAddClick();
        this.handlePrintClick();
    },
    handleAddClick: function(event){
        var ticket = new TicketModel();

        // Get all the fields
        ticket.status = this.refs.ticketState.getDOMNode().value;

        // Call onChange
        this.props.onChange(ticket);
    },
    handleDeleteClick: function(event){
        alert("delete");
    },
    handleUpdateClick: function(event){
        alert("update");
    },
    handlePrintClick: function(event){
        alert("print");
    },
    render: function(){
        var ticket = this.props.ticket;
        console.log(ticket);

        var topButtons;
        if (this.state.mode == "create")
        {
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
        else
        {
            topButtons =
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-default" aria-label="Delete" onClick={this.handleDeleteClick}>
                        <span className="glyphicon glyphicon-trash" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" aria-label="Save" onClick={this.handleUpdateClick}>
                        <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" className="btn btn-default" aria-label="Print" onClick={this.handlePrintClick}>
                        <span className="glyphicon glyphicon-print" aria-aria-hidden="true"></span>
                    </button>
                </div>;
        }

        var options = TicketStatus.values.map(function(v, i){
            return <option key={v} value={v}>{TicketStatus.getString(v)}</option>;
        }, this);

        return (
            <form>
                {topButtons}
                <div className="form-group">
                    { /* This field is for reference only */ }
                    <label htmFor="inputTicketId">Ticket ID</label>
                    <input type="text" className="form-control" readOnly id="inputTicketId" value={this.props.nextTicketId} />
                </div>
                <div className="form-group">
                    <label htmFor="inputState">State</label>
                    <select id="inputState" ref="ticketState">
                        {options}
                    </select>
                </div>
                <hr/>
                <div className="form-group">
                    <label htmFor="inputName">Name</label>
                    <input type="text" className="form-control" id="inputName" />
                </div>
                <div className="form-group">
                    <label htmFor="inputPhone">Phone</label>
                    <input type="text" className="form-control" id="inputPhone" />
                </div>
                <div className="form-group">
                    <label htmFor="inputCustID">Customer ID</label>
                    <input type="text" className="form-control" id="inputCustID" />
                </div>
                <div className="form-group">
                    <label htmFor="inputBookingTime">Booking Time</label>
                    <div className="input-group date" id="inputBookingTimePicker" >
                        <input type="text" className="form-control" id="inputBookingTime" />
                        <span className="input-group-addon">
                            <span className="glyphicon glyphicon-time"></span>
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmFor="inputBookingDate">Booking Date</label>
                    <div className="input-group date" id="inputBookingDatePicker" >
                        <input type="text" className="form-control" id="inputBookingDate" />
                        <span className="input-group-addon">
                            <span className="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmFor="inputBookingSuggestion">Booking Suggestions</label>
                    <select multiple className="form-group" id="inputBookingSuggestion">
                    </select>
                </div>
                <div className="checkbox">
                    <label htmFor="inputReceiveSMS">
                        <input type="checkbox" id="inputReceiveSMS" />
                    Receive SMS</label>
                </div>
                <div className="checkbox">
                    <label htmFor="inputReceiveSMS">
                        <input type="checkbox" id="inputReceiveCall" />
                    Receive Call</label>
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

module.exports = Ticket;