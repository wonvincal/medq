/**
 * Created by Calvin on 2/15/2015.
 */
var React = require('react');

//this.props.start
//this.props.end
//
var HeatmapSlot =  React.createClass({
    render: function(){
        var timeDisplay = this.props.start.format(this.props.timeFormat);

        return (
            <div className="list-group-item heatmap-timeslot-group">
                <a href="#left" className="heatmap-cell heatmap-cell-arrived"></a>
                <a href="#left" className="heatmap-cell"></a>
                <div className="heatmap-timeslot-group-background-text">{timeDisplay}</div>
            </div>
        );
    }
});

module.exports = HeatmapSlot;