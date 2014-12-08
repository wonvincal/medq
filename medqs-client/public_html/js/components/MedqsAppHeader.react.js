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
    render: function(){
        return (
            <nav className="navbar-wrapper navbar-default navbar-fixed-top" role="navigation">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">{ this.props.accountName }</a>
                    </div>
                    <div className="collapse navbar-collapse">
                        <form className="navbar-form navbar-right" role="search">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Search" />
                            </div>
                            <button type="submit" className="btn btn-default">Submit</button>
                        </form>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="active"><a href="#"><span className="glyphicon glyphicon-home"></span> Queues</a></li>
                            <li><a href="#"><span className="glyphicon glyphicon-star"></span> Schedule</a></li>
                            <li><a href="#"><span className="glyphicon glyphicon-asterisk"></span> Reports</a></li>
                            <li><a href="#"><span className="glyphicon"></span> Time/Date</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

module.exports = MedqsAppHeader;