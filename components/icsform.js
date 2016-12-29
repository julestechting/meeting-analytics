var React = require('react');
var fetch = require('node-fetch');

var MAIcsForm = React.createClass({

  propTypes: {
    updateMeetingList: React.PropTypes.func.isRequired,
    updateCentralPanel: React.PropTypes.func.isRequired,
    updateTopMessageHandler: React.PropTypes.func.isRequired,
    docURL: React.PropTypes.string.isRequired
  },

  selectIcs: function(event) {
    event.preventDefault();
    var file = event.target.files[0];

    if (file.size > 0 && file.type.match('text/*')) {
      var self = this;
      var reader = new FileReader();
      var meetingList = [];
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
                 return res.json().then(function (json) {
                   self.props.updateCentralPanel(0);
                   self.props.updateMeetingList(json);
                 })
               });
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
    this.props.updateMeetingList([]);
    this.props.updateCentralPanel(-1);
    this.props.updateTopMessageHandler("");
    this.refs.fileRef.click();
  },

  render: function () {
      var invisibleStyle = {
        display: 'none',
      };

      return (
        <form onSubmit={this.submitIcs}>
          <input type="image" name="input-img" src="img/upload.png" onClick={this.transferClick} /><br />
          <input type="file" encType="multipart/form-data" ref="fileRef" accept="text/calendar" onChange={this.selectIcs} style={invisibleStyle} />
        </form>
      );
  }
});

module.exports = MAIcsForm;
