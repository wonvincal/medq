/*
 * Starting point of the application
 * Copyright 2014 Calvin Wong.
 */
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var DefaultRoute = Router.DefaultRoute;

// Note: seems to have all kinds of issues if we use log4js with Browserify
//var log4js = require('log4js');
//log4js.replaceConsole();
//log4js.configure('../../../../log4js.json', { reloadSecs: 300});
//var logger = log4js.getLogger();
console.log("app - start");

// Retrieve Data From Server (use Mock Data for now)
//var AppService = require('./utils/AppService.js');
var AppActionCreator = require('./actions/AppActionCreator');
var Header = require('./components/Header.react');
var AppWorkspace = require('./components/AppWorkspace.react');
var WebWorkspace = require('./components/WebWorkspace.react');

// --- Actual Call ---
// Check if there is anything we can find in the existing session
// Check if there is any router related information from the url; that is
// the user may be accessing this app with an url that specifies which queue
// to see

//logger.info("app - generate route");
var App = React.createClass({
    render: function(){
        return (
            <div>
                <Header/>
                <RouteHandler/>
            </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="queue" handler={AppWorkspace}/>
        <DefaultRoute handler={AppWorkspace}/>
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.getElementById('app'));
});

// --- Mock Call ---
// Load Mock Data into localStorage
var AppDataMock = require('./AppDataMock');
AppDataMock.init();
AppActionCreator.initMock();