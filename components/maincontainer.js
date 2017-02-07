var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

var MAMain = require('./main');

var MAMainCont = React.createClass({

  propTypes: {
    docURL: React.PropTypes.string.isRequired,
    connectId: React.PropTypes.string.isRequired,
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

  sendMeetingInfo: function (json) {
    //Send data to Elastic
    //var client = new elasticsearch.Client({host: connectId, log: 'error'});
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
