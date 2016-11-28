var React = require('react');

var MAMain = React.createClass({

    getInitialState: function () {
      return {icsFile: ""};
    },

    selectIcs: function(event) {
      this.setState({icsFile: event.target});
    },

    submitIcs: function(event) {
      alert(this.state.icsFile.value);
      //todo
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
            <form onSubmit={this.submitIcs}>
              Upload ics file<br/>
              <input type="image" name="input-img" src="img/logo.png" onClick={this.transferClick} /><br />
              <input type="file" ref="fileRef" accept="text/calendar" onChange={this.selectIcs} required style={invisibleStyle} />
              <input type="submit" name="submit" value="Upload" />
            </form>
        );
    }
});

module.exports = MAMain;
