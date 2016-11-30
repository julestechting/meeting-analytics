var React = require('react');

var MAMain = React.createClass({

    propTypes: {
      updateTopMessageHandler: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
      return {icsFile: ""};
    },

    selectIcs: function(event) {
      this.setState({icsFile: event.target});
      event.preventDefault();
    },

    submitIcs: function(event) {
      event.preventDefault();
    },

    transferClick: function(event) {
      this.refs.fileRef.click();
    },

    render: function () {
        var invisibleStyle = {
          display: 'none',
        };

        return (
            <form onSubmit={this.submitIcs}>
              <input type="image" name="input-img" src="img/logo.png" onClick={this.transferClick} /><br />
              <input type="file" ref="fileRef" accept="text/calendar" onChange={this.selectIcs} style={invisibleStyle} />
            </form>
        );
    }
});

module.exports = MAMain;
