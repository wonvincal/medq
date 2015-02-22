Install latest npm modules
1. cd C:\wongca\dev\projects\medqs-client\public_html
2. npm install

Look at what modules we need in this project
1. see package.json

Run script
1. npm run { scripts in package.json }

Run watchify - this watchify takes browserify's parameter (transform with reactify) as well
1. npm run watch

Production Build - shorten with uglify
1. npm run build


We are getting the Date and Time Picker here
https://github.com/Eonasdan/bootstrap-datetimepicker/wiki/Installation

    1. Got moment.min.js from http://momentjs.com/
    2. Save it to C:\wongca\dev\projects\medqs-client\public_html\js

Follow these procedure to add jest to the project
https://facebook.github.io/jest/

LocalStorage
============
- Username
- Password (keep logged in?)

SessionStorage
==============
- Session variable (token)
- Anything that is required to perform only once per login

In Memory
=========
- Tickets
- Queues
- Appointments

Naming
======
[Section] - A smart section in the app
[] - A component
[List] - A list of items in a summarized format
[ListItem] - A component in an list item format
Queue - A main component
QueueSection - A smart section in the app
QueueList - A list of components, usually in a tabular format
QueueListItem - An item in the list
Ticket - A ticket
SchedulingSection
CalendarSection
Calendar
Planner
TicketAptEditor
Header
AppWorkspace
WebWorkspace

Should Employee have reference to Company?
When do i need to know which company a Employee work for?

When an Employee goes out alone, he needs a business card.
Two employees of different companies can have the same id, so either:
1. i have an unique id for all employees in the world (HKID)
2. i always know send the company with any update to an employee

How to tell if an object has been deleted (or removed)
1. Queue: removed (archived)
2. Ticket: removed (cancelled, completed)
    i.   Disappear from Queue
    ii.  Remove from entity provider
    iii. Provide a way to clean up
    iv.  Provide a way to query cancelled or completed tickets
3. Apt: removed (cancelled)
    i.   Disappear from Schedule
    ii.  Remove from entity provider
    iii. Provide a way to clean up
    iv.  Provide a way to query cancelled or completed apts
4. Schedule: removed (archived)


API needs to check each input parameter
Internal methods - no need to check input parameters
1. Need to safe guard all the methods that processes data return from AppServiceMock
    include: EntityProvider(s)
2. if a property is not defined, return false.  if map[property] is not defined or null, return false