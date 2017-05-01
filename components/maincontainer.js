var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

// Import components
var MAMain = require('./main');
var eDefs = require('./edefinitions');

var MAMainCont = React.createClass({

  propTypes: {
    docURL: React.PropTypes.string.isRequired,
    connectId: React.PropTypes.string.isRequired,
    owner: React.PropTypes.string.isRequired,
    getParamsWithCallback: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      meetingList: [],
      searchResults: [],
      searchRange: null
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
    const owner = this.props.owner;
    const indices = eDefs.eLIndices;

    // Connect to elasticsearch
    var client = new elasticsearch.Client({host: this.props.connectId, log: 'error'});

    // Search if record already exists
    // A record should be unique by its five fields: owner, subject.raw, organizerMail, attendeeMail and start
    client.search ({
      index: indices.attendance,
      body: {
        query: {
          bool: {
            filter: [
              {term: {owner: owner}},
              {term: {"subject.raw": meeting.summary}},
              {term: {organizerMail: meeting.organizer.mail}},
              {term: {attendeeMail: meeting.attendees[attendeeIdx].mail}},
              {term: {start: meeting.dateStart}}
            ]
          }
        }
      }},
      function (err, res, status) {
        if ( !err ) {
          if ( res.hits.total == 0 ) {
            // New record to create
            client.index ({
              index: indices.attendance,
              type: indices.attendanceType,
              body: {
                owner: owner,
                attendeeName: meeting.attendees[attendeeIdx].name,
                attendeeMail: meeting.attendees[attendeeIdx].mail,
                accept: meeting.attendees[attendeeIdx].accept,
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
              index: indices.attendance,
              type: indices.attendanceType,
              id: res.hits.hits[0]._id,
              body: {
                doc: {
                  status: attendStatus
                }
              }
            });
          } else {
            // OH OH! There shouldn't be more than 1 records!
            // Should probably notify of the error
          }
        }
      }
    );
  },

  searchUser: function (searchStr, number) {
    var self = this;
    // Connect to elasticsearch
    var client = new elasticsearch.Client({host: this.props.connectId, log: 'error'});
    client.search({
      index: eDefs.eLIndices.attendance,
      body: {
        size: number,
        query: {
          bool: {
            filter: [
              { term: { owner: self.props.owner }}
            ],
            should: [
              { match: { "attendeeName.ngram": searchStr }},
              { match: { "attendeeMail.ngram": searchStr }}
            ],
            minimum_should_match: 1
          }
        }
      }},
      function (err, res, status) {
        if ( !err ) {
          self.setState({searchResults: res.hits.hits});
        } else {
          // Should probably notify of the error
        }
      }
    );
  },

  flushCurrentSearchRange: function () {
    this.setState({searchRange: null});
  },

  loadSearchRangeCallback: function (params) {
    if ( params.defaultDuration > 0 ) {
      const range = "-" + params.defaultDuration + params.defaultDurationUnit;
      this.setState({searchRange: range});
    }
  },

  loadCurrentSearchRange: function () {
    this.props.getParamsWithCallback(this.props.connectId, this.props.owner, this.loadSearchRangeCallback);
  },

  getStatsWithCallback: function (statType, mail, statCallback) {
    var self = this;
    // Build request body base
    var reqBody = {
      size: 0,
      query: {
        constant_score: {
          filter: {
            bool: {
              must: [
                { term: { owner: self.props.owner }},
                { term: { attendeeMail: mail }}
              ]
            }
          }
        }
      },
      aggs: {}
    };
    // Update reqBody based on statType
    switch (statType) {
      case "AttSc":
        reqBody.aggs = {
          AttSc: {
            filter: {
				      terms: { status: ["AOT", "AL"] }
			      }
          }
        };
        break;
      case "AccSc":
        reqBody.aggs = {
          NoAccSc: {
            filter: {
              terms: { accept: ["NEEDS-ACTION"] }
            }
          }
        };
        break;
      default:
        // Do nothing
    }
    // Connect to elasticsearch
    var client = new elasticsearch.Client({host: this.props.connectId, log: 'error'});
    client.search({
      index: eDefs.eLIndices.attendance,
      body: reqBody},
      function (err, res, status) {
        if ( !err ) {
          switch (statType) {
            case "AttSc":
              statCallback(res.aggregations.AttSc.doc_count / res.hits.total);
              break;
            case "AccSc":
              statCallback(1 - (res.aggregations.NoAccSc.doc_count / res.hits.total));
              break;
            default:
              // Do nothing
          }
        } else {
          // Should probably notify of the error
        }
      }
    );
  },

  render: function () {

    return (
      <MAMain
        meetingList={this.state.meetingList}
        updateMeetingList={this.updateMeetingList}
        sendMeetingInfo={this.sendMeetingInfo}
        searchResults={this.state.searchResults}
        searchUser={this.searchUser}
        searchRange={this.state.searchRange}
        loadCurrentSearchRange={this.loadCurrentSearchRange}
        flushCurrentSearchRange={this.flushCurrentSearchRange}
        getStatsWithCallback={this.getStatsWithCallback}/>
    );
  }
});

module.exports = MAMainCont;
