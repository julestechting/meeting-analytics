var React = require('react');

var MAIcsForm = React.createClass({

  propTypes: {
    updateMeetingList: React.PropTypes.func.isRequired,
    updateTopMessageHandler: React.PropTypes.func.isRequired,
  },

  makeDate: function (tz, icsDate, long) {
    return icsDate;
  },

  parseIcs: function (calArray) {
    var meetingList = [];
    var meeting;
    var m = 0, // meeting number in meetingList
        a = 0; // attendee number in meeting
    var state = "",
        tz="UTC";
    for ( var i=0; i<calArray.length; i++ ) {
      if ( state != "") {
        var tag = calArray[i].split(':')[0];
        var val = calArray[i].split(':')[1];
        if ( tag == "TZID" && state == "VTIMEZONE") {
          tz = val;
        }
        if ( state == "VEVENT") {
          switch (tag) {
            case "DTSTART;VALUE=DATE":
              meeting.date = this.makeDate(tz,val,false);
              break;
            case "DTSTART":
              meeting.date = this.makeDate(tz,val,true);
              break;
            case "SUMMARY":
              meeting.summary = val;
              break;
            case "LOCATION":
              meeting.location = val;
              break;
            case "DESCRIPTION":
              meeting.description = val;
              break;
            default:
              val = calArray[i].split(';');
              if ( val[0] == "ORGANIZER" ) {
                meeting.organizer = {
                  cn: val[1].split(':')[0].replace("CN=",""),
                  mail: val[1].split(':')[2] // ignore mailto
                }
              } else if ( val[0] == "ATTENDEE" ) {
                  var attendee = {
                    name: "",
                    role: "",
                    accept: "",
                    mail: ""
                  }
                  for (var j=0;j< val.length;j++) {
                    var pair = val[j].split("=");
                    if ( pair[0] == "ROLE" ) { attendee.role = pair[1]; }
                    else if ( pair[0] == "PARTSTAT") { attendee.accept = pair[1]; }
                    else if ( pair[0] == "CN" ) { attendee.name = pair[1]; }
                    else if ( pair[0] == "X-NUM-GUESTS") { attendee.mail = pair[1].split(':')[2]; }
                  }
                  meeting.attendees[a] = attendee;
                  a++;
              }
          }
        }
      }
      if ( calArray[i].startsWith("END:VTIMEZONE") ) {
          state = "";
      } else if ( calArray[i].startsWith("END:VEVENT") ) {
          state = "";
          a = 0;
          if ( meeting.attendees.length > 0 ) {
            meetingList[m] = meeting;
            m++;
          }
      } else if ( calArray[i].startsWith("BEGIN:VTIMEZONE") ) {
          state = "VTIMEZONE";
      } else if ( calArray[i].startsWith("BEGIN:VEVENT") ) {
          state = "VEVENT";
          meeting = {
            date: null,
            organizer: null,
            attendees: [],
            summary: "",
            description: "",
            location: ""
          };
      } else if (calArray[i].startsWith("BEGIN:VALARM") ) {
          state = "VALARM";
      }
      else if (calArray[i].startsWith("END:VALARM") ) {
          state = "VEVENT";
      }
    }
    this.props.updateMeetingList(meetingList);
  },

  selectIcs: function(event) {
    event.preventDefault();
    var reader = new FileReader();
    var file = event.target.files[0];
    var self = this;

    if (file.type.match('text/*')) {
      reader.onload = function (upload) {
        var dataURL = upload.target.result;
        try {
          var mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];
          if (mimeType.search("VCALENDAR") != -1) {
            var calArray = dataURL.replace(new RegExp( "\\r\\n\\s", "g" ), "").split("\n");
            self.parseIcs(calArray);
          }
        }
        catch (err) {
           self.props.updateTopMessageHandler(file.name + " does not meet iCalendar format");
        }
      };
      reader.readAsText(file);
    } else {
      this.props.updateTopMessageHandler(file.name + " does not meet iCalendar format");
    }
  },

  submitIcs: function(event) {
    event.preventDefault();
  },

  transferClick: function(event) {
    this.props.updateMeetingList("");
    this.props.updateTopMessageHandler("");
    this.refs.fileRef.click();
  },

  render: function () {
      var invisibleStyle = {
        display: 'none',
      };

      return (
        <form onSubmit={this.submitIcs}>
          <input type="image" name="input-img" src="img/logo.png" onClick={this.transferClick} /><br />
          <input type="file" encType="multipart/form-data" ref="fileRef" accept="text/calendar" onChange={this.selectIcs} style={invisibleStyle} />
        </form>
      );
  }
});

module.exports = MAIcsForm;
