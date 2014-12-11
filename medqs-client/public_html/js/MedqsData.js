/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * There should be several Stores
 * 
 * QueueStore, ScheduleStore, PeopleStore
 * 
 * 1) Get some data back
 * 
 * On the server side, each Event/Change should be categorized as
 * 1) Public
 * 2) Entity Owner
 * 3) Entity Admin
 * 
 * If not login, can get the Public event
 * If login, can get more events
 * 
 * Notification is sent to Customers
 */
var QueueModel = require('./models/queue.model');
var TicketModel = require('./models/ticket.model');
var AppointmentModel = require('./models/appointment.model');

var queue1 = new QueueModel(1, 'Consultation');
var queue2 = new QueueModel(2, 'Medical/Bill');

var appt1 = new AppointmentModel(1);
var ticket1 = new TicketModel(1, appt1);
queue1.tickets.push(ticket1);
var appt2 = new AppointmentModel(2);
var ticket2 = new TicketModel(2, appt2);
queue1.tickets.push(ticket2);

console.log(queue1);
console.log(JSON.stringify(queue1));

module.exports = {
    init: function(){
        localStorage.clear();
        localStorage.setItem('schedules', JSON.stringify([
            {
                id: 1,
                name: 'Consultation Schedule',
                appointments:[
                    {
                        id: 3,
                        appointmentTime: '2014-12-01T09:30:00.000Z',
                        customers: [
                            {
                                cid: 1,
                                primaryNumber: '92679471',
                                email: 'calvin.kl.wong@gmail.com'                                    
                            }
                        ]
                    },
                    {
                        id: 4,
                        appointmentTime: '2014-12-02T09:30:00.000Z',
                        customers: [
                            {
                                cid: 1,
                                primaryNumber: '92679471',
                                email: 'calvin.kl.wong@gmail.com'                                    
                            }
                        ]
                    }
                ]
            } 
        ]));
        localStorage.setItem('account', JSON.stringify([
            {
                id: 1,
                address: '250 Tak Man St., Hung Hom'
            }
        ]));
        localStorage.setItem('queues', JSON.stringify([
            queue1,
            queue2
        ]));
        /*
        localStorage.setItem('queues', JSON.stringify([
            {
                id: 1,
                name: 'Consultation',
                algo: {
                    id: 1,
                    name: 'In Sequence',
                    description: 'In Sequence description',
                    fields: [
                        {
                            id: 1,
                            name: 'In Sequence Field 1',
                            type: 'boolean',
                            value: 'true'
                        },
                        {
                            id: 2,
                            name: 'In Sequence Field 2',
                            type: 'boolean',
                            value: 'false'
                        }
                    ]
                },
                tickets:[
                    {
                        id: 1,
                        state: 'REGISTERED',
                        arrivalTime: '2014-11-30T09:30:00.001Z',
                        estimatedTime: '2014-11-30T09:40:00.001Z',
                        appointment:{
                            id: 1,
                            appointmentTime: '2014-11-30T09:30:00.001Z',
                            watchers: [
                                {
                                    type: 'email',
                                    value: 'calvin.kl.wong@gmail.com'
                                },
                                {
                                    type: 'phone',
                                    value: '92679471'
                                }
                            ],
                            customer: [
                                {
                                    cid: 1,
                                    firstName: 'Calvin',
                                    lastName: 'Wong',
                                    primaryNumber: '92679471',
                                    email: 'calvin.kl.wong@gmail.com'
                                }
                            ],
                            details: {
                                note: ''
                            }
                        }
                    },
                    {
                        id: 2,
                        state: 'REGISTERED',
                        arrivalTime: '2014-11-30T09:31:00.001Z',
                        estimatedTime: '2014-11-30T09:50:00.001Z',
                        appointment:{
                            id: 2,
                            appointmentTime: '',
                            customers: [
                                {
                                    cid: 2,
                                    primaryNumber: '98467654',
                                    email: 'janicewm@yahoo.com'                                    
                                }
                            ],
                            details: {
                                note: ''
                            }
                        }
                    }
                ]
            },
            {
                id: 2,
                name: 'Bill',
                tickets:[
                    {
                        id: 3,
                        state: 'REGISTERED',
                        arrivalTime: '',
                        estimatedTime: '2014-11-30T09:40:00.001Z',
                        appointment: {}
                    },
                    {
                        id: 4,
                        state: 'REGISTERED',
                        arrivalTime: '',
                        estimatedTime: '2014-11-30T09:50:00.001Z',
                        appointment: {}
                    }
                ]            
            }
        ]));*/
    }
};

