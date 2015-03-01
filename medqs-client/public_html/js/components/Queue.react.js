/* 
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var Ticket = require('./Ticket.react');
// todo don't use this, pass thru props instead
var QueueSectionStore = require('../stores/QueueSectionStore');
var AppActionCreator = require('../actions/AppActionCreator');

var Queue = React.createClass({
    handleTicketClick: function(ticket){
        console.log("Queue:handleTicketClick: enter");
        AppActionCreator.selectTicket(ticket);
    },
    render: function(){
        var queue = this.props.queue;
        var tickets = queue.tickets;
        var selectedTicket = QueueSectionStore.getSelectedTicket();
        console.log("isSelected: " + this.props.isSelected);
        var isSelected = "Not Selected";
        if (this.props.isSelected)
        {
            isSelected = "Selected";
        }
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">{queue.name} <span className="text-right">Waiting {tickets.length} {isSelected}</span></div>
                <div className="panel-body">
                    <div className="pricing ticket" >
                        <ul className="list-inline">
                 {
                    tickets.map(function(ticket, index){
                        console.log(ticket);
                        var isSelected = false;
                        if (selectedTicket !== null && selectedTicket.isEqual(ticket)) {
                            isSelected = true;
                        }
                        return <Ticket key={ticket.id} ticket={ticket} selected={isSelected} onClick={this.handleTicketClick}/>;
                    }, this)
                }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Queue;