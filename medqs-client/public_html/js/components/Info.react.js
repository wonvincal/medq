/*
 * Component for display an Information section
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var InfoStore = require('../stores/InfoStore');

function getState(){
    return {};
}

var Info = React.createClass({
    getInitialState: function () {
        return getState();
    },
    componentDidMount: function(){
        InfoStore.addChangeListener(this._onChange);
    },
    componentWillMount: function(){
        InfoStore.removeChangeListener(this._onChange);
    },
    render: function () {
        return (
            <div className="panel">
                <div className="panel-heading">Info</div>
                <div className="panel-body"></div>
            </div>
        );
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = Info;