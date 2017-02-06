var React = require('react');
var MAIcsForm = require('./icsform');
var MACentralIcs = require('./central-ics');
var MAUserStat = require('./userstat');

var MAMain = React.createClass({

  propTypes: {
    meetingList: React.PropTypes.array.isRequired,
    updateMeetingList: React.PropTypes.func.isRequired,
    sendMeetingInfo: React.PropTypes.func.isRequired,
    updateTopMessage: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      centralPanel: -1,
    };
  },

  updateCentralPanel: function (val) {
    this.setState({centralPanel: val});
  },

  render: function () {

    const centralPanel = this.state.centralPanel;
    let centralDisplay = null;
    if (centralPanel == 0) {
      centralDisplay = (<MACentralIcs meetingList={this.props.meetingList} sendMeetingInfo={this.props.sendMeetingInfo}/>);
    } else {
      //Change to put icons
      centralDisplay = (
        <div>
          <p>Select one function</p>
        </div>
      );
    }

    return (
        <div>
          <ul>
            <li><MAIcsForm updateMeetingList={this.props.updateMeetingList} updateCentralPanel={this.updateCentralPanel}/></li>
            <li><MAUserStat /></li>
            <li>Icon3</li>
          </ul>
          {centralDisplay}
        </div>
    );
  }
});

module.exports = MAMain;
