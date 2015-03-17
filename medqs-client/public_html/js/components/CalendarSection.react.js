/*
 * Copyright 2015 Calvin Wong.
 *
 * Shows the following
 * 1. Holidays (derived from public calendar)
 * 2. Working Days (derived from company calendar)
 * 3. The next possible apt on weekend
 * 4. The next possible apt on weeknight
 * 5. The next ...
 *
 * A calendar belongs to a specific worker
 * If no worker is chosen, display according to all apts of the company
 *
 * Listen to
 * - SELECT_WORKER
 * - RECEIVE_APT_RECOMMENDATIONS
 * - PREV_MONTH
 * - NEXT_MONTH
 *
 * Action
 * - Request for more apt recommendations
 * - Select a particular date and update the Heatmap and Planner sections
 *
 */
var React = require('react');
var Calendar = require('react-calendar-component').Calendar;

function onDatePicked(date) {
    alert(date);
}

var CalendarSection = React.createClass({
    render: function () {
        return (
            <div><Calendar showDaysOfWeek={true}
                forceSixRows={false}
                onPickDate={onDatePicked} /></div>
        );
    }
});

module.exports = CalendarSection;