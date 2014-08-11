/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.QueueView = Backbone.View.extend({
    
    tagName: 'div',
    
    className: 'queue-view',
    
    // model is passed in from the constructor
    initialize: function(){
        this.render();
    },
    
    // Render the whole queue
    render: function(){
        this.ticketsView = new app.TicketsView({ collection : this.model.get('tickets') });
        this.$el.append(this.ticketsView.el);
        this.ticketsView.on("selected", this.ticketSelected, this);
        return this;
    },
    
    ticketSelected: function(item){
        this.trigger("selected", item);
    },
    
    next: function(){
        this.ticketsView.next();
    }
});

app.QueueSummaryView = Backbone.View.extend({

    tagName: 'div',
    
    template: _.template($('#queue-summary-template').html()),
    
    initialize: function(){
    },

    render: function(){
        this.$el.html(this.template());
        return this;
    }    
});

app.QueueAlertView = Backbone.View.extend({
    
    tagName: 'div',
    
    template: _.template($('#queue-alert-template').html()),
    
    initialize: function(){
    },
    
    render: function(){
        this.$el.html(this.template());
        return this;
    }
});