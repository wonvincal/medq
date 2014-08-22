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
        numWaiting: 0,
        consultingTime: 11
    },
    
    initialize: function(attributes, options){
        this.businessSessions = [];
        var businessSession = {};
        businessSession["start"] = moment().hour(1).minutes(0).second(0).milliseconds(0);
        businessSession["end"] = moment().hour(12).minutes(0).second(0).milliseconds(0);
        this.businessSessions[0] = businessSession;
        
        businessSession = {};
        businessSession["start"] = moment().hour(14).minutes(0).second(0).milliseconds(0);
        businessSession["end"] = moment().hour(24).minutes(0).second(0).milliseconds(0);
        this.businessSessions[1] = businessSession; 
        
        this.tickets = null;
        if (attributes.tickets)
        {
            this.tickets = attributes.tickets;
        }
        else
        {
            this.tickets = new app.Tickets();
        }
        this.set("numWaiting", this.tickets.length);
        this.listenTo(this.tickets, 'add', this.addTicket);
        this.listenTo(this.tickets, 'remove', this.removeTicket);
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
    
    addTicket: function(ticket){
        this.set("numWaiting", this.get("numWaiting") + 1);
    },
    
    removeTicket: function(ticket){
        // Place holder
        this.set("numWaiting", this.get("numWaiting") - 1);
    },
    
    dequeueTicket: function(ticket){
        this.tickets.remove(ticket);
    },
    
    enqueueTicket: function(data){
        // Number of tickets in the queue + buffer time
        var targetTime = 0;
        
        // All the hacking logic is here
        // If it is walk-in, book at the next available slot (bound by business hours)
        // If it is a scheduled appointment, check if that slot is available, if not, display error
        var insertIndex = -1;
        var tickets = this.tickets;
        var numTickets = tickets.length;
        var estimatedConsultationTime = this.get("consultingTime");
        
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
        }
        else
        {
            // Scheduled
            var bt = data["bookingTime"];
            var min = bt % 100;
            var hour = Math.floor(bt / 100);
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
                    var m = this.tickets.at(i);
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
            this.tickets.add(new app.Ticket(data), {at: insertIndex});
            
            if (insertIndex < numTickets)
            {
                this.tickets.trigger("refresh");
            }
        }        
    }
});

