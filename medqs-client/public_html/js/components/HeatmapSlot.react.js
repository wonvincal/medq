/**
 * Created by Calvin on 2/15/2015.
 */
var React = require('react');
var AppActionCreator = require('../actions/AppActionCreator');
var TicketStatus = require('../constants/TicketStatus');

var HeatmapSlot =  React.createClass({
    handleLinkClick: function (i, item) {
        console.log("HeatmapSlot:handleLinkClick: enter");
        AppActionCreator.selectTicket(this.props.items[i].entity);
    },
    render: function () {
        var timeDisplay = this.props.start.format(this.props.timeFormat);
        var links = null;
        if (this.props.items.length <= 0) {
            links = <span href="" className="heatmap-cell"></span>;
        }
        else{
            links = this.props.items.map(function (item, i) {
                var style = TicketStatus.getString(item.entity.status).toLowerCase();
                style = 'heatmap-cell heatmap-cell-' + style;
                return (<a className={style} key={i} onClick={this.handleLinkClick.bind(this, i)}></a>);
            }, this);
        }
        return (<div className="list-group-item heatmap-timeslot-group">
                    {links}
                    <div className="heatmap-timeslot-group-background-text">{timeDisplay}</div>
                </div>);
    }
});
module.exports = HeatmapSlot;