var React = require('react');

var MAMain = React.createClass({

  propTypes: {
    updateTopMessageHandler: React.PropTypes.func.isRequired,
  },

  getInitialState: function () {
    return {icsFile: ""};
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
            self.setState({icsFile: calArray});
          }
        }
        catch (err) {
          //do nothing
        }
      };
      reader.readAsText(file);
    }
    if (this.state.icsFile == "" ) {
      this.setState({icsFile: file.name + " does not meet iCalendar format"});
    }
  },

  submitIcs: function(event) {
    event.preventDefault();
  },

  transferClick: function(event) {
    this.setState({icsFile: ""});
    this.refs.fileRef.click();
  },

  render: function () {
      var invisibleStyle = {
        display: 'none',
      };

      return (
          <div>
            <form onSubmit={this.submitIcs}>
              <input type="image" name="input-img" src="img/logo.png" onClick={this.transferClick} /><br />
              <input type="file" enctype="multipart/form-data" ref="fileRef" accept="text/calendar" onChange={this.selectIcs} style={invisibleStyle} />
            </form>
            <div>{this.state.icsFile}</div>
          </div>
      );
  }
});

module.exports = MAMain;
