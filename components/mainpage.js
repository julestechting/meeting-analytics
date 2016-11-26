var React = require('react');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    render: function () {
        return (
            <div>
              <header className="w3-container w3-teal">
                <h1>Hello World!</h1>
              </header>
              <MAFooter />
            </div>
        );
    }
});

module.exports = MainPage;
