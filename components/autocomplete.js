var React = require('react');

var MAAutoComplete = React.createClass({

  propTypes: {
    buttonCallback: React.PropTypes.array.isRequired,
    searchResults: React.PropTypes.array.isRequired
  },

  render: function () {

    if ( this.props.searchResults.length > 0 ) {
      var self = this;
      return (
        <ul>
          {self.props.searchResults.map(function (hit) {
            const str = hit._source.attendeeName + " (" + hit._source.attendeeMail + ")";
            const val = JSON.stringify({name: hit._source.attendeeName, mail: hit._source.attendeeMail});
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
