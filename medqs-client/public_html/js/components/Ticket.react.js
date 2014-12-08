/*
 * Component for display a specific selected Ticket or to get a new ticket
 * If ticket is not set, this component should be a 'Create New Ticket' component
 * If ticket is set, this component should be a 'Update Ticket' component
 *
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var TicketModel = require('../models/TicketModel');

var Ticket = React.createClass({
    getDefaultProps: function(){
        return {
            ticket: new TicketModel(-1, null)
        };
    },
    render: function(){
        var ticket = this.props.ticket;
        console.log(ticket);
        return (
            <div>
                <div>-- Ticket Section --</div>
                <div>Id: {ticket.id}</div>
                <div>Status: {ticket.status}</div>
            </div>
        );
    }
});

module.exports = Ticket;