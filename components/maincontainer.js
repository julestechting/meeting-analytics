var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

var MAMain = require('./main');

var MAMainCont = React.createClass({

  propTypes: {
    docURL: React.PropTypes.string.isRequired,
    connectId: React.PropTypes.string.isRequired,
    indices: React.PropTypes.object.isRequired,
    owner: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      meetingList: []
    };
  },

  updateMeetingList: function (file) {
    //Use API to parse file and return the meetingList structure
    if ( file != null ) {
      if (file.size > 0 && file.type.match('text/*')) {
        var self = this;
        var reader = new FileReader();
        reader.onload = function (upload) {
          var dataURL = upload.target.result;
          try {
            var mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];
            if (mimeType.search("VCALENDAR") != -1) {
              fetch(self.props.docURL + 'api/ics', {
                method: 'POST',
                headers: {'Content-Type': 'text/plain'},
                body: dataURL})
                 .then(function (res) {
                   return res.json().then(function (mL) {
                     self.setState({meetingList: mL});
                   })
                 });
            }
          }
          catch (err) {
             // Send alert message (file.name + " does not meet iCalendar format")
          }
        };
        reader.readAsText(file);
      } else {
        // Send alert message (file.name + " does not meet iCalendar format")
      }
    } else {
      this.setState({meetingList: []});
    }
  },

  sendMeetingInfo: function (meeting, attendeeIdx, attendStatus) {
    var self = this;
    // Connect to elasticsearch
    var client = new elasticsearch.Client({host: this.props.connectId, log: 'error'});

    // Search if record already exists
    // A record should be unique by its five fields: owner, subject.raw, organizerMail, attendeeMail and start
    client.search ({
      index: self.props.indices.attendance,
      body: {
        query: {
          bool: {
            must: [
              {match: {owner: self.props.owner}},
              {match: {"subject.raw": meeting.summary}},
              {match: {organizerMail: meeting.organizer.mail}},
              {match: {attendeeMail: meeting.attendees[attendeeIdx].mail}},
              {match: {start: meeting.dateStart}}
            ]
          }
        }
      }},
      function (err, res, status) {
        if ( !err ) {
          if ( res.hits.total == 0 ) {
            // New record to create
            client.index ({
              index: self.props.indices.attendance,
              type: self.props.indices.attendanceType,
              body: {
                owner: self.props.owner,
                attendeeName: meeting.attendees[attendeeIdx].name,
                attendeeMail: meeting.attendees[attendeeIdx].mail,
                role: meeting.attendees[attendeeIdx].role,
                status: attendStatus,
                organizerName: meeting.organizer.cn,
                organizerMail: meeting.organizer.mail,
                subject: meeting.summary,
                start: meeting.dateStart
              }
            });
          } else if ( res.hits.total == 1 ) {
            // Update attendStatus for this record
            client.update({
              index: self.props.indices.attendance,
              type: self.props.indices.attendanceType,
              id: res.hits.hits[0]._id,
              body: {
                doc: {
                  status: attendStatus
                }
              }
            });
          } else {
            // OH OH! There shouldn't be more than 1 records!
            alert("ERROR");
          }
        }
      }
    );
  },

  render: function () {

    return (
        <MAMain
          meetingList={this.state.meetingList}
          updateMeetingList={this.updateMeetingList}
          sendMeetingInfo={this.sendMeetingInfo} />
    );
  }
});

module.exports = MAMainCont;