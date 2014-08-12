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
        displayName: 'Calvin Wong', phone: '91231912', status: 'Consulting', remainingWaitingTime: 0
    });
    
    var ticket2 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 5
    });
    
    var ticket3 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 10
    });

    var ticket4 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 15
    });

    var ticket5 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 20
    });
    
    var ticket6 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 25
    });

    var ticket7 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 30
    });

    var ticket8 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 35
    });

    var ticket9 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 40
    });

    var ticket10 = new app.Ticket({
        displayName: 'Silas Yuen', phone: '91919192', status: 'Arrived', remainingWaitingTime: 45
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
    queue.get('tickets').add(ticket3);
    queue.get('tickets').add(ticket4);
    queue.get('tickets').add(ticket5);
    queue.get('tickets').add(ticket6);
    queue.get('tickets').add(ticket7);
    queue.get('tickets').add(ticket8);
    queue.get('tickets').add(ticket9);
    queue.get('tickets').add(ticket10);
    new app.MainView({queue: queue});

    //var content = $.mobile.getScreenHeight() - $(".ui-header").outerHeight() - $(".ui-footer").outerHeight() - $(".ui-content").outerHeight() + $(".ui-content").height();
    //$(".ui-content").height(content);
});
