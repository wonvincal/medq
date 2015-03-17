/* 
 * Copyright 2014 Calvin Wong.
 *
 * Shows appointments in a day on tabular form
 *
 * Listen to
 * - SELECT_APT_DISPLAY_DATE
 * - RECEIVE_APTS
 *
 * Note
 * - This can be made as part of a week planner
 *
 */
var React = require('react');
var PlannerSectionStore = require('../stores/PlannerSectionStore');

function getState(){
    return {
        apts: PlannerSectionStore.getAptsForPlanner()
    };
}

var Planner = React.createClass({
    componentDidMount: function(){
        PlannerSectionStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
        PlannerSectionStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return (
            <div className="schedule-section">
                <div><textarea className="form-control" defaultValue="Notes"></textarea></div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Appointment
                        <a>Morning</a>|
                        <a>Afternoon</a>|
                        <a>Evening</a>
                    </div>
                    <div className="panel-body">
                        <div className="list-group-item planner-timeslot-row">
                            <a className="planner-timeslot-time-cell">10:00</a>
                            <a className="planner-timeslot-appointment-cell">Calvin Wong</a>
                            <a className="planner-timeslot-appointment-cell">Asia Wong</a>
                        </div>
                        <div className="list-group-item planner-timeslot-row">
                            <a className="planner-timeslot-time-cell">10:15</a>
                            <a className="planner-timeslot-appointment-cell">Patient-1</a>
                            <a className="planner-timeslot-appointment-cell">Patient-2</a>
                            <a className="planner-timeslot-appointment-cell">Patient-3</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = Planner;