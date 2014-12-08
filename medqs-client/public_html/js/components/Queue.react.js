/* 
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');

var Queue = React.createClass({
    render: function(){
        var queue = this.props.queue;
        var tickets = queue.tickets;
        return (
            <div className="container">
                <div>Name: {queue.name} Waiting {queue.numWaiting}</div>
                <div>{
                    tickets.map(function(ticket, index){
                        return (
                            <div className="ticket-item" key={ticket.id}>
                                <div className="ticket-id">{ticket.id}</div>
                                <div className="ticket-status">{ticket.status}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
});

module.exports = Queue;