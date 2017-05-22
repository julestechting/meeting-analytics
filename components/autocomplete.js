var React = require('react');

var MAAutoComplete = React.createClass({

  propTypes: {
    buttonCallback: React.PropTypes.func.isRequired,
    searchResults: React.PropTypes.array.isRequired
  },

  render: function () {

    if ( this.props.searchResults.length > 0 ) {
      var self = this;
      return (
        <div className="w3-bar-block">
          {self.props.searchResults.map(function (sUser) {
            const str = sUser.attendeeName + " (" + sUser.attendeeMail + ")";
            const val = JSON.stringify({name: sUser.attendeeName, mail: sUser.attendeeMail});
            return (
              <div className="w3-bar-item">
                <button value={val} onClick={self.props.buttonCallback} className="w3-button w3-text-white w3-cyan w3-hover-text-white w3-hover-orange">{str}</button>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }
});

module.exports = MAAutoComplete;
