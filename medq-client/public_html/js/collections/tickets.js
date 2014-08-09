/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

app.Tickets = Backbone.Collection.extend({
    
    model: app.Ticket,
    
    initialize: function(models, options){
    }
});