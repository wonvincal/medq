/* 
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');

var Queue = React.createClass({
    render: function(){
        var queue = this.props.queue;
        var tickets = queue.tickets;
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">{queue.name} <span className="text-right">Waiting {queue.numWaiting}</span></div>
                <div className="panel-body">
                {
                    tickets.map(function(ticket, index){
                        return (
                            <div className="pricing ticket" key={ticket.id}>
                                <ul>
                                    <li className="unit price-primary">
                                        <div className="price-title">
                                            <p>{ticket.id}</p>
                                        </div>
                                        <div className="price-body">
                                            <p>{ticket.appointment.custName}</p>
                                            <p>{ticket.appointment.custId}</p>
                                            <p><button type="button" className="btn btn-primary">{ticket.status}</button></p>
                                        </div>
                                        <div className="price-foot">05:19</div>
                                    </li>
                                </ul>
                            </div>
                        );
                    })
                }
                </div>
            </div>
        );
    }
});

module.exports = Queue;