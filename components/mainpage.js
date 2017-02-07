var React = require('react');

// Import components
var MAHeader = require('./header');
var MAMainCont = require('./maincontainer');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    propTypes: {
      docURL: React.PropTypes.string.isRequired,
      connectId: React.PropTypes.string.isRequired,
      eValidate: React.PropTypes.bool.isRequired,
      updateEClient: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        title: "Meeting Analytics"
      };
    },

    handleUpdateEClient: function (event) {
      if ( event.target.name == "host" ) {
        this.props.updateEClient(false, true, event.target.value);
      } else if ( event.target.name == "port" ) {
        this.props.updateEClient(false, false, event.target.value);
      } else {
          // Ignore
      }
      event.preventDefault();
    },

    handleESubmit: function (event) {
      // The required attribute in the form ensured states have been updated
      // No need to check again
      this.props.updateEClient(true, null, null);
      event.preventDefault();
    },

    render: function () {
      let main = null;
      if ( this.props.eValidate ) {
        main = (<MAMainCont docURL={this.props.docURL} connectId={this.props.connectId}/>);
      } else {
        main = (
          <div>
            <p>Please provide the Elasticsearch connection settings</p>
            <form onSubmit={this.handleESubmit}>
              <label>Host:
                <input type="text" name="host" onChange={this.handleUpdateEClient} required/>
              </label>
              <label>Port:
                <input type="number" name="port" min="1" onChange={this.handleUpdateEClient} required/>
              </label>
              <input type="submit" name="submit" value="Submit"/>
            </form>
          </div>
        );
      }

      return (
        <div>
          <MAHeader title={this.state.title}/>
          {main}
          <MAFooter/>
        </div>
      );
    }
});

module.exports = MainPage;
