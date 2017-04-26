var React = require('react');

var MACentralStat = React.createClass({

  propTypes: {
    searchResults: React.PropTypes.array.isRequired,
    searchUser: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      targetUser: null
    };
  },

  selectUser: function (event) {
    this.setState({targetUser: event.target.value});
  },

  displayResults: function () {
    if ( this.props.searchResults.length > 0 ) {
      var self = this;
      return (
        <ul>
          {self.props.searchResults.map(function (hit) {
            const str = hit._source.attendeeName + " (" + hit._source.attendeeMail + ")";
            return (
              <li><button value={hit._source.attendeeMail} onClick={self.selectUser}>{str}</button></li>
            );
          })}
        </ul>
      );
    } else {
      return (<div>No result found</div>);
    }
  },

  handleAutoComplete: function (event) {
    this.props.searchUser(event.target.value, 5);
  },

  handleSearch: function (event) {
    this.props.searchUser(event.target.value, 15);
    event.preventDefault();
  },

  render: function () {

    return (
      <div>
        <form onSubmit={this.handleSearch}>
          <label>Search name:
            <input type="search" list="usersList" name="nameSearch" onChange={this.handleAutoComplete}/>
            <input type="Submit" value="Submit" />
          </label>
        </form>
        {this.displayResults()}
      </div>
    );
  }
});

module.exports = MACentralStat;
