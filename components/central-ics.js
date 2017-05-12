var React = require('react');

// Import components
var MAAutoComplete = require('./autocomplete');

var MACentralIcs = React.createClass({

  propTypes: {
    sendMeetingInfo: React.PropTypes.func.isRequired,
    updateMeetingList: React.PropTypes.func.isRequired,
    injectMeetingList: React.PropTypes.func.isRequired,
    meetingList: React.PropTypes.array.isRequired,
    searchResults: React.PropTypes.array.isRequired,
    searchUser: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      numDisplay: -1,
      addLineValue: "Add"
    };
  },

  componentWillUnmount: function () {
    this.props.updateMeetingList(null);
  },

  handleChoice: function (event) {
    var attendStatus = event.target.value;
    var indices = event.target.name.split("-");
    this.props.sendMeetingInfo(this.props.meetingList[indices[0]], indices[1], attendStatus);
  },

  resetNewLine: function() {
    this.setState({addLineValue: "Add"});
    this.props.searchUser("", 0);
  },

  handleNewLine: function (event) {
    if ( this.state.addLineValue == "Add" ) {
      this.setState({addLineValue: "Close"});
    } else {
      this.resetNewLine();
    }
  },

  addUser: function (uName, uMail) {
    const newAttendee = {
      name: uName,
      mail: uMail,
      role: "OPT-PARTICIPANT",
      accept: ""
    };
    this.props.injectMeetingList(this.state.numDisplay, newAttendee);
    this.resetNewLine();
  },

  handleSubmitNewLine: function (event) {
    event.preventDefault();
    const name = event.target[0].value;
    const mail = event.target[1].value;
    this.addUser(name, mail);
  },

  injectUser: function (event) {
    const targetUser = JSON.parse(event.target.value);
    // Add an attendee to the meeting
    this.addUser(targetUser.name, targetUser.mail);
  },

  handleAutoComplete: function (event) {
    this.props.searchUser(event.target.value, 5);
  },

  displayChoice: function (idx, numDisplayStr) {
    var idxStr = idx.toString();
    var name = numDisplayStr + "-" + idxStr;
    return (
      <form>
        <label key={idxStr + "0"}>Attend&On-Time<input type="radio" name={name} value="AOT" onChange={this.handleChoice}/></label>
        <label key={idxStr + "1"}>Attend&Late<input type="radio" name={name} value="AL" onChange={this.handleChoice}/></label>
        <label key={idxStr + "2"}>No Attend<input type="radio" name={name} value="NA" onChange={this.handleChoice}/></label>
        <label key={idxStr + "3"}>No Attend&Delegated<input type="radio" name={name} value="NAD" onChange={this.handleChoice}/></label>
      </form>
    );
  },

  displayMeeting: function () {
    if ( this.state.numDisplay > -1 ) {
      const meeting = this.props.meetingList[this.state.numDisplay];
      var prefix = this.state.numDisplay.toString() + "m";
      var self = this;
      // Function to convert to local date
      var getLocalDate = function (dateStr) {
        return new Date(dateStr).toLocaleString();
      };
      // Generate result
      return (
        <div>
          <ul>
            <li key={prefix+"0"}>Organizer: {meeting.organizer.cn} ({meeting.organizer.mail})</li>
            <li key={prefix+"1"}>Subject: {meeting.summary}</li>
            <li key={prefix+"2"}>Date: {getLocalDate(meeting.dateStart)}</li>
            <li key={prefix+"3"}>Location: {meeting.location}</li>
            {meeting.attendees.map(function (attendee, idx) {
              var key = prefix + new String(4 + idx);
              return (
                <li key={key}>
                  {attendee.role == "OPT-PARTICIPANT" && <i>(Optional)</i>} Attendee: {attendee.name} ({attendee.mail})
                  {self.displayChoice(idx, self.state.numDisplay.toString())}
                </li>);
            })}
          </ul>
          {self.state.addLineValue == "Close" &&
            <form onSubmit={this.handleSubmitNewLine}>
              <label>Name: <input type="text" name="newLineName" onChange={self.handleAutoComplete} required/></label>
              <label>Email: <input type="email" name="newLineMail" onChange={self.handleAutoComplete} required/></label>
              <input type="submit" value="Submit"/>
            </form>
          }
          <MAAutoComplete searchResults={this.props.searchResults} buttonCallback={this.injectUser} />
          <button name="addline" onClick={this.handleNewLine}>{this.state.addLineValue}</button>
        </div>
      );
    } else {
      return null;
    }
  },

  handleMeetingChanged: function (event) {
    this.setState({numDisplay: event.target.value});
  },

  displayHead: function () {
    const meetingList = this.props.meetingList;
    var self = this;
    if ( meetingList.length > 0 ) {
      return (
        <form>
          {meetingList.map(function(meeting, idx) {
              var key = "ml" + idx.toString();
              return (
                <label key={key}>
                  <input
                    name="radio"
                    type="radio"
                    value={idx}
                    onChange={self.handleMeetingChanged}
                  />
                  {meeting.summary}
                  <br/>
                </label>
              );
          })}
        </form>
      );
    } else {
      return null;
    }
  },

  render: function () {

    return (
      <div>
        {this.displayMeeting()}
        {this.displayHead()}
      </div>
    );
  }
});

module.exports = MACentralIcs;
