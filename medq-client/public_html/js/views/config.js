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
        this.$("#consultingTime").val(this.queue.get("consultingTime"));
        this.listenTo(this.queue, "change:consultingTime", this.consultingTimeChanged);

        var firstNames = ["Peter", "Mary", "Joe", "Anna", "Martin"];
        var lastNames = ["Wong", "Chan", "Tse", "Cheung", "Yuen"];

        this.names = [];
        for (var i = 0; i < firstNames.length; i++)
        {
            for (var j = 0; j < lastNames.length; j++)
            {
                this.names.push(firstNames[i] + " " + lastNames[j]);
            }
        }
        this.names = shuffle(this.names);
    },

    events: {
        'click #apply-scheduled-tasks': 'enqueueScheduledTasks',
        'click #apply-walkin-tasks': 'enqueueWalkinTasks',
        'change #switchPublicView' : 'switchView',
        'click #apply-consulting-time': 'applyConsultlingTime'
    },
    
    consultingTimeChanged: function(queue){
        this.$("#consultingTime").val(queue.get("consultingTime"));
    },
    
    applyConsultlingTime: function(){
        var consultingTime = this.$("#consultingTime").val();
        if (consultingTime)
        {
            this.queue.set("consultingTime", consultingTime);
        }
    },
    
    switchView: function(){
        if (this.$("#switchPublicView").val() === "on")
        {
            $("#medq-style").attr('href','css/style-public.css');
        }
        else
        {
            $("#medq-style").attr('href','css/style.css');
        }
    },
    
    enqueueWalkinTasks: function(){
        var numTickets = this.$("#numWalkinTickets").val();
        if (!numTickets){
            numTickets = 1;
        }        
        for (var i = 0; i < Math.min(numTickets, this.names.length); i++)
        {
            var data = {};
            data["status"] = 'arrived';
            data["displayName"] = this.names[i];
            data["phone"] = 90000000 + Math.floor(Math.random() * 10000000);
            this.queue.enqueueTicket(data);
        }
    },
    
    enqueueScheduledTasks: function(){
        var numTickets = this.$("#numScheduledTickets").val();
        if (!numTickets){
            numTickets = 1;
        }
        var now = moment(Date.now());
        var targetTime = now.clone().add("m", 30);
        for (var i = 0; i < Math.min(numTickets, this.names.length); i++)
        {
            var data = {};
            data["status"] = 'scheduled';
            data["displayName"] = this.names[i];
            data["phone"] = 90000000 + Math.floor(Math.random() * 10000000);
            data["bookingTime"] = targetTime.hours() * 100 + targetTime.minutes();
            this.queue.enqueueTicket(data);
            targetTime = targetTime.clone().add("m", 30);
        }
    }
});

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

