var React = require('react');

var MAHeader = React.createClass({

    propTypes: {
      topMessage: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
    },

    render: function () {
        /*
        var visible = "none";
        if ( this.props.topMessage != "" ) {
          visible = "block";
        }
        var topMessageStyle = {
          display: visible,
        };
        */
        return (
            <div>
              <div>
                {this.props.topMessage != "" && this.props.topMessage}
              </div>
              <div>
                <ul>
                  <li><a href="/">{this.props.title}</a></li>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/preferences">Preferences</a></li>
                </ul>
              </div>
            </div>
        );
    }
});

module.exports = MAHeader;
