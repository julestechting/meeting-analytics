var React = require('react');
var MAHeader = require('./header');
var MAMain = require('./main');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    getInitialState: function () {
      return {
        topMessage: "",
        title: "Meeting Analytics",
      };
    },

    render: function () {

        return (
            <div>
              <MAHeader topMessage={this.state.topMessage} title={this.state.title}/>
              <MAMain/>
              <MAFooter/>
            </div>
        );
    }
});

module.exports = MainPage;
