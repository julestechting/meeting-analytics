var React = require('react');

var MAMain = React.createClass({

    getInitialState: function () {
      return {icsFile: ""};
    },

    selectIcs: function(event) {
      this.setState({icsFile: event.target});
    },

    submitIcs: function(event) {
      alert('File '+ this.state.icsFile.value + ' has been submitted');
      event.preventDefault();
    },

    render: function () {

        return (
            <form onSubmit={this.submitIcs}>
              Upload ics file<br/>
              <input type="file" name="input" accept="text/calendar" onChange={this.selectIcs} /><br/>
              <input type="submit" value="Upload" />
            </form>
        );
    }
});

module.exports = MAMain;
