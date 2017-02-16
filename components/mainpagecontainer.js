var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

// Import components
var MainPage = require('./mainpage');

var MainPageCont = React.createClass({

    propTypes: {
      docURL: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        eIndices: ["meeting", "param"],
        eHost: "",
        ePort: 0,
        eValidate: false
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
              client.indices.create({index: ind});
            }
          })
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
                 // Send alert message (Unable to update Elasticsearch settings")
               }
           })}
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

    updateEClient: function (isSubmit, eHostOrePort, value) {
      if ( isSubmit ) {
        this.setEClient();
      } else {
        // eHostOrePort == true ==> update eHost
        // eHostOrePort == false ==> update ePort
        if ( eHostOrePort ) {
          this.setState({eHost: value});
        } else {
          this.setState({ePort: value});
        }
      }
    },

    render: function () {
      var connectId = this.state.eHost + ':' + this.state.ePort;

      return (
        <MainPage connectId={connectId} docURL={this.props.docURL} meetingIndex={this.state.eIndices[0]} eValidate={this.state.eValidate} updateEClient={this.updateEClient} />
      );
    }
});

module.exports = MainPageCont;
