var React = require('react');

var MACentralStat = React.createClass({

  propTypes: {
    searchResults: React.PropTypes.array.isRequired,
    searchUser: React.PropTypes.func.isRequired
  },
  /*
  getInitialState: function () {
    return {
      targetUser: null
    };
  },
  */

  buildAutoComplete: function (id) {
    if ( this.props.searchResults.length > 0 ) {
      var self = this;
      return (
        <datalist id={id}>
        {self.props.searchResults.map(function (hit) {
          const str = hit._source.attendeeName + " (" + hit._source.attendeeMail + ")";
          return (<option value={str} />);
        })}
        </datalist>
      );
    }
  },

  handleAutoComplete: function (event) {
    this.props.searchUser(event.target.value);
  },

  handleSearch: function (event) {

  },

  displayResults: function () {

  },

  render: function () {

    return (
      <div>
        <form onSubmit={this.handleSearch}>
          <label>Search name:
            <input list="usersList" name="nameSearch" onChange={this.handleAutoComplete}/>
            {this.buildAutoComplete("usersList")}
            <input type="Submit" value="Submit" />
          </label>
        </form>
        {this.displayResults}
      </div>
    );
  }
});

module.exports = MACentralStat;
