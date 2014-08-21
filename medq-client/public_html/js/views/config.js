/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.ConfigView = Backbone.View.extend({

    el: '#config-panel',

    // Initialize different views
    initialize:function (options) {
        this.queue = options.queue;
    },

    events: {
        'click #apply-scheduled-tasks': 'enqueueScheduledTasks',
        'change #switchPublicView' : 'switchView'
    },
    
    switchView: function(){
        if ($("#switchPublicView").val() === "on")
        {
            $("#medq-style").attr('href','css/style-public.css');
        }
        else
        {
            $("#medq-style").attr('href','css/style.css');
        }
    },
    
    enqueueScheduledTasks: function(){
        console.log("Enqueue");
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

        var numTickets = $("#numScheduledTickets").val();
        if (!numTickets){
            numTickets = 1;
        }
        var now = moment(Date.now());
        var targetTime = now.clone().add("m", 30);
        for (var i = 0; i < Math.min(numTickets, names.length); i++)
        {
            var status = 'scheduled';
            var ticket = new app.Ticket({
                displayName: names[i],
                phone: 90000000 + Math.floor(Math.random() * 10000000),
                status: status,
                remainingWaitingTime: targetTime.diff(now) / 60000,
                targetTime: targetTime.toDate()
            });
            this.queue.get('tickets').add(ticket);
            targetTime = targetTime.clone().add("m", 30);
        }
    }
});


