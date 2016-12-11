var React = require('react');
var MAHeader = require('./header');
var MAMain = require('./main');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    propTypes: {
      docURL: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        topMessage: "",
        title: "Meeting Analytics",
      };
    },

    updateTopMessageHandler (text) {
      this.setState({topMessage: text});
    },

    render: function () {

        return (
            <div>
              <MAHeader topMessage={this.state.topMessage} title={this.state.title}/>
              <MAMain updateTopMessageHandler={this.updateTopMessageHandler} docURL={this.props.docURL}/>
              <MAFooter/>
            </div>
        );
    }
});

module.exports = MainPage;
