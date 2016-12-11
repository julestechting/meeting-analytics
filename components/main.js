var React = require('react');
var MAIcsForm = require('./icsform');

var MAMain = React.createClass({

  propTypes: {
    updateTopMessageHandler: React.PropTypes.func.isRequired,
    docURL: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {meetingList: []};
  },

  updateMeetingList: function (array) {
    this.setState({meetingList: array});
  },

  render: function () {
    // In the future, use React.route to define which form type to use - for now, only ics is
    return (
        <div>
          <ul>
            <li><MAIcsForm updateMeetingList={this.updateMeetingList} updateTopMessageHandler={this.props.updateTopMessageHandler} docURL={this.props.docURL}/></li>
            <li>Icon2</li>
            <li>Icon3</li>
          </ul>
          <div>Hello</div>
        </div>
    );
  }
});

module.exports = MAMain;
