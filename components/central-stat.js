var React = require('react');

// Import components
var MAAutoComplete = require('./autocomplete');

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
      scoreAttendancePerDay: null,
      scoreAccept: null
    };
  },

  componentDidMount: function () {
    //TODO Must update when parameters are changed after searchRange has been loaded
    this.props.loadCurrentSearchRange();
  },

  componentWillUnmount: function () {
    this.props.flushCurrentSearchRange();
    this.props.searchUser("", 0);
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
    this.props.searchUser(event.target[0].value, 15);
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
        <MAAutoComplete searchResults={this.props.searchResults} buttonCallback={this.selectUser} />
      </div>
    );
  },

  resetUser: function (event) {
    this.setState({targetUser: null, scoreAttendance: null, scoreAttendancePerDay: null, scoreAccept: null, scoreAnswer: null});
    // Reset searchResults
    this.props.searchUser("", 0);
  },

  displayAttendanceScore: function (score) {
    const AttSc = ( <div>Attendance Score = {score}</div> );
    this.setState({scoreAttendance: AttSc});
  },

  displayAttendanceScorePerDay: function (scoreArray) {
    const daysOW = [
      {day: "Monday", score: scoreArray[0]},
      {day: "Tuesday", score: scoreArray[1]},
      {day: "Wednesday", score: scoreArray[2]},
      {day: "Thursday", score: scoreArray[3]},
      {day: "Friday", score: scoreArray[4]},
      {day: "Saturday", score: scoreArray[5]},
      {day: "Sunday", score: scoreArray[6]}
    ];
    const AttScPD = (
      <div>
        Attendance Score Per Day of the Week
        <ul>
          {daysOW.map(function (dayScore) {
            return (<li key={dayScore.day}>{dayScore.day}: {dayScore.score}</li>);
          })}
        </ul>
      </div>
    );
    this.setState({scoreAttendancePerDay: AttScPD});
  },

  displayAcceptScore: function (scoreArray) {
    const AccSc = (
      <div>
        <div>Meeting Accept Score = {scoreArray[0]}</div>
        <div>Meeting Request Answer Score = {scoreArray[1]}</div>
      </div>
    );
    this.setState({scoreAccept: AccSc});
  },

  displayStats: function () {
    return (
      <div>
        <div><button value="clear" onClick={this.resetUser}>Clear selection</button></div>
        <div>Name: {this.state.targetUser.name}</div>
        <div>Email: {this.state.targetUser.mail}</div>
        {this.state.scoreAttendance || this.props.getStatsWithCallback("AttSc", this.state.targetUser.mail, this.displayAttendanceScore)}
        {this.state.scoreAttendancePerDay || this.props.getStatsWithCallback("AttScPD", this.state.targetUser.mail, this.displayAttendanceScorePerDay)}
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
