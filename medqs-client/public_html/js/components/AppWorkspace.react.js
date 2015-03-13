/* 
 * Controller-View for QueueSection, TicketAptEditor...etc
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var React = require('react');
var QueueSection = require('./QueueSection.react.js');
var Heatmap = require('./Heatmap.react');
var AppWorkspaceStore = require('../Stores/AppWorkspaceStore');
var TicketAptEditorSection = require('./TicketAptEditorSection.react');
var Info = require('./Info.react');

function getState(){
    return {
        isQueueSectionVisible: AppWorkspaceStore.isQueueSectionVisible(),
        isInfoVisible: AppWorkspaceStore.isInfoVisible(),
        isPlannerSectionVisible: AppWorkspaceStore.isPlannerSectionVisible(),
        isHeatmapVisible: AppWorkspaceStore.isHeatmapVisible(),
        isTicketAptEditorSectionVisible: AppWorkspaceStore.isTicketAptEditorSectionVisible()
    };
}

var AppWorkspace = React.createClass({
    getInitialState: function(){
        return getState();
    },
    componentDidMount: function(){
        AppWorkspaceStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
        AppWorkspaceStore.removeChangeListener(this._onChange);
    },
    render: function() {
        return (
            <div className="container-fluid medqs-app">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            {(this.state.isQueueSectionVisible) ? <QueueSection /> : null }
                            {(this.state.isInfoVisible) ? <Info /> : null }
                            {(this.state.isPlannerSectionVisible) ? <Info /> : null }
                        </div>
                        <div className="col-md-2">
                            {(this.state.isHeatmapVisible) ? <Heatmap /> : null }
                        </div>
                        <div className="col-md-2">
                            {(this.state.isTicketAptEditorSectionVisible) ? <TicketAptEditorSection /> : null }
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = AppWorkspace;