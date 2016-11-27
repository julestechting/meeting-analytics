var React = require('react');
var MAHeader = require('./header');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    getInitialState: function () {
      return {
        topMessage: "",
        title: "Meeting Analytics",
      };
    },

    render: function () {
        const topMessage = this.state.topMessage;
        return (
            <div>
              <MAHeader topMessage={this.state.topMessage} title={this.state.title}/>
              <MAFooter />
            </div>
        );
    }
});

module.exports = MainPage;
