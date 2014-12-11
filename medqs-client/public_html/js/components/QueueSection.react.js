/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var React = require('react');
var Queue = require('./queue.react.js');
//var MedqsActions = require('../actions/MedqsActions');

var QueueSection = React.createClass({
    render: function(){
        var queues = this.props.queues;
        console.log(queues);
        
        // This section should display general Queue Section info
        // It should also have the logic to render individual Queue
        // in a particular order and/or control whether a specific
        // queue should be visible
        return (                
            <div className="queue-section">{
                queues.map(function(queue, index){
                    console.log(queue.name + index);
                    console.log(queue.numWaiting);
                    return (
                            <Queue key={queue.id} queue={queue}/>
                        );
                    })
                }
            </div>
        );
    }
});

module.exports = QueueSection;

