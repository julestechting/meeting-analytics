var React = require('react');

var MACentralStat = React.createClass({

  /*
  propTypes: {

  },

  getInitialState: function () {
    return {
      targetUser: null
    };
  },
  */

  buildAutoComplete: function () {

  },

  handleAutoComplete: function (event) {
    var searchText = event.target.value;
    if ( searchText.length > 2 ) {
      // get autocomplete
    }
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
            <input type="search" name="nameSearch" list="usersList" onChange={this.handleAutoComplete}/>
            <datalist id="usersList">
              {this.buildAutoComplete}
            </datalist>
            <input type="Submit" value="Submit" />
          </label>
        </form>
        {this.displayResults}
      </div>
    );
  }
});

module.exports = MACentralStat;
