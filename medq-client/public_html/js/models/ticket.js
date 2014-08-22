/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.Ticket = Backbone.Model.extend({
    // The valid states are:
    // 5) Consulting
    // 4) Next
    // 3) Arrived
    // 2) Registered
    // 1) Scheduled
    defaults: {
       displayName: '',
       phone: '',
       bookingTime: '',
       targetTime: '',
       remainingWaitingTime: '',
       completionTime: '',
       status: 'registered',
       delaysInMs: {},
       effectiveTargetTime: '',
       remainingEffectiveWaitingTime: '',
       consultationStartTime: '',
       consultationDuration: '',
       overrunStartTime: '',
       notificationMethods: [], // Should be an object
       arrivalConfirmations: [], // Should be an object
       messageReceipients: [], // Should be an object
    },
   
    initialize: function(){
       this.set("id", app.Ticket.nextSeqNum());
    },
        
    getEffectiveTargetTime: function(){
        var totalDelayInMs = 0;
        for (var key in this.delaysInMs)
        {
            totalDelayInMs = totalDelayInMs + this.delaysInMs[key];
        }
        return moment(this.get("targetTime")).clone().add("ms", totalDelayInMs);
    }
},{
    count: 100,
    nextSeqNum: function(){
        return ++this.count;
    }
});

