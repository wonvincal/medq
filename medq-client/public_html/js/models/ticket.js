/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.Ticket = Backbone.Model.extend({
    defaults: {
       displayName: '',
       phone: '',
       registerTime: '',
       completionTime: '',
       status: 'New',
       remainingWaitingTime: '',
       notificationMethods: [], // Should be an object
       arrivalConfirmations: [], // Should be an object
       messageReceipients: [] // Should be an object
    },
   
    initialize: function(){
       
    }
});

