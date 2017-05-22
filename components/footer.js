var React = require('react');

var MAFooter = React.createClass({

    render: function () {

      return (
          <footer className="w3-container w3-hide-small w3-orange w3-tiny w3-text-white">
            <table className="w3-responsive">
              <tr>
                <td className="w3-padding-0"><img src="img/logo.png" className="w3-circle" alt="Logo" /></td>
                <td className="w3-padding-0">
                  <span>Powered by </span>
                  <a href="mailto:julestechconsulting@gmail.com">Jules Tech Consulting Inc.</a>
                  <span> @2016</span>
                </td>
              </tr>
            </table>
          </footer>
      );
    }
});

module.exports = MAFooter;
