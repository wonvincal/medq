/**
 * Created by Calvin on 2/2/2015.
 */
var React = require('react');
var TicketAptEditorSectionStore = require('../stores/TicketAptEditorSectionStore');
var TicketAptEditor = require('./TicketAptEditor.react');
var AppConstant = require('../constants/AppConstant');

function getState(){
    return {
        queueForAdd: TicketAptEditorSectionStore.getQueueForAdd(),
        ticketForAdd: TicketAptEditorSectionStore.getTicketForAdd(),
        queueForEdit: TicketAptEditorSectionStore.getQueueForEdit(),
        ticketForEdit: TicketAptEditorSectionStore.getTicketForEdit(),
        isTicketForEditDirty: TicketAptEditorSectionStore.isTicketForEditDirty()
        // workerForApt: TicketAptEditorSectionStore.getWorkerForApt()
        //scheduleForApt: TicketAptEditorSectionStore.getScheduleForApt()
    };
}

var TicketAptEditorSection = React.createClass({
    getInitialState: function(){
        return getState();
    },
    componentDidMount: function(){
        TicketAptEditorSectionStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
        TicketAptEditorSectionStore.removeChangeListener(this._onChange);
    },
    render: function(){
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li role="presentation" className="active"><a data-toggle="tab" href="#Add">Add</a></li>
                    <li role="presentation"><a data-toggle="tab" href="#Edit">Edit</a></li>
                </ul>
                <div className="tab-content">
                    <div id="Add" className="tab-pane fade in active">
                        <TicketAptEditor mode={AppConstant.MODE_ADD} queue={this.state.queueForAdd} ticket={this.state.ticketForAdd} />
                    </div>
                    <div id="Edit" className="tab-pane fade">
                        <TicketAptEditor mode={AppConstant.MODE_EDIT} queue={this.state.queueForEdit} ticket={this.state.ticketForEdit} dirty={this.state.isTicketForEditDirty} />
                    </div>
                </div>
            </div>
        );
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = TicketAptEditorSection;