var moment = require('moment-timezone');

exports.icsParse = function (icsData) {

  // makeDate: Convert text string to Date object in UTC format
  var makeDate = function (tmz, icsDate) {
    return moment.tz(icsDate,tmz).tz('utc').format();
  };

  // parseIcs: Parse ics file and return meetingList object
  var parseIcs = function (calArray) {
    var meetingList = [];
    var meeting;
    var m = 0, // meeting number in meetingList
        a = 0; // attendee number in meeting
    var state = "",
        tz="UTC";
    for ( var i=0; i<calArray.length; i++ ) {
      if ( state != "") {
        var tag = calArray[i].split(':')[0];
        //var val = calArray[i].split(':')[1];
        var val = calArray[i].substring(tag.length+1,calArray[i].length);
        if ( tag == "TZID" && state == "VTIMEZONE" ) {
          tz = val;
        }
        if ( state == "VEVENT" ) {
          switch (tag) {
            case "DTSTART;VALUE=DATE":
            case "DTSTART":case "DTSTART":
              meeting.date = makeDate(tz,val);
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
      switch (calArray[i]) {
        case "END:VTIMEZONE":
          state = "";
          break;
        case "END:VEVENT":
          state = "";
          a = 0;
          if ( meeting.attendees.length > 0 ) {
            meetingList[m] = meeting;
            m++;
          }
          break;
        case "END:VALARM":
          state = "VEVENT";
          break;
        case "BEGIN:VTIMEZONE":
          state = "VTIMEZONE";
          break;
        case "BEGIN:VEVENT":
          state = "VEVENT";
          meeting = {
            date: null,
            organizer: null,
            attendees: [],
            summary: "",
            description: "",
            location: ""
          };
          break;
        case "BEGIN:VALARM":
          state = "VALARM";
          break;
      }
    }
    return meetingList;
  };

  // Load file and launch parsing
  var calArray = icsData.replace(new RegExp( "\\n\\s", "g" ), "").replace(new RegExp( "\\r", "g" ), "").split("\n");

  return parseIcs(calArray);
};
