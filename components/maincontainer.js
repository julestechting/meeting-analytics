var React = require('react');
var fetch = require('node-fetch');
var MAMain = require('./main')

var MAMainCont = React.createClass({

  propTypes: {
    docURL: React.PropTypes.string.isRequired,
    connectId: React.PropTypes.string.isRequired,
    updateTopMessage: React.PropTypes.func.isRequired
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
             self.props.updateTopMessage(file.name + " does not meet iCalendar format");
          }
        };
        reader.readAsText(file);
      } else {
        this.props.updateTopMessage(file.name + " does not meet iCalendar format");
      }
    } else {
      this.setState({meetingList: []});
    }
  },

  sendMeetingInfo: function (json) {
    //Send data to Elastic
  },

  render: function () {

    return (
        <MAMain
          meetingList={this.state.meetingList}
          updateMeetingList={this.updateMeetingList}
          sendMeetingInfo={this.sendMeetingInfo}
          updateTopMessage={this.props.updateTopMessage} />
    );
  }
});

module.exports = MAMainCont;
