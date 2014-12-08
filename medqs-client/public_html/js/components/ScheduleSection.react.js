/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var React = require('react');
var Planner = require('./Planner.react');
var Calendar = require('./Calendar.react');

var ScheduleSection = React.createClass({
    render: function(){
        var schedule = this.props.schedule;

        return (
            <div className="schedule-section">-- Schedule Section --
                <Calendar />
                <Planner  />
            </div>
        );
    }
});

module.exports = ScheduleSection;

