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
        <form onSubmit={this.handleSearch} className="w3-bar w3-responsive">
          <span className="w3-bar-item">Search name:</span>
          <input type="search" list="usersList" name="nameSearch" onChange={this.handleAutoComplete} className="w3-bar-item w3-input w3-border w3-border-cyan w3-hover-border-orange"/>
          <input type="Submit" value="Submit" className="w3-bar-item w3-margin-left w3-button w3-text-white w3-cyan w3-hover-text-white w3-hover-orange"/>
        </form>
        <MAAutoComplete searchResults={this.props.searchResults} buttonCallback={this.selectUser} />
      </div>
    );
  },

  resetUser: function (event) {
    this.setState({targetUser: null, scoreAttendance: null, scoreAttendancePerDay: null, scoreAccept: null, scoreAnswer: null});
    // Reset searchResults
    this.props.searchUser("", 0);
    // Reload searchRange
    this.props.loadCurrentSearchRange();
  },

  displayAttendanceScore: function (score, onTime, totalHits) {
    const AttSc = (
      <div className="w3-row-padding">
        <div className="w3-col s4">
          <div className="w3-bar-block w3-center w3-border w3-border-cyan">
            <div className="w3-bar-item w3-cyan w3-text-white"><strong>Total records</strong></div>
            <div className="w3-bar-item w3-xlarge">{totalHits}</div>
          </div>
        </div>
        <div className="w3-col s4">
          <div className="w3-bar-block w3-center w3-border w3-border-cyan">
            <div className="w3-bar-item w3-cyan w3-text-white"><strong>Attendance</strong></div>
            <div className="w3-bar-item w3-xlarge">{score}</div>
          </div>
        </div>
        <div className="w3-col s4">
          <div className="w3-bar-block w3-center w3-border w3-border-cyan">
            <div className="w3-bar-item w3-cyan w3-text-white"><strong>On-Time</strong></div>
            <div className="w3-bar-item w3-xlarge">{onTime}</div>
          </div>
        </div>
      </div>
    );
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
      <div className="w3-padding">
        <strong>Attendance Score Per Day of the Week</strong>
        <table className="w3-table w3-border w3-border-cyan w3-bordered w3-responsive">
          <tbody>
            {daysOW.map(function (dayScore) {
              return (
                <tr>
                  <td className="w3-cyan w3-text-white">{dayScore.day}:</td>
                  <td>{dayScore.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    this.setState({scoreAttendancePerDay: AttScPD});
  },

  displayAcceptScore: function (scoreArray) {
    const AccSc = (
      <div className="w3-row-padding">
        <div className="w3-col s6">
          <div className="w3-bar-block w3-center w3-border w3-border-cyan">
            <div className="w3-bar-item w3-cyan w3-text-white"><strong>Accept</strong></div>
            <div className="w3-bar-item w3-xlarge">{scoreArray[0]}</div>
          </div>
        </div>
        <div className="w3-col s6">
          <div className="w3-bar-block w3-center w3-border w3-border-cyan">
            <div className="w3-bar-item w3-cyan w3-text-white"><strong>Answer</strong></div>
            <div className="w3-bar-item w3-xlarge">{scoreArray[1]}</div>
          </div>
        </div>
      </div>
    );
    this.setState({scoreAccept: AccSc});
  },

  displayStats: function () {
    return (
      <div>
        <div><button value="clear" onClick={this.resetUser} className="w3-button w3-text-white w3-cyan w3-hover-text-white w3-hover-orange">Clear selection</button></div>
        <div className="w3-margin-bottom"><strong className="w3-large">{this.state.targetUser.name} ({this.state.targetUser.mail})</strong></div>
        {this.state.scoreAttendance || this.props.getStatsWithCallback("AttSc", this.state.targetUser.mail, this.displayAttendanceScore)}
        {this.state.scoreAttendancePerDay || this.props.getStatsWithCallback("AttScPD", this.state.targetUser.mail, this.displayAttendanceScorePerDay)}
        {this.state.scoreAccept || this.props.getStatsWithCallback("AccSc", this.state.targetUser.mail, this.displayAcceptScore)}
      </div>
    );
  },

  render: function () {
    return (
      <div className="w3-container">{this.state.targetUser ? this.displayStats() : this.displaySearch()}</div>
    );
  }
});

module.exports = MACentralStat;
