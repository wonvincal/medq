
/*
 * Copyright 2014 Calvin Wong.
 */
window.React = require('react');

//var log4js = require('log4js');
//log4js.configure('../log4js.json', { reloadSecs: 300});

// Retrieve Data From Server (use Mock Data for now)
var MedqsService = require('./utils/MedqsService');
var MedqsApp = require('./components/MedqsApp.react');

// --- Mock Call ---
// Load Mock Data into localStorage
var MedqsData = require('./MedqsData');
MedqsData.init();
// Load Mock API call
MedqsService.getQueues();

// --- Actual Call ---
// Check if there is anything we can find in the existing session
// Check if there is any router related information from the url; that is
// the user may be accessing this app with an url that specifies which queue
// to see

// Render App Controller View
React.render(
        <MedqsApp/>,
        document.getElementById('medqs-app'));