var React = require('react');

// Import components
var MAIcsForm = require('./icsform');
var MACentralIcs = require('./central-ics');
var MAUserStat = require('./userstat');
var MACentralStat = require('./central-stat');

var MAMain = React.createClass({

  propTypes: {
    meetingList: React.PropTypes.array.isRequired,
    updateMeetingList: React.PropTypes.func.isRequired,
    injectMeetingList: React.PropTypes.func.isRequired,
    sendMeetingInfo: React.PropTypes.func.isRequired,
    searchResults: React.PropTypes.array.isRequired,
    searchRange: React.PropTypes.string,
    searchUser: React.PropTypes.func.isRequired,
    loadCurrentSearchRange: React.PropTypes.func.isRequired,
    flushCurrentSearchRange: React.PropTypes.func.isRequired,
    getStatsWithCallback: React.PropTypes.func.isRequired
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
      centralDisplay = (
        <MACentralIcs
          meetingList={this.props.meetingList}
          sendMeetingInfo={this.props.sendMeetingInfo}
          updateMeetingList={this.props.updateMeetingList}
          injectMeetingList={this.props.injectMeetingList}
          searchResults={this.props.searchResults}
          searchUser={this.props.searchUser}
        />);
    } else if (centralPanel == 1) {
      centralDisplay = (
        <MACentralStat
          searchResults={this.props.searchResults}
          searchUser={this.props.searchUser}
          searchRange={this.props.searchRange}
          loadCurrentSearchRange={this.props.loadCurrentSearchRange}
          flushCurrentSearchRange={this.props.flushCurrentSearchRange}
          getStatsWithCallback={this.props.getStatsWithCallback}
        />);
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
            <li><MAUserStat updateCentralPanel={this.updateCentralPanel}/></li>
            <li>Icon3</li>
          </ul>
          {centralDisplay}
        </div>
    );
  }
});

module.exports = MAMain;
