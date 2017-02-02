var React = require('react');
var MAIcsForm = require('./icsform');
var MACentralIcs = require('./central-ics');
var MAUserStat = require('./userstat');

var MAMain = React.createClass({

  propTypes: {
    docURL: React.PropTypes.string.isRequired,
    connectId: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    updateTopMessage: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      meetingList: [],
      centralPanel: -1,
    };
  },

  updateMeetingList: function (array) {
    this.setState({meetingList: array});
  },

  updateCentralPanel: function (val) {
    this.setState({centralPanel: val});
  },

  render: function () {

    const centralPanel = this.state.centralPanel;
    let centralDisplay = null;
    if (centralPanel == 0) {
      centralDisplay = (<MACentralIcs meetingList={this.state.meetingList} connectId={this.props.connectId}/>);
    } else {
      centralDisplay = (
        <div>
          <h2>Welcome to {this.props.title}</h2>
          <p>Select one function</p>
        </div>
      );
    }

    return (
        <div>
          <ul>
            <li><MAIcsForm updateMeetingList={this.updateMeetingList} updateCentralPanel={this.updateCentralPanel} updateTopMessage={this.props.updateTopMessage} docURL={this.props.docURL}/></li>
            <li><MAUserStat /></li>
            <li>Icon3</li>
          </ul>
          {centralDisplay}
        </div>
    );
  }
});

module.exports = MAMain;
