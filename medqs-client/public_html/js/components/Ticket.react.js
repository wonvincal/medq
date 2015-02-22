/**
 * Created by Calvin on 2/2/2015.
 */
var React = require('react');
var TicketStatus = require('../constants/TicketStatus');

var Ticket = React.createClass({
    handleTicketClick: function(event){
        console.log("Ticket:handleTicketClick: enter");
        this.props.onClick(this.props.ticket);
    },
    render: function(){
        var ticket = this.props.ticket;
        var apt = this.props.ticket.apt;
        var status = TicketStatus.getString(ticket.status);
        var note = "";
        var aptTime = apt.aptDateTime.format('HH:mm');
        if (this.props.selected){
            note = "selected";
        }
        return (
                    <li className="unit price-primary" key={ticket.id} onClick={this.handleTicketClick}>
                        <div className="price-title">
                            <p>{ticket.id}</p>
                        </div>
                        <div className="price-body">
                            <p>{ticket.apt.custName}</p>
                            {/*<p>{ticket.apt.custId}</p>*/}
                            <p><button type="button" className="btn btn-primary">{status}</button></p>
                        </div>
                        <div className="price-foot">{aptTime} {note} </div>
                    </li>
        );
    }
});

module.exports = Ticket;