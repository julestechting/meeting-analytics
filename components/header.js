var React = require('react');

var MAHeader = React.createClass({

    propTypes: {
      title: React.PropTypes.string.isRequired,
      switchOpenParam: React.PropTypes.func.isRequired,
      eValidate: React.PropTypes.bool.isRequired
    },

    handleSettingsButton: function (event) {
      this.props.switchOpenParam();
    },

    render: function () {
        const invisibleLinkStyle = { "text-decoration": "none" };
        var disableBtns = ( this.props.eValidate ? null : "disabled" );

        // Login button is hidden until authentication feature is implemented
        return (
            <div className="w3-container w3-cyan">
              <div className="w3-twothird"><a href="/" style={invisibleLinkStyle}><h1 className="w3-text-white">{this.props.title}</h1></a></div>
              <div className="w3-table w3-third">
                <table className="w3-responsive">
                  <tr>
                    <td className="w3-hide"><button type="button" className="w3-button w3-blue w3-hover-indigo" disabled={disableBtns}>Login</button></td>
                    <td><button type="button" onClick={this.handleSettingsButton} className="w3-button w3-blue w3-hover-indigo" disabled={disableBtns}>Preferences</button></td>
                  </tr>
                </table>
              </div>
            </div>
        );
    }
});

module.exports = MAHeader;
