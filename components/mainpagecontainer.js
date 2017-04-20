var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

// Import components
var MainPage = require('./mainpage');
var eDefs = require('./edefinitions');

var MainPageCont = React.createClass({

    propTypes: {
      docURL: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      return {
        eHost: "",
        ePort: 0,
        eValidate: false,
        hideFooter: false,
      };
    },

    checkAndInitIndices: function () {
      var self = this;
      var connectId = self.state.eHost + ':' + self.state.ePort;
      var client = new elasticsearch.Client({host: connectId, log: 'error'});
      // Default parameters
      var defaultParams = eDefs.eDefaultParams;

      // For each index, create it if it doesn't exist already
      eDefs.eIndices.map(function (eIndex) {
        if ( eIndex.index == "params" ) {
          var createdefaultParams = function () {
            client.index ({
              index: eIndex.index,
              type: eIndex.type,
              body: defaultParams
            });
          };

          client.indices.exists({index: eIndex.index}, function (err, res, status) {
            if ( !res ) {
              // ISSUE! INDICES CREATED EVEN IF ALREADY EXIST!
              // Generate a random string to use as index name - Used index name will be an alias
              var randomIndex = Math.random().toString(36).slice(5);
              client.indices.create({index: randomIndex, body: eIndex.body}, function (err, res, status) {
                if ( !err ) {
                  createdefaultParams();
                }
              });
            } else {
              client.search ({
                index: eIndex.index,
                body: {
                  query: {
                    match: {
                      owner: 'default'
                    }
                  }
                }
              }, function (err, res, status) {
                if ( !err ) {
                  if ( res.hits.total == 0 ) {
                    createdefaultParams();
                  } else {
                    // Retrieve value of hideFooter
                    var hideFooter = res.hits.hits[0]._source.hideFooter;
                    self.setState({hideFooter: hideFooter});
                  }
                }
              });
            }
          });
        } else {
          client.indices.exists({index: eIndex.index}, function (err, res, status) {
            if ( !res ) {
              // Generate a random string to use as index name - Used index name will be an alias
              var randomIndex = Math.random().toString(36).slice(5);
              client.indices.create({index: randomIndex, body: eIndex.body});
            }
          });
        }
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
      client.ping ({requestTimeout: 3000}, function (err, res, status) {
        if ( err ) {
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

    //getCurrentParams: function (owner)

    render: function () {
      var connectId = this.state.eHost + ':' + this.state.ePort;

      return (
        <MainPage
          connectId={connectId}
          docURL={this.props.docURL}
          hideFooter={this.state.hideFooter}
          eValidate={this.state.eValidate}
          updateEClient={this.updateEClient}
        />
      );
    }
});

module.exports = MainPageCont;
