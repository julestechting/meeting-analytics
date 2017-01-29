var React = require('react');

var MACentralIcs = React.createClass({

  propTypes: {
    connectId: React.PropTypes.string.isRequired,
    meetingList: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      eIndex: "meeting",
      numDisplay: -1
    };
  },

  getLocalDate: function (dateStr) {
    return new Date(dateStr).toLocaleString();
  },

  handleChoice: function (event) {
    //var idx = parseInt(event.target.name);
    //alert("Name= " + event.target.name + " Value= " + event.target.value);
    //TODO
  },

  displayChoice: function (idx) {
    var idxStr = idx.toString();
    return (
      <form>
        <label key={idxStr + "0"}>Attend&On-Time<input type="radio" name={idx} value="0" onChange={this.handleChoice}/></label>
        <label key={idxStr + "1"}>Attend&Late<input type="radio" name={idx} value="1" onChange={this.handleChoice}/></label>
        <label key={idxStr + "2"}>No Attend<input type="radio" name={idx} value="2" onChange={this.handleChoice}/></label>
      </form>
    );
  },

  displayMeeting: function () {
    if ( this.state.numDisplay > -1 ) {
      const meeting = this.props.meetingList[this.state.numDisplay];
      var prefix = this.state.numDisplay.toString() + "m";
      var self = this;
      return (
        <ul>
          <li key={prefix+"0"}>Organizer: {meeting.organizer.cn} ({meeting.organizer.mail})</li>
          <li key={prefix+"1"}>Subject: {meeting.summary}</li>
          <li key={prefix+"2"}>Date: {this.getLocalDate(meeting.date)}</li>
          <li key={prefix+"3"}>Location: {meeting.location}</li>
          {meeting.attendees.map(function (attendee, idx) {
            var key = prefix + new String(4 + idx);
            return (
              <li key={key}>
                {attendee.role == "OPT-PARTICIPANT" && <i>(Optional)</i>} Attendee: {attendee.name} ({attendee.mail})
                {self.displayChoice(idx)}
              </li>);
          })}
        </ul>
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
