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
      hideFooter: React.PropTypes.bool.isRequired,
      updateEClient: React.PropTypes.func.isRequired,
      currentParams: React.PropTypes.object.isRequired,
      loadCurrentParams: React.PropTypes.func.isRequired,
      setParams: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
      return {
        title: "Meeting Analytics",
        defaultUser: "default",
        openParam: false
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
      // The 'required' attribute in the form ensured states have been updated
      // No need to check again
      this.props.updateEClient(true, null, null);
      event.preventDefault();
    },

    updateOpenParam: function (value) {
      // Avoid loading params if "Preferences" button is pressed and Params are already open
      if ( !value || !this.state.openParam ) {
        this.props.loadCurrentParams(value, this.state.defaultUser);
        this.setState({openParam: value});
      }
    },

    handleUpdateParams: function (event) {
      const value = event.target.name === "hideFooter" ? event.target.checked : event.target.value;
      if ( event.target.name == "close" ) {
        this.setState({openParam: false});
      }
      this.props.setParams(event.target.name, value, this.state.defaultUser);
    },

    displayParam: function () {
      return (
        <div>
          <form>
            <input type="button" name="close" value="Close" onClick={this.handleUpdateParams}/><br/>
            <label>Search range:
              <input type="number" name="defaultDuration" min="0" value={this.props.currentParams.defaultDuration} onChange={this.handleUpdateParams}/>
              <select name="defaultDurationUnit" value={this.props.currentParams.defaultDurationUnit} onChange={this.handleUpdateParams}>
                <option value="H">Hour</option>
                <option value="D">Day</option>
                <option value="M">Month</option>
                <option value="Y">Year</option>
              </select>
            </label><br/>
            <label>Hide credits in the footer
              <input type="checkbox" name="hideFooter" checked={this.props.currentParams.hideFooter} onChange={this.handleUpdateParams}/>
            </label>
          </form>
        </div>
      );
    },

    render: function () {
      // Define record owner
      // In the future when Authentication feature will be implemented, this will be replaced by a function
      var owner = this.state.defaultUser;
      let main = null;
      if ( this.props.eValidate ) {
        main = (
          <MAMainCont
            docURL={this.props.docURL}
            connectId={this.props.connectId}
            owner={owner}
            currentParams={this.props.currentParams}
            loadCurrentParams={this.props.loadCurrentParams}
          />
        );
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
          <MAHeader title={this.state.title} updateOpenParam={this.updateOpenParam}/>
          {this.state.openParam && this.props.currentParams && this.displayParam()}
          {main}
          {!this.props.hideFooter && <MAFooter/>}
        </div>
      );
    }
});

module.exports = MainPage;
