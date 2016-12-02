var React = require('react');
var MAIcsForm = require('./icsform');

var MAMain = React.createClass({

  propTypes: {
    updateTopMessageHandler: React.PropTypes.func.isRequired,
  },

  getInitialState: function () {
    return {icsFile: ""};
  },

  updateIcsFile: function (array) {
    this.setState({icsFile: array});
  },

  render: function () {
    // In the future, use React.route to define which form type to use - for now, only ics is
    return (
        <div>
          <ul>
            <li><MAIcsForm updateIcsFile={this.updateIcsFile}/></li>
            <li>Icon2</li>
            <li>Icon3</li>
          </ul>
          <div>{this.state.icsFile}</div>
        </div>
    );
  }
});

module.exports = MAMain;
