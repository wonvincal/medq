/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * This service communicates with server side to get latest data
 */
var MedqsActions = require('../actions/medqs.actions');

module.exports = {
    // Login: send credentials to server, return:
    // 1) accounts
    // 2) settings
    // 3) queues
    // 4) schedules
    login: function(username, password){
        var data = JSON.parse(localStorage.getItem('session'));
        // Store into session
        // MedqsActions.receiveQueues(data.queues);
        // MedqsActions.receiveSchedules(data.schedules);
    },
    // Return session if available
    getSession: function(){
        var data = JSON.parse(localStorage.getItem('session'));
        // Store into session

        // Make JSON call to get queues (a bit more complicated once we get into snapshot vs updates
        // MedqsActions.receiveQueues(data.queues);
        // Make JSON call to get schedules (a bit more complicated once we get into snapshot vs updates
        // MedqsActions.receiveSchedules(data.schedules);
    },
    // Load mock data from localStorage into Stores via Action
    // Need to think carefully on the actually name of the method call
    getQueues: function(){
        // getSession

        var data = JSON.parse(localStorage.getItem('queues'));
        MedqsActions.receiveQueues(data);

        // repeats once every 10 seconds
    },
    getSchedules: function(){
        // getSession

        var data = JSON.parse(localStorage.getItem('schedules'));
        MedqsActions.receiveSchedules(data);

        // repeats once every 10 seconds
    },

    // Get accounts information after log in
    getAccounts: function(){
    },
    getReportSpecs: function(){
    },
    addTicket: function(){

    },
    removeTicket: function(){

    },
    changeTicket: function(){

    }


};

// Entry points to the application
// 1) www.medqs.com
//    check session
//      if the person has not logged in, show "website browsing" view with "Login" button
//      if the person has logged in, show "real-time updates" view, similar to Facebook
// 2) direct link to a specific queue: www.medqs.com/queue/18271
//    check session
//      if the person has not logged in, show "real-time updates" view with "Login" button
//        put this queue into session
//        updates will be limited to "public" credentials only
//      if the person has logged in, show "real-time updates" view, similar to Facebook
// 3) direct link to something not appropriate: www.medqs.com/account/123
//    redirect back to www.medqs.com
//
//
//