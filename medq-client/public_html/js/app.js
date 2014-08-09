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

    var ticket = new app.Ticket({
        displayName: 'Calvin Wong', phone: '91231912', status: 'Consulting', remainingWaitingTime: '0 min (12:21)'
    });
    
    var ticket2 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: '5 mins (12:26)'
    });
    
/*    var ticket3 = new app.Ticket({
        displayName: 'Janice Chow', status: 'New', remainingWaitingTime: '10'
    });
    
    var ticket4 = new app.Ticket({
        displayName: 'Gail Wong', status: 'New', remainingWaitingTime: '10'
    });

    queue.get('tickets').add(ticket);
    queue.get('tickets').add(ticket2);
    queue.get('tickets').add(ticket3);
    queue.get('tickets').add(ticket4);
*/
    queue.get('tickets').add(ticket);
    queue.get('tickets').add(ticket2);
    new app.MainView({queue: queue});
});
