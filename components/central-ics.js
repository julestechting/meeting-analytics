var React = require('react');

var MACentralICS = React.createClass({

  propTypes: {
    meetingList: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {numDisplay: -1};
  },

  displayMeeting: function () {
    if ( this.state.numDisplay > -1 ) {
      const meeting = this.props.meetingList[this.state.numDisplay];
      return (
        <ul>
          <li>Organizer: {meeting.organizer.cn} ({meeting.organizer.mail})</li>
          <li>Subject: {meeting.summary}</li>
          <li>Date: {meeting.date}</li>
          <li>Location: {meeting.location}</li>
          {meeting.attendees.map(function (attendee, idx) {
            return (<li>Attendee: {attendee.name} ({attendee.mail})</li>);
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
    const self = this;
    if ( meetingList.length > 0 ) {
      return (
        <form>
          {meetingList.map(function(meeting, idx) {
              return (
                <label key={idx}>
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

module.exports = MACentralICS;
