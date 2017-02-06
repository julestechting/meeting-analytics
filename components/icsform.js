var React = require('react');

var MAIcsForm = React.createClass({

  propTypes: {
    updateMeetingList: React.PropTypes.func.isRequired,
    updateCentralPanel: React.PropTypes.func.isRequired,
  },

  selectIcs: function(event) {
    event.preventDefault();
    this.props.updateMeetingList(event.target.files[0]);
    this.props.updateCentralPanel(0);
  },

  submitIcs: function(event) {
    event.preventDefault();
  },

  transferClick: function(event) {
    this.props.updateMeetingList(null);
    this.props.updateCentralPanel(-1);
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
