/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// TicketView
// TicketDetailsView
var app = app || {};

app.TicketsView = Backbone.View.extend({
    
    tagName: 'div',
    
    initialize: function(){
        // render() has to be called before subscribing to add/remove event
        // otherwise ticket may get removed before it appears in the collection
        this.views = [];
        this.render();
        this.listenTo(this.collection, 'add', this.renderTicket);
        this.listenTo(this.collection, 'remove', this.clearTicket);
    },
    
    // Render all tickets
    render: function(){
        this.collection.each(function(item){
            this.renderTicket(item);
        }, this);
        return this;
    },
    
    // Add a ticket to the queue
    // TODO: Shouldn't just append to the list
    // Render one ticket
    renderTicket: function(item){
        var ticketView = new app.TicketView({model: item});
        ticketView.on("selected", this.ticketSelected, this);
        this.$el.append(ticketView.render().el);
        this.views.push(ticketView);
    },
    
    ticketSelected: function(item){
        this.trigger("selected", item);
    },
    
    // Remove a ticket from the collection
    clearTicket: function(item){
        // Use a jquery selector to select the one with specific ID
        // assuming that the ticket has an ID attribute
        this.refresh();
    },
    
    // Very inefficient :)
    refresh: function(){
        this.$el.empty();
        _.each(this.views, function(view){
           view.close(); 
        });
        this.views = [];
        this.render();
    },

    enqueueTicket: function(item){
        this.collection.add(item);
    },
    
    dequeueTicket: function(item){
        this.collection.remove(item);
    },
    
    next: function(){
        // If second ticket exist, set the second ticket's status to Consulting
        // Remove the first one
        if (this.collection.length >= 2)
        {
            var item = this.collection.at(1);
            item.set("status", "Consulting");
            item.set("remainingWaitingTime", "Now");
        }
        this.collection.shift();
    }
});

app.TicketView = Backbone.View.extend({
    
    tagName: 'div',
    
    template: _.template($('#ticket-template').html()),
    
    events: {
        'click': 'selected'
    },
    
    render: function(){        
        data = _.clone(this.model.attributes);
        data["cid"] = this.model.cid;
        
        if (data["status"] === "Consulting")
        {
            data["statusClass"] = "in-progress";
        }
        else if (data["status"] === "Arrived")
        {
            data["statusClass"] = "arrived";
        }
        else
        {
            data["statusClass"] = "other";
        }
        
        this.$el.html(this.template(data));
        return this;
    },

    selected: function(){
        this.trigger("selected", this.model.cid);
    }    
});

app.TicketDetailsView = Backbone.View.extend({

    tagName: 'div',

    events: {
        'click #save': 'enqueue',
        'click #delete': 'dequeue'
    },

    initialize: function(){
    },
    
    render: function(){
        // if model == null, add; else, modify
        var templateParams = {};
        if (this.model)
        {
            templateParams = _.clone(this.model.attributes);
            templateParams["newEntryDisplayFlag"] = "none";
            templateParams["modifyEntryDisplayFlag"] = "block";
        }
        else
        {
            templateParams["displayName"] = "";
            templateParams["newEntryDisplayFlag"] = "block";
            templateParams["modifyEntryDisplayFlag"] = "none";
        }
        
        this.$el.html(_.template($('#ticket-details-template').html(), templateParams));
        return this;
    },
    
    enqueue: function(){
        var data = {};
        
        //http://stackoverflow.com/questions/11800890/apply-jquery-function-on-an-el-of-backbone-js-to-get-the-value-of-its-children
        this.$('input').each(function(i, el){
           if ($(el).val() !== '')
           {
               data[el.id] = $(el).val();
           }
           data["remainingWaitingTime"] = 10;
        });
        this.collection.add(new app.Ticket(data));
    },
    
    dequeue: function(){
        this.collection.remove(this.model);
    }
});