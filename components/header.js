var React = require('react');

var MAHeader = React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired,
      updateOpenParam: React.PropTypes.func.isRequired
    },

    handleSettingsButton: function (event) {
      this.props.updateOpenParam(true);
    },

    render: function () {
        return (
            <div>
              <ul>
                <li><a href="/">{this.props.title}</a></li>
                <li><button type="button">Login</button></li>
                <li><button type="button" onClick={this.handleSettingsButton}>Preferences</button></li>
              </ul>
            </div>
        );
    }
});

module.exports = MAHeader;
