var React = require('react');

var MAUserStat = React.createClass({

  propTypes: {
    updateCentralPanel: React.PropTypes.func.isRequired
  },

  handleChoice: function (event) {
    this.props.updateCentralPanel(1);
  },

  render: function () {

    return (
        <img src="img/userstat.png" onClick={this.handleChoice}/>
    );
  }
});

module.exports = MAUserStat;
