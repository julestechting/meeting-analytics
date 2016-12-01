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
    this.setState({icsFile: "aaaa"});
    var self = this;

    reader.onload = function (upload) {
      self.setState({icsFile: upload.target.result});
    };
    reader.readAsText(file);
  },

  submitIcs: function(event) {
    event.preventDefault();
  },

  transferClick: function(event) {
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
