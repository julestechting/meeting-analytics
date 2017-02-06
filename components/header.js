var React = require('react');

var MAHeader = React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired
    },

    render: function () {
        return (
            <div>
              <ul>
                <li><a href="/">{this.props.title}</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/preferences">Preferences</a></li>
              </ul>
            </div>
        );
    }
});

module.exports = MAHeader;
