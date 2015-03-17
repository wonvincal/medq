/*
 * Component for display a Planner section
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var PlannerSectionStore = require('../stores/PlannerSectionStore');
var CalendarSection = require('../components/CalendarSection.react');
var Planner = require('../components/Planner.react');
var AppConstant = require('../constants/AppConstant');

function getState() {
    return {};
}

var PlannerSection = React.createClass({
    getInitialState: function(){
        return getState();
    },
    componentDidMount: function(){
        PlannerSectionStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
        PlannerSectionStore.removeChangeListener(this._onChange);
    },
    render: function () {
        return (
            <div>
                <div><CalendarSection /></div>
                <div><Planner /></div>
            </div>
        );
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = PlannerSection;