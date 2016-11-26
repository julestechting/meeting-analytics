var React = require('react');

var MAFooter = React.createClass({

    render: function () {
        var logoStyle = {
          transform: 'scale(0.6,0.6)',
          'vertical-align': 'middle',
        };

        return (
            <footer className="w3-container w3-black w3-center w3-tiny">
                <img src="img/logo.png" className="w3-circle w3-show-inline-block" style={logoStyle} alt="Logo" />
                <div className="w3-show-inline-block">
                  <span>Powered by </span>
                  <a href="mailto:julestechconsulting@gmail.com">Jules Tech Consulting Inc.</a>
                  <span> @2016</span>
                </div>
            </footer>
        );
    }
});

module.exports = MAFooter;
