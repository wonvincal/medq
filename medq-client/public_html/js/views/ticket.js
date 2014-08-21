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
        this.listenTo(this.collection, 'remove', this.removeTicket);
        this.listenTo(this.collection, 'refresh', this.refresh);
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
        this.listenTo(ticketView, "selected", this.ticketSelected);
        this.listenTo(ticketView, "unselected", this.ticketUnselected);
        this.$el.append(ticketView.render().el);
        this.views.push(ticketView);
    },
    
    ticketSelected: function(ticketView){
        if (!this.selectedView)
        {
            this.selectedView = ticketView;
            this.trigger("selectionChanged", this.selectedView);
            return;
        }
        
        // If an item has been selected, unselect the existing one
        // then select the new one
        if (ticketView.model.id !== this.selectedView.model.id)
        {
            this.selectedView.unselect();
            this.selectedView = ticketView;
            this.trigger("selectionChanged", this.selectedView);
        }
    },
    
    ticketUnselected: function(ticketView){
      if (ticketView === this.selectedView)
      {          
          this.selectedView = null;
          this.trigger("selectionChanged", null);
      }
    },
    
    // Remove a ticket from the collection
    removeTicket: function(item){
        // Not using any helper library like Underscore here,
        // because we want to get the index of the item and apply "splice" there
        
        var count = this.views.length;
        var view = null;
        for (var i = 0; i < count; i++)
        {
          if (item.id === this.views[i].model.id)
          {
              view = this.views[i];
              this.views.splice(i, 1);
              break;
          }
        }

        if (view)
        {
            this.ticketUnselected(view);
            view.close();
        }        
    },
    
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
        if (this.collection.length === 1)
        {
            var item = this.collection.at(0);
            if (item.get("status") !== "in-progress")
            {
                item.set("status", "in-progress");
                item.set("remainingWaitingTime", 0);
                item.set("targetTime", Date.now());
            }
            else 
            {
                this.collection.shift();
            }
        }
        else if (this.collection.length >= 2)
        {
            var item = this.collection.at(0);
            if (item.get("status") !== "in-progress")
            {
                item.set("status", "in-progress");
                item.set("remainingWaitingTime", 0);
                item.set("targetTime", Date.now());
            }
            else
            {            
                var item = this.collection.at(1);
                item.set("status", "in-progress");
                item.set("remainingWaitingTime", 0);
                item.set("targetTime", Date.now());
                this.collection.shift();                
            }
        }        
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
        this.listenTo(this.model, 'change', this.render);
    },
    
    clicked: function() {
        this.select();
    },
    
    render: function(){        
        data = _.clone(this.model.attributes);
        data["cid"] = this.model.cid;
        data["id"] = this.model.id;
        
        // Referecen to datalist "status-list" should be used instead of
        // this hacky if/else here
        if (data["status"] === "in-progress")
        {
            data["statusAsStr"] = "Consulting";
        }
        else if (data["status"] === "arrived")
        {
            data["statusAsStr"] = "Arrived";
        }
        else
        {
            data["statusAsStr"] = "Scheduled";
        }
        
        data["targetTimeAsStr"] = moment(this.model.get("targetTime")).format("HH:mm");
        this.$el.html(this.template(data));
        return this;
    },

    select: function(){
        this.$el.addClass(this.selectedClass);
        this.trigger("selected", this);
    },
    
    unselect: function(){
        this.$el.removeClass(this.selectedClass);
        this.trigger("unselected", this);
    }
});

app.TicketDetailsView = Backbone.View.extend({

    tagName: 'div',

    events: {
        'click #save': 'enqueue',
        'click #delete': 'dequeue',
        'click #saveModify': 'modify'
    },

    initialize: function(options){
        this.consultingTime = options.consultingTime;
        this.businessSessions = [];
        var businessSession = {};
        businessSession["start"] = moment().hour(1).minutes(0).second(0).milliseconds(0);
        businessSession["end"] = moment().hour(12).minutes(0).second(0).milliseconds(0);
        this.businessSessions[0] = businessSession;
        
        businessSession = {};
        businessSession["start"] = moment().hour(14).minutes(0).second(0).milliseconds(0);
        businessSession["end"] = moment().hour(23).minutes(0).second(0).milliseconds(0);
        this.businessSessions[1] = businessSession;        
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
            templateParams["phone"] = "";
            templateParams["status"] = "arrived";
            templateParams["bookingTime"] = "";
            templateParams["newEntryDisplayFlag"] = "block";
            templateParams["modifyEntryDisplayFlag"] = "none";
        }
        
        this.$el.html(_.template($('#ticket-details-template').html(), templateParams));
        this.$('#status').val(templateParams["status"]);
        this.$('#status').selectmenu();
        this.$('[type="checkbox"]').checkboxradio();
        this.$('[type="text"]').textinput();
        return this;
    },

    complete: function(){
        this.trigger('completed');
    },
    
    modify: function(){
        this.model.set("displayName", this.$("#displayName").val());
        this.model.set("phone", this.$("#phone").val());
        this.model.set("status", this.$("#status").val());
        this.model.set("bookingTime", this.$("#bookingTime").val());
        this.complete();
    },

    isWithinPeriod: function(booking, boundary){
        if ((booking["start"] >= boundary["start"]) && (booking["end"] <= boundary["end"]))
        {
            return true;
        }
        return false;
    },

    isWithinBusinessHours: function(booking){
        for (var i = 0; i < this.businessSessions.length; i++)
        {
            if (this.isWithinPeriod(booking, this.businessSessions[i]))
            {
                return true;
            }
        }
        return false;
    },
    
    getBusinessSession: function(booking, businessSession){
        for (var i = 0; i < this.businessSessions.length; i++)
        {
            if (this.isWithinPeriod(booking, this.businessSessions[i]))
            {
                businessSession["start"] = this.businessSessions[i]["start"];
                businessSession["end"] = this.businessSessions[i]["end"];
                return true;
            }
        }
        return false;        
    },
    
    getBookingWithinBusinessHours: function(booking, suggestedBooking){
        if (this.isWithinBusinessHours(booking))
        {
            suggestedBooking["start"] = booking["start"];
            suggestedBooking["end"] = booking["end"];
            return true;
        }

        var diffInMs = booking["end"].diff(booking["start"]);
        for (var i = 0; i < this.businessSessions.length; i++)
        {
            // Find the first business slot that is after the booking time
            if (this.businessSessions[i]["start"] >= booking["start"])
            {
                suggestedBooking["start"] = this.businessSessions[i]["start"].clone();
                suggestedBooking["end"] = suggestedBooking["start"].clone().add("ms", diffInMs);
                if (this.isWithinPeriod(suggestedBooking, this.businessSessions[i]))
                {
                    return true;
                }
            }
        }
        return false;      
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
        
        if (data["bookingTime"])
        {
            data["status"] = "scheduled";
        }
        
        // Number of tickets in the queue + buffer time
        var targetTime = 0;
        
        // All the hacking logic is here
        // If it is walk-in, book at the next available slot (bound by business hours)
        // If it is a scheduled appointment, check if that slot is available, if not, display error
        var insertIndex = -1;
        var tickets = this.collection;
        var numTickets = tickets.length;
        var estimatedConsultationTime = this.consultingTime;
        
        if (!data["bookingTime"])
        {            
            var origBooking = {};
            var targetTime =  moment(Date.now()).clone().second(0).milliseconds(0);;
            origBooking["start"] = targetTime;
            origBooking["end"] = targetTime.clone().add("m", estimatedConsultationTime);
            
            var booking = {};
            if (!this.getBookingWithinBusinessHours(origBooking, booking))
            {
                // No valid booking for today
            }
            else if (numTickets === 0)
            {
                insertIndex = 0;
            }
            else
            {
                var boundary = {};
                boundary["start"] = this.businessSessions[0]["start"];
                
                // Look at each ticket
                var result = false;
                for (var i = 0; i < numTickets; i++)
                {
                    var m = tickets.at(i);
                    boundary["end"] = moment(m.get("targetTime")).clone();
                    if (this.isWithinPeriod(booking, boundary))
                    {
                        // The booking is within boundary (between tickets)
                        if (this.isWithinBusinessHours(booking))
                        {
                            // The booking is also within business hours
                            insertIndex = i;
                            result = true;
                            break;
                        }
                        else
                        {
                            // The booking is NOT within business hours
                            // Get the first booking (NEW) of the next business period and test the same boundary again
                            // if this (NEW) booking is not within the same boundary, 
                            var suggestedBooking = {};
                            if (!this.getBookingWithinBusinessHours(booking, suggestedBooking))
                            {
                                // No more booking within business hours is available
                                // TODO: merge isWithinBusinessHours and getBookingWithinBusinessHours
                                result = true;
                                break;
                            }
                            else
                            {
                                if (this.isWithinPeriod(suggestedBooking, boundary))
                                {
                                    insertIndex = i;
                                    booking = suggestedBooking;
                                    result = true;
                                    break;
                                }
                                else
                                {
                                    // find next period
                                }
                            }
                        }
                    }
                    boundary["start"] = boundary["end"].clone().add("m", estimatedConsultationTime);
                    booking["start"] = moment(boundary["start"]).clone();
                    booking["end"] = booking["start"].clone().add("m", estimatedConsultationTime);
                }
                if (!result)
                {
                    // Check last period
                    booking["start"] = moment(tickets.at(numTickets - 1).get("targetTime")).clone().add("m", estimatedConsultationTime);
                    booking["end"] = booking["start"].clone().add("m", estimatedConsultationTime);
                    if (this.isWithinBusinessHours(booking))
                    {
                        // Insert at last line
                        result = true;
                        insertIndex = numTickets;
                    }
                    else
                    {
                        var suggestedBooking = {};
                        result = true;
                        if (this.getBookingWithinBusinessHours(booking, suggestedBooking))
                        {
                            insertIndex = numTickets;
                        }
                        booking = suggestedBooking;
                    }
                }
                if (!result)
                {
                    window.alert("Invalid");
                }
            }

            /*
            // find the first gap that can hold a (estimatedConsultationTime x 2) gap
            var insertIndex = 0;
            var length = this.collection.length;
            if (length == 0)
            {
                // targetTime - no change
                // insertIndex - no change
            }
            else
            {
                var found = 0;
                for (var i = 0; i < length; i++)
                {
                    var m = this.collection.at(i);
                    var tempTime = targetTime.clone().add(estimatedConsultationTime);
                    if (tempTime < m.targetTime)
                    {
                        found = 1;
                        insertIndex = i;
                        break;
                    }
                    else
                    {
                        targetTime = moment(m.targetTime).clone().add("m", estimatedConsultationTime);
                    }
                }
                if (!found)
                {
                    insertIndex = length;
                }
            }
            remainingWaitingTime = Math.ceil(targetTime.diff(Date.now())/60000);*/
        }
        else
        {
            // Scheduled
            var x = data["bookingTime"];
            var min = x % 100;
            var hour = Math.floor(x / 100);
            var targetTime = moment().hour(hour).minutes(min).second(0).milliseconds(0);
            
            var booking = {};
            booking["start"] = targetTime;
            booking["end"] = targetTime.clone().add("m", estimatedConsultationTime);
            
            var now = moment().second(0).milliseconds(0);
            var result = false;
            if (booking["start"] < now)
            {
                window.alert("Invalid booking time");
            }
            else if (numTickets === 0)
            {
                if (this.isWithinBusinessHours(booking))
                {
                    insertIndex = 0;
                }
            }
            else
            {
                var boundary = {};
                boundary["start"] = this.businessSessions[0]["start"];

                var found = false;
                for (var i = 0; i < numTickets; i++)
                {
                    var m = this.collection.at(i);
                    boundary["end"] = moment(m.get("targetTime")).clone();
                    if (this.isWithinPeriod(booking, boundary))
                    {
                        if (this.isWithinBusinessHours(booking))
                        {
                            found = true;
                            insertIndex = i;
                        }
                    }
                    boundary["start"] = boundary["end"].clone().add("m", estimatedConsultationTime);
                }
                if (!found)
                {
                    var session = {};
                    if (this.getBusinessSession(booking, session))
                    {
                        var start = moment(tickets.at(numTickets - 1).get("targetTime")).clone().add("m", estimatedConsultationTime);
                        var end = session["end"];
                        if (start < end)
                        {
                            boundary["start"] = start;
                            boundary["end"] = end;
                            if (this.isWithinPeriod(booking, boundary))
                            {
                                found = true;
                                insertIndex = numTickets;
                            }
                        }
                    }
                }
                if (!found)
                {
                    window.alert("Invalid booking time");
                }
            }
        }

        if (insertIndex !== -1)
        {
            data["targetTime"] = booking["start"];
            data["remainingWaitingTime"] = Math.ceil(data["targetTime"].diff(Date.now())/60000);
            //remainingWaitingTime = Math.ceil(targetTime.diff(Date.now())/60000);
        
            //data["targetTime"] = targetTime;
            //data["remainingWaitingTime"] = remainingWaitingTime;
            this.collection.add(new app.Ticket(data), {at: insertIndex});
            
            if (insertIndex < numTickets)
            {
                this.collection.trigger("refresh");
            }
        }
        this.complete();
    },
    
    dequeue: function(){
        this.collection.remove(this.model);
        this.complete();
    }
});