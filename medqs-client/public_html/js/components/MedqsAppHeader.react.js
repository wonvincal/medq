/**
 * Created by Calvin on 11/30/2014.
 */
var React = require('react');

/*<div>
    <div>-- Header Section --</div>
</div>*/
var MedqsAppHeader = React.createClass({
    getDefaultProps: function(){
        return {
            accountName: 'Default Prop - Account Name'
        };
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
                        <li className="active"><a href="#"><i className="glyphicon glyphicon-user"></i> Queue <span className="sr-only">(current)</span></a></li>
                        <li><a href="#"><i className="glyphicon glyphicon-calendar"></i> Planner</a></li>
                        <li><a href="#"><i className="glyphicon glyphicon-stats"></i> Report</a></li>
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

module.exports = MedqsAppHeader;