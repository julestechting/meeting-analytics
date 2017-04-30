var React = require('react');

var MACentralStat = React.createClass({

  propTypes: {
    searchResults: React.PropTypes.array.isRequired,
    searchRange: React.PropTypes.string,
    searchUser: React.PropTypes.func.isRequired,
    loadCurrentSearchRange: React.PropTypes.func.isRequired,
    flushCurrentSearchRange: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      targetUser: null
    };
  },

  componentDidMount: function () {
    this.props.loadCurrentSearchRange();
  },

  componentWillUnmount: function () {
    this.props.flushCurrentSearchRange();
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

  displaySearch: function () {
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
  },

  resetUser: function (event) {
    this.setState({targetUser: null});
  },

  showStats: function () {
    return (
      <div>
        <div><button value="clear" onClick={this.resetUser}>Clear selection</button></div>
        {this.state.targetUser}
      </div>
    );
  },

  render: function () {
    return (
      <div>{this.state.targetUser ? this.showStats() : this.displaySearch()}</div>
    );
  }
});

module.exports = MACentralStat;
