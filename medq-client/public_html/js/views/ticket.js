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
    
    className: 'tickets-view',
    
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
        this.listenTo(item, "selected", this.ticketSelected);
        this.$el.append(ticketView.render().el);
        this.views.push(ticketView);
    },
    
    ticketSelected: function(item){
        if (!this.selectedItem)
        {
            this.selectedItem = item;
            this.trigger("selected", item);
            return;
        }
        
        if (item.cid !== this.selectedItem.cid)
        {
            this.selectedItem.unselect();
            this.selectedItem = item;
            this.trigger("selected", item);
        }
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
    
    className: 'ticket-view',
    
    selectedClass: 'ticket-view-selected',
    
    template: _.template($('#ticket-template').html()),
    
    events: {
        'click': 'clicked'
    },
    
    initialize: function(){
        this.listenTo(this.model, 'selected', this.selected);
        this.listenTo(this.model, 'unselected', this.unselected);
    },
    
    clicked: function() {
        this.model.select();
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
        this.trigger("selected", this.model);
        this.$el.addClass(this.selectedClass);
    },
    
    unselected: function(){
        this.$el.removeClass(this.selectedClass);
    }
});

app.TicketDetailsView = Backbone.View.extend({

    tagName: 'div',

    events: {
        'click #save': 'enqueue',
        'click #delete': 'dequeue',
        'click #saveModify': 'modify'
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

    complete: function(){
        this.trigger('completed');
    },
    
    modify: function(){
        this.model.save();
        this.complete();
    },
    
    enqueue: function(){
        var data = {};
        
        //http://stackoverflow.com/questions/11800890/apply-jquery-function-on-an-el-of-backbone-js-to-get-the-value-of-its-children
        this.$('input').each(function(i, el){
           if ($(el).val() !== '')
           {
               data[el.id] = $(el).val();
           }
        });
                
        // Number of tickets in the queue + buffer time
        var tickets = this.collection;

        var estimatedWaitingTime = 5;
        if (tickets.length >= 1)
        {
            var lastTicket = tickets.at(tickets.length - 1);
            estimatedWaitingTime = lastTicket.get("remainingWaitingTime") + estimatedWaitingTime;
        }
        
        data["remainingWaitingTime"] = estimatedWaitingTime;
        
        this.collection.add(new app.Ticket(data));
        this.complete();
    },
    
    dequeue: function(){
        this.collection.remove(this.model);
        this.complete();
    }
});