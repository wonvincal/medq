/*
 * Component for display a specific selected Ticket or to get a new ticket
 * If ticket is not set, this component should be a 'Create New Ticket' component
 * If ticket is set, this component should be a 'Update Ticket' component
 *
 * Should we allow creation of ticket for different queues?
 * Why not?  IN the beginning, default to the main queue.  If people really want to
 * create ticket for a queue different from the primary one, we can do something
 *
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var TicketModel = require('../models/ticket.model');

var Ticket = React.createClass({
    getDefaultProps: function(){
        return {
            ticket: new TicketModel(-1, null)
        };
    },
    getInitialState: function(){
        return {
            queue: null,
            mode: "create"
        };
    },
    render: function(){
        var ticket = this.props.ticket;
        console.log(ticket);

        if (this.state.mode == "create")
        {
            return (
                <form>
                    <div className="btn-group" role="group" aria-label="...">
                        <button type="button" class="btn btn-default" aria-label="Add and Print">
                            <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                            <span className="glyphicon glyphicon-plus" aria-aria-hidden="true"></span>
                            <span className="glyphicon glyphicon-print" aria-aria-hidden="true"></span>
                        </button>
                        <button type="button" class="btn btn-default" aria-label="Add">
                            <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                        </button>
                    </div>
                </form>
            );
        }
        return (
            <form>
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" class="btn btn-default" aria-label="Delete">
                        <span className="glyphicon glyphicon-trash" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-default" aria-label="Save">
                        <span className="glyphicon glyphicon-ok" aria-aria-hidden="true"></span>
                    </button>
                    <button type="button" class="btn btn-default" aria-label="Print">
                        <span className="glyphicon glyphicon-print" aria-aria-hidden="true"></span>
                    </button>
                </div>
            </form>
        );
    }
});

module.exports = Ticket;