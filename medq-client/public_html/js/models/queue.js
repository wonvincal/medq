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
        tickets: new app.Tickets()
    },
    
    initialize: function(){
    },
    
    addTicket: function(ticket){
        this.get('tickets').add(ticket);
    },
    
    removeTicket: function(ticket){
        this.get('tickets').remove(ticket);
    }
});

