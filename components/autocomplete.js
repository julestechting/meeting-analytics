var React = require('react');

var MAAutoComplete = React.createClass({

  propTypes: {
    buttonCallback: React.PropTypes.array.isRequired,
    searchResults: React.PropTypes.func.isRequired
  },

  render: function () {

    if ( this.props.searchResults.length > 0 ) {
      var self = this;
      return (
        <ul>
          {self.props.searchResults.map(function (sUser) {
            const str = sUser.attendeeName + " (" + sUser.attendeeMail + ")";
            const val = JSON.stringify({name: sUser.attendeeName, mail: sUser.attendeeMail});
            return (
              <li><button value={val} onClick={self.props.buttonCallback}>{str}</button></li>
            );
          })}
        </ul>
      );
    } else {
      return null;
    }
  }
});

module.exports = MAAutoComplete;
