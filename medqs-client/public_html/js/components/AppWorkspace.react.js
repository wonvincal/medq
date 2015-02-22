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
                            <QueueSection />
                            <Info />
                        </div>
                        <div className="col-md-2">
                            <Heatmap />
                        </div>
                        <div className="col-md-2">
                            <TicketAptEditorSection />
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    _onChange: function(){
        this.setState(getAppState());
    }
});

module.exports = AppWorkspace;