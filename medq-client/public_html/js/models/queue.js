/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.Queue = Backbone.Model.extend({
    
    defaults: {        
        displayName: '',
        lastSeqNum: '',
        algo: '',
        numWaiting: 0
    },
    
    initialize: function(attributes, options){
        var tickets = null;
        if (attributes.tickets)
        {
            tickets = attributes.tickets;
        }
        else
        {
            this.tickets = new app.Tickets();
            tickets = this.tickets;
        }
        
        this.numWaiting = tickets.length;
        this.listenTo(tickets, 'add', this.addTicket);
        this.listenTo(tickets, 'remove', this.removeTicket);
    },
    
    addTicket: function(ticket){
        this.set("numWaiting", this.get("numWaiting") + 1);
    },
    
    removeTicket: function(ticket){
        // Place holder
        this.set("numWaiting", this.get("numWaiting") - 1);
    }
});

