var React = require('react');

var MACentralStat = React.createClass({

  propTypes: {
    searchResults: React.PropTypes.array.isRequired,
    searchRange: React.PropTypes.string,
    searchUser: React.PropTypes.func.isRequired,
    loadCurrentSearchRange: React.PropTypes.func.isRequired,
    flushCurrentSearchRange: React.PropTypes.func.isRequired,
    getStatsWithCallback: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      targetUser: null,
      scoreAttendance: null,
      scoreAccept: null
    };
  },

  componentDidMount: function () {
    this.props.loadCurrentSearchRange();
  },

  componentWillUnmount: function () {
    this.props.flushCurrentSearchRange();
  },

  selectUser: function (event) {
    const targetUser = JSON.parse(event.target.value);
    this.setState({targetUser: targetUser});
  },

  displayResults: function () {
    if ( this.props.searchResults.length > 0 ) {
      var self = this;
      return (
        <ul>
          {self.props.searchResults.map(function (hit) {
            const str = hit._source.attendeeName + " (" + hit._source.attendeeMail + ")";
            const val = JSON.stringify({name: hit._source.attendeeName, mail: hit._source.attendeeMail});
            return (
              <li><button value={val} onClick={self.selectUser}>{str}</button></li>
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
    // Reset searchResults
    this.props.searchUser("", 0);
  },

  displayAttendanceScore: function (score) {
    const AttSc = ( <div>Attendance Score = {score}</div> );
    this.setState({scoreAttendance: AttSc});
  },

  displayAcceptScore: function (score) {
    const AccSc = ( <div>Meeting Accept Score = {score}</div> );
    this.setState({scoreAccept: AccSc});
  },

  displayStats: function () {
    return (
      <div>
        <div><button value="clear" onClick={this.resetUser}>Clear selection</button></div>
        <div>Name: {this.state.targetUser.name}</div>
        <div>Email: {this.state.targetUser.mail}</div>
        {this.state.scoreAttendance || this.props.getStatsWithCallback("AttSc", this.state.targetUser.mail, this.displayAttendanceScore)}
        {this.state.scoreAccept || this.props.getStatsWithCallback("AccSc", this.state.targetUser.mail, this.displayAcceptScore)}
      </div>
    );
  },

  render: function () {
    return (
      <div>{this.state.targetUser ? this.displayStats() : this.displaySearch()}</div>
    );
  }
});

module.exports = MACentralStat;
