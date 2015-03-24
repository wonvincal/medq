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
var moment = require('moment');
var EntityState = require('./constants/EntityState');
var CompanyModel = require('./models/CompanyModel');
var company = new CompanyModel();
company.id = 200;
company.version = 0;
company.name = "Dr. Lee Clinic 5";
company.state = EntityState.ACTIVE;
company.officeHours = [
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 0 - Sunday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 1 - Monday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 2 - Tuesday */,
    [
        [
            moment({ hour: 0, minute: 0}),
            moment({ hour: 9, minute: 0})
        ],
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 3 - Wednesday */,
    [
        [
            moment({ hour: 0, minute: 0}),
            moment({ hour: 9, minute: 0})
        ],
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 4 - Thursday */,
    [
        [
            moment({ hour: 0, minute: 0}),
            moment({ hour: 9, minute: 0})
        ],
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 5 - Friday */,
    [
        [
            moment({ hour: 0, minute: 0}),
            moment({ hour: 9, minute: 0})
        ],
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ],
        [
            moment({ hour: 18, minute: 0}),
            moment({ hour: 23, minute: 59})
        ]
    ] /* 6 - Saturday */
];

var WorkerModel = require('./models/WorkerModel');
var worker = new WorkerModel();
worker.id = 300;
worker.version = 0;
worker.state = EntityState.ACTIVE;
worker.lastName = "Lee";
worker.firstName = "Bruce";
worker.phone = "23211212";
worker.email = "bruce.lee@gmail.com";
worker.timePerSlotInMin = 15;
worker.aptPerSlot = 2;
worker.company = company;

console.log(worker);
console.log(JSON.stringify(worker));

var QueueModel = require('./models/QueueModel');
var queue = new QueueModel();
queue.id = 100;
queue.version = 0;
queue.state = EntityState.ACTIVE;
queue.name = "Consultation";
queue.nextTicketDisplayId = "C001";
queue.workers =  [ worker ];
queue.company = company;

console.log(queue);
console.log(JSON.stringify(queue));

module.exports = {
    init: function(){
        localStorage.clear();
        localStorage.setItem('queues', JSON.stringify([
            queue
        ]));
        localStorage.setItem('companies', JSON.stringify([
            company
        ]));
        localStorage.setItem('workers', JSON.stringify([
            worker
        ]));
        localStorage.setItem('apts', JSON.stringify([]));
    }
};

