var React = require('react');

var MAIcsForm = React.createClass({

  propTypes: {
    updateIcsFile: React.PropTypes.func.isRequired,
  },

  selectIcs: function(event) {
    event.preventDefault();
    var reader = new FileReader();
    var file = event.target.files[0];
    var update = this.props.updateIcsFile;
    var fileOK = false;

    if (file.type.match('text/*')) {
      reader.onload = function (upload) {
        var dataURL = upload.target.result;
        try {
          var mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];
          if (mimeType.search("VCALENDAR") != -1) {
            fileOK = true;
            var calArray = dataURL.replace(new RegExp( "\\r\\n\\s", "g" ), "").split("\n");
            update(calArray);
          }
        }
        catch (err) {
          //do nothing
        }
      };
      reader.readAsText(file);
    }
    if ( ! fileOK ) {
      this.props.updateIcsFile(file.name + " does not meet iCalendar format");
    }
  },

  submitIcs: function(event) {
    event.preventDefault();
  },

  transferClick: function(event) {
    this.props.updateIcsFile("");
    this.refs.fileRef.click();
  },

  render: function () {
      var invisibleStyle = {
        display: 'none',
      };

      return (
        <form onSubmit={this.submitIcs}>
          <input type="image" name="input-img" src="img/logo.png" onClick={this.transferClick} /><br />
          <input type="file" enctype="multipart/form-data" ref="fileRef" accept="text/calendar" onChange={this.selectIcs} style={invisibleStyle} />
        </form>
      );
  }
});

module.exports = MAIcsForm;
