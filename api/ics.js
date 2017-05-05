var moment = require('moment-timezone');

exports.icsParse = function (icsData) {

  // makeDate: Convert text string to Date object in UTC format
  var makeDate = function (tmz, browtz, icsDate) {
    // Check if timezone is formatted according to IANA standard
    if ( !(moment.tz.zone(tmz)) ) {
      // In case of unknown format, use browser timezone if set or the computer timezone as current
      if ( browtz !== "" ) {
        tmz = browtz;
      } else {
        tmz = moment.tz.guess();
      }
    }
    return moment.tz(icsDate,tmz).tz('utc').format();
  };

  // parseIcs: Parse ics file and return meetingList object
  var parseIcs = function (calArray) {
    var meetingList = [];
    var meeting;
    var m = 0, // meeting number in meetingList
        a = 0; // attendee number in meeting
    var state = "",
        tz="UTC",
        browtz="";
    for ( var i=0; i<calArray.length; i++ ) {
      if ( state != "") {
        var tag = calArray[i].split(':')[0];
        //var val = calArray[i].split(':')[1];
        var val = calArray[i].substring(tag.length+1,calArray[i].length);
        if ( tag == "TZID" && state == "VTIMEZONE" ) {
          tz = val;
        }
        if ( state == "VEVENT" ) {

          //switch (tag) {
          switch (true) {
            case tag.startsWith("DTSTART"):
              meeting.dateStart = makeDate(tz, browtz, val);
              break;
            case tag.startsWith("DTEND"):
              meeting.dateEnd = makeDate(tz, browtz, val);
              break;
            case tag.startsWith("SUMMARY"):
              meeting.summary = val;
              break;
            case (tag == "LOCATION"):
              meeting.location = val;
              break;
            case (tag == "DESCRIPTION"):
              meeting.description = val;
              break;
            default:
              val = calArray[i].split(';');
              if ( val[0] == "ORGANIZER" ) {
                var orgArray = val[1].split(':');
                meeting.organizer = {
                  cn: orgArray[orgArray.findIndex(function(token){return token.startsWith("CN=");})].replace("CN=","").replace(new RegExp("\"", "g"),""),
                  mail: orgArray[orgArray.indexOf("mailto")+1]
                }
              } else if ( val[0] == "ATTENDEE" ) {
                  var attendee = {
                    name: "",
                    role: "",
                    accept: "",
                    mail: ""
                  }
                  // By default, role is REQ-PARTICIPANT unless stated otherwise
                  attendee.role = "REQ-PARTICIPANT";
                  for (var j=0;j< val.length;j++) {
                    var pair = val[j].split("=");
                    if ( pair[0] == "ROLE" ) { attendee.role = pair[1]; }
                    else if ( pair[0] == "PARTSTAT") { attendee.accept = pair[1]; }
                    else if ( pair[0] == "CN" ) { attendee.name = pair[1].replace(new RegExp("\"", "g"),""); }
                  }
                  var orgArray = calArray[i].split(':');
                  attendee.mail = orgArray[orgArray.indexOf("mailto")+1];

                  meeting.attendees[a] = attendee;
                  a++;
              }
          }
        }
      }
      // Retrive the browser timezone at the beginning of icsData
      if ( calArray[i].startsWith("BROWTZID") ) { browtz = calArray[i].split(':')[1]; }

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
            dateStart: null,
            dateEnd: null,
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
