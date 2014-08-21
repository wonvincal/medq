/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var app = app || {};

$(function(){
    var tickets = new app.Tickets();
    
    // 
    // Assume that the user has already logged in
    // The user has a queue
    var queue = new app.Queue({
        displayName: 'Consultation',
        lastSeqNum: 0,
        tickets: tickets
    });    
    new app.MainView({queue: queue});
    new app.ConfigView({queue: queue});
});

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
