var React = require('react');

var MAHeader = React.createClass({

    propTypes: {
      topMessage: React.PropTypes.string.isRequired,
    },

    getInitialState: function () {
      var visible = "none";
      if ( this.props.topMessage != "" ) {
        visible = "block";
      }
      return {visible: visible};
    },

    render: function () {
        var topMessageStyle = {
          display: this.state.visible,
        };

        return (
            <div>
              <div style={topMessageStyle}>Message - {this.props.topMessage}</div>
              <div>Head</div>
            </div>
        );
    }
});

module.exports = MAHeader;
