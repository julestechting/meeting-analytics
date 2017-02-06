var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

// Import components
var MAHeader = require('./header');
var MAMainCont = require('./maincontainer');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    propTypes: {
      docURL: React.PropTypes.string.isRequired
    },
    getInitialState: function () {
      return {
        eIndices: ["meeting", "param"],
        eHost: "",
        ePort: 0,
        eValidate: false,
        title: "Meeting Analytics"
      };
    },

    checkAndInitIndices: function () {
      var self = this;
      var connectId = self.state.eHost + ':' + self.state.ePort;
      var client = new elasticsearch.Client({host: connectId, log: 'error'});
      this.state.eIndices.map(function (ind) {
        client.indices.exists({index: ind})
          .then(function (res) {
            if ( !res ) {
              client.indices.create({index: ind}, null);
            }
          })
      });
    },

    validateEClient: function () {
      var self = this;
      var connectId = this.state.eHost + ':' + this.state.ePort;
      var client = new elasticsearch.Client({host: connectId, log: 'error'});
      client.ping ({requestTimeout: 3000}, function (error) {
        if ( error ) {
          self.setState({eValidate: false});
        } else {
          self.checkAndInitIndices();
          self.setState({eValidate: true});
        }
      });
    },

    componentWillMount: function () {
      // Retrieve Elastic settings
      var self = this;
      fetch(this.props.docURL + 'api/client', {
        method: 'GET'})
         .then(function (res) {
           if (res) {
             return res.json().then(function (json) {
               self.setState({
                 eHost: json.host,
                 ePort: parseInt(json.port)
               });
               self.validateEClient();
           })}
         });
    },

    setEClient: function () {
      var eclient = JSON.stringify({host: this.state.eHost, port: this.state.ePort});
      var self = this;
      fetch(this.props.docURL + 'api/client', {
        method: 'POST',
        headers: {'Content-Type': 'text/plain'},
        body: eclient
      })
         .then(function (res) {
           if (res) {
             return res.json().then(function (json) {
               if ( json.status ) {
                 self.validateEClient();
               }
               else {
                 updateTopMessage("Unable to update Elasticsearch settings");
               }
           })}
         });
    },

    handleUpdateEClient: function (event) {
      if ( event.target.name == "host" ) {
          this.setState({eHost: event.target.value});
      } else if ( event.target.name == "port" ) {
          this.setState({ePort: event.target.value});
      } else {
          // Ignore
      }
      event.preventDefault();
    },

    handleESubmit: function (event) {
      // The required attribute in the form ensured states have been updated
      // No need to check again
      this.setEClient();
      event.preventDefault();
    },

    render: function () {
      let main = null;
      if ( this.state.eValidate ) {
        var connectId = this.state.eHost + ':' + this.state.ePort;
        main = (<MAMainCont docURL={this.props.docURL} connectId={connectId}/>);
      } else {
        main = (
          <div>
            <p>Please provide the Elasticsearch connection settings</p>
            <form onSubmit={this.handleESubmit}>
              <label>Host:
                <input type="text" name="host" value={this.state.eHost} onChange={this.handleUpdateEClient} required/>
              </label>
              <label>Port:
                <input type="number" name="port" min="1" value={this.state.ePort} onChange={this.handleUpdateEClient} required/>
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
      )
    }
});

module.exports = MainPage;
