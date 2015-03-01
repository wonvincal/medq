/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var React = require('react');
var HeatmapStore = require('../stores/HeatmapStore');
var HeatmapSlot = require('./HeatmapSlot.react');

function getState(){
    return {
        asOf: HeatmapStore.getAsOf(),
        slots : HeatmapStore.getHeatmapSlots(),
        timeFormat : HeatmapStore.getTimeFormat()
    };
}

var Heatmap = React.createClass({
    getInitialState: function(){
        return getState();
    },
    componentDidMount: function(){
        HeatmapStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
        HeatmapStore.removeChangeListener(this._onChange);
    },
    render: function(){
        if (this.state.asOf === null || this.state.slots.length <= 0){
            return (<div>No date has been selected</div>);
        }
        var timeFormat = this.state.timeFormat;
        var slotsView =
            <div className="heatmap-section">{
                this.state.slots.map(function (slot, index) {
                    return (<HeatmapSlot key={index} start={slot.start} end={slot.end} timeFormat={timeFormat} items={slot.items} />);
                })
                }
            </div>;
        return (<div>{slotsView}</div>);
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = Heatmap;
