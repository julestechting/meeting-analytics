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
      flushCurrentParams: React.PropTypes.func.isRequired,
      setParams: React.PropTypes.func.isRequired,
      getParamsWithCallback: React.PropTypes.func.isRequired
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

    switchOpenParam: function () {
      if ( this.state.openParam ) {
        // Flush currentParams and close params panel
        this.props.flushCurrentParams();
        this.setState({openParam: false});
      } else {
        // Load currentParams and open params panel
        this.props.loadCurrentParams(this.state.defaultUser);
        this.setState({openParam: true});
      }
    },

    handleUpdateParams: function (event) {
      if ( event.target.name == "close" ) {
        // No need to check if openParam is false as Close button is only visible when openParam is true
        this.switchOpenParam();
      } else {
        const value = event.target.name === "hideFooter" ? event.target.checked : event.target.value;
        this.props.setParams(event.target.name, value, this.state.defaultUser);
      }
    },

    displayParam: function () {
      const buttonStyle = { width: '50px' };

      return (
        <div className="w3-row w3-margin w3-padding-16 w3-topbar w3-bottombar w3-border-orange">
          <button name="close" onClick={this.handleUpdateParams} className="w3-col w3-left w3-hide-small w3-padding-small w3-button w3-white w3-border w3-border-white w3-hover-white w3-hover-border-orange" style={buttonStyle}><img src="img/closebtn.png"/></button>
          <div className="w3-rest w3-container w3-padding-small">
            <h4>Parameters</h4>
            <table className="w3-table w3-striped w3-reponsive">
              <tr>
                <td>Global search range:</td>
                <td>
                  <input type="number" name="defaultDuration" min="0" value={this.props.currentParams.defaultDuration} onChange={this.handleUpdateParams} className="w3-input w3-border"/>
                </td>
                <td>
                  <select name="defaultDurationUnit" value={this.props.currentParams.defaultDurationUnit} onChange={this.handleUpdateParams} className="w3-select">
                    <option value="H">Hour</option>
                    <option value="d">Day</option>
                    <option value="w">Week</option>
                    <option value="M">Month</option>
                    <option value="y">Year</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Hide credits in the footer</td>
                <td>
                  <input type="checkbox" name="hideFooter" checked={this.props.currentParams.hideFooter} onChange={this.handleUpdateParams} className="w3-check"/>
                </td>
              </tr>
            </table>
          </div>
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
            getParamsWithCallback={this.props.getParamsWithCallback}
          />
        );
      } else {
        main = (
          <div className="w3-margin w3-padding w3-topbar w3-bottombar w3-border-cyan">
            <div>Please update the Elasticsearch connection settings</div>
            <form className="w3-container" onSubmit={this.handleESubmit}>
              <label>Host
                <input type="text" name="host" onChange={this.handleUpdateEClient} required className="w3-input w3-border"/>
              </label>
              <label>Port
                <input type="number" name="port" min="1" onChange={this.handleUpdateEClient} required className="w3-input w3-border"/>
              </label>
              <input type="submit" name="submit" value="Submit" className="w3-input w3-section w3-orange"/>
            </form>
          </div>
        );
      }

      return (
        <div>
          <MAHeader title={this.state.title} switchOpenParam={this.switchOpenParam} eValidate={this.props.eValidate}/>
          {this.state.openParam && this.props.currentParams && this.displayParam()}
          {main}
          {!this.props.hideFooter && <MAFooter/>}
        </div>
      );
    }
});

module.exports = MainPage;
