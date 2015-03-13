/**
 * Created by Calvin on 11/30/2014.
 */
var React = require('react');
var ViewActionCreator = require('../actions/ViewActionCreator');

var Header = React.createClass({
    getDefaultProps: function(){
        return {
            accountName: 'Default Prop - Account Name'
        };
    },
    handleQueueClick: function(){
        ViewActionCreator.clickQueueOnHeader();
    },
    handlePlannerClick: function(){
        ViewActionCreator.clickPlannerOnHeader();
    },
    handleReportClick: function(){
        ViewActionCreator.clickReportOnHeader();
    },
    /** Collect the nav links, forms, and other content for toggling */
    render: function(){
        return (
            <nav className="navbar navbar-default" role="navigation">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-section">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand" href="#">Brand</a>
                    <div className="navbar-brand">{ this.props.accountName }</div>
                </div>
                <div className="collapse navbar-collapse" id="navbar-collapse-section">
                    <ul className="nav navbar-nav">
                        <li className="active"><a onClick={this.handleQueueClick}><i className="glyphicon glyphicon-user"></i> Queue <span className="sr-only">(current)</span></a></li>
                        <li><a onClick={this.handlePlannerClick}><i className="glyphicon glyphicon-calendar"></i> Planner</a></li>
                        <li><a onClick={this.handleReportClick}><i className="glyphicon glyphicon-stats"></i> Report</a></li>
                    </ul>
                    <form className="navbar-form navbar-right" role="search">
                        <div className="form-search search-only">
                            <i className="search-icon glyphicon glyphicon-search"></i>
                            <input type="text" className="form-control search-query" placeholder="Search" />
                        </div>
                    </form>
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="#">10:11 Monday 15 Sep, 2014</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
});

module.exports = Header;