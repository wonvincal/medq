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

    var firstNames = ["Peter", "Mary", "Joe", "Anna", "Martin"];
    var lastNames = ["Wong", "Chan", "Tse", "Cheung", "Yuen"];
  
    var names = [];    
    for (var i = 0; i < firstNames.length; i++)
    {
        for (var j = 0; j < lastNames.length; j++)
        {
            names.push(firstNames[i] + " " + lastNames[j]);
        }
    }
    names = shuffle(names);
    
    var numTickets = 5;
    var now = moment(Date.now());
    var targetTime = now.clone();    
    for (var i = 0; i < Math.min(numTickets, names.length) ; i++)
    {
        var status = 'Arrived';
        if (i === 0)
        {
            status = 'Consulting';
        }
        var ticket = new app.Ticket({
            displayName: names[i],
            phone: 90000000 + Math.floor(Math.random() * 10000000),
            status: status,
            remainingWaitingTime: targetTime.diff(now)/60000,
            targetTime: targetTime.toDate()
        });
        queue.get('tickets').add(ticket);
        targetTime = targetTime.clone().add("m", 4 + Math.ceil(Math.random() * 2));
    }
    new app.MainView({queue: queue});
});

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
