var React = require('react');
var MAHeader = require('./header');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    getInitialState: function () {
      return {topMessage: ""};
    },

    render: function () {
        const topMessage = this.state.topMessage;
        return (
            <div>
              <MAHeader topMessage={this.state.topMessage}/>
              <MAFooter />
            </div>
        );
    }
});

module.exports = MainPage;
