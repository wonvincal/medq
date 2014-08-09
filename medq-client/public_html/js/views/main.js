/* 
 * Main view of the application
 * This needs to be structured in a way such that we can adapt to
 * multi-queue-design easily in the future
 * 
 * Header: Clinic Info
 * Body-Left: Single Queue View or Multi Queue View
 * Body-Middle: Operations - all kinds of buttons, link up with Queue View
 * Body-Right: Panel for individual operation details - Queue specific or doesn't matter
 *             These buttons should be linked
 * Bottom-Left: Alert from Single Queue View
 * 
 */
var app = app || {};

app.MainView = Backbone.View.extend({

    el: '#action-panel',

    importFileTemplate: _.template($('#import-file-template').html()),
    
    settingsTemplate: _.template($('#settings-template').html()),
    
    // Initialize different views
    initialize:function (options) {
        this.queue = options.queue;
        $('#queue-alert').html(new app.QueueAlertView({model: this.queue}).render().el);
        $('#queue-summary').html(new app.QueueSummaryView({model: this.queue}).render().el);
        
        this.queueView = new app.QueueView({model: this.queue});
        $('#queue').html(this.queueView.el);
        this.queueView.on("selected", this.ticketSelected, this);
        this.setDisplayTime();
        setInterval(this.setDisplayTime, 1000);
    },

    events: {
        'click #add': 'showAddPanel',
        'click #modify': 'showModifyPanel',
        'click #import': 'showImportPanel',
        'click #settings': 'showSettingsPanel',
        'click #next': 'next'
    },
    
    next: function(){
        this.queueView.next();
    },
    
    ticketSelected: function(item){
        this.selectedTicket = item;
    },
    
    detailsViews: null,
    
    showAddPanel: function() {
        var view = new app.TicketDetailsView({collection: this.queue.get('tickets')});
        $('#action-form').empty();
        $('#action-form').append(view.render().el);
        $('#action-form').panel("open");        
        if (this.detailsViews)
        {
            this.detailsViews.close();
            this.detailsViews = null;
        }
        this.detailsViews = view;
    },

    showModifyPanel: function() {
        //var params = {el: $('#action-form').get(0), collection: this.queue.get('tickets')};
        var params = {collection: this.queue.get('tickets')};
        if (this.selectedTicket !== null)
        {
            params['model'] = this.queue.get("tickets").get({cid: this.selectedTicket});
        }
        var view = new app.TicketDetailsView(params);
        $('#action-form').empty();
        $('#action-form').append(view.render().el);
        $('#action-form').panel("open");
        if (this.detailsViews)
        {
            this.detailsViews.close();
            this.detailsViews = null;
        }
        this.detailsViews = view;
    },

    showImportPanel: function() {
        this.showActionForm(this.importFileTemplate);
    },

    showSettingsPanel: function() {
        this.showActionForm(this.settingsTemplate);
    },

    showActionForm: function(formEl){
        $('#action-form').html(formEl);
        $('#action-form').panel("open");
    },
    
    setDisplayTime: function(){
        var now = new Date();
        var desc = now.toDateString() + " " + now.toLocaleTimeString();
        $('#queueHeader').html(desc);
    }
    
});