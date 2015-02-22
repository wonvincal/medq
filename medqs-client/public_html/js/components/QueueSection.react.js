/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var React = require('react');
var Queue = require('./Queue.react.js');
var QueueSectionStore = require('../stores/QueueSectionStore');

function getState(){
    return {
        queues: QueueSectionStore.getQueues(),
        selectedQueue: QueueSectionStore.getSelectedQueue()
    };
}

var QueueSection = React.createClass({
    // Get initial state from stores
    getInitialState: function(){
        return getState();
    },
    // Add change listeners to stores
    componentDidMount: function(){
        QueueSectionStore.addChangeListener(this._onChange);
    },
    //Remove change listeners from stores
    componentWillUnmount: function(){
        QueueSectionStore.removeChangeListener(this._onChange);
    },
    render: function(){
        var queues = this.state.queues;
        var queuesView;
        if (typeof queues !== 'undefined' && queues.length > 0){
            console.log(queues);
            var self = this;
            queuesView =
                <div className="queue-section">{
                    queues.map(function(queue, index){
                        console.log(queue.name + index);
                        console.log(queue.numWaiting);
                        var isSelected = false;
                        if (self.state.selectedQueue != null && self.state.selectedQueue.id == queue.id){
                            isSelected = true;
                        }
                        return (
                            <Queue key={queue.id} queue={queue} isSelected={isSelected}/>
                        );
                    })
                }
                </div>;
        }
        else{
            console.log("No queue");
            queuesView = <div className="queue-section"></div>;
        }

        // This section should display general Queue Section info
        // It should also have the logic to render individual Queue
        // in a particular order and/or control whether a specific
        // queue should be visible
        return (<div>{queuesView}</div>);
    },
    _onChange: function(){
        this.setState(getState());
    }
});

module.exports = QueueSection;