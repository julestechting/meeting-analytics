var React = require('react');
var MAIcsForm = require('./icsform');
var MACentralICS = require('./central-ics');

var MAMain = React.createClass({

  propTypes: {
    updateTopMessageHandler: React.PropTypes.func.isRequired,
    docURL: React.PropTypes.string.isRequired,
    connect_id: React.PropTypes.string.isRequired
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
      centralDisplay = (<MACentralICS meetingList={this.state.meetingList} connect_id={this.props.connect_id}/>);
    } else {
      centralDisplay = (
        <div>
          <h2>Welcome to Behaviour Analytics</h2>
          <p>Select one function</p>
        </div>
      );
    }

    return (
        <div>
          <ul>
            <li><MAIcsForm updateMeetingList={this.updateMeetingList} updateCentralPanel={this.updateCentralPanel} updateTopMessageHandler={this.props.updateTopMessageHandler} docURL={this.props.docURL}/></li>
            <li>Icon2</li>
            <li>Icon3</li>
          </ul>
          {centralDisplay}
        </div>
    );
  }
});

module.exports = MAMain;
