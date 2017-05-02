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
        currentParams: null
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
                    bool: {
                      filter: [ {term: {owner: defaultParams.owner}} ]
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

    flushCurrentParams: function() {
      this.setState({currentParams: null});
    },

    loadCurrentParamsCallback: function (params) {
      this.setState({currentParams: params});
    },

    loadCurrentParams: function (currentUser) {
      var connectId = this.state.eHost + ':' + this.state.ePort;
      this.getParamsWithCallback(connectId, currentUser, this.loadCurrentParamsCallback);
    },

    getParamsWithCallback: function (connectId, currentUser, paramCallback) {
      var client = new elasticsearch.Client({host: connectId, log: 'error'});
      client.search ({
        index: eDefs.eLIndices.param,
        body: {
          query: {
            bool: {
              filter: [ {term: {owner: currentUser}} ]
            }
          }
        }
      }, function (err, res, status) {
        if ( ! err ) {
          if ( res.hits.total == 1 ) {
            var updatedParams = res.hits.hits[0]._source;
            // Add the document id for future updates
            updatedParams.id = res.hits.hits[0]._id;
            paramCallback(updatedParams);
          } else {
            // Oh oh! There shouldn't any other number of hits
            // Reset to default and don't insert any id
            paramCallback(eDefs.eDefaultParams);
          }
        } else {
          // Should probably notify of the error
        }
      });
    },

    setParams: function (name, value, currentUser) {
      var params = this.state.currentParams;
      params[name] = value;
      this.setState({currentParams: params});
      if ( name == "hideFooter") { this.setState({hideFooter: value}); }
      // If value is empty, don't send data to the engine
      if ( value != "" ) {
        // Data cleaning - removing zeros on the left of defaultDuration
        if ( name == "defaultDuration" ) {
          try {
            value = parseInt(value);
          } catch (err) {
            // In case of error, reset to default value
            value = eDefs.eDefaultParams.defaultDuration;
          }
        }
        // Update document in engine
        var connectId = this.state.eHost + ':' + this.state.ePort;
        var client = new elasticsearch.Client({host: connectId, log: 'error'});
        // Check if document exists already
        if ( params.id ) {
          var doc = {};
          doc[name]=value;
          client.update({
            index: eDefs.eLIndices.param,
            type: eDefs.eLIndices.paramType,
            id: params.id,
            body: {
              doc: doc
            }},
            function (err, res, status) {
              if ( err ) {
                // Should probably notify of the error
              }
            }
          );
        } else {
          var self = this;
          client.index({
            index: eDefs.eLIndices.param,
            type: eDefs.eLIndices.paramType,
            body: params
            },
            function (err, res, status) {
              if ( err ) {
                // Should probably notify of the error
              } else {
                // Insert new document id into params
                params.id = res._id;
                self.setState({currentParams: params});
              }
            }
          );
        }
      }
    },

    render: function () {
      var connectId = this.state.eHost + ':' + this.state.ePort;

      return (
        <MainPage
          connectId={connectId}
          docURL={this.props.docURL}
          hideFooter={this.state.hideFooter}
          eValidate={this.state.eValidate}
          updateEClient={this.updateEClient}
          currentParams={this.state.currentParams}
          loadCurrentParams={this.loadCurrentParams}
          flushCurrentParams={this.flushCurrentParams}
          setParams={this.setParams}
          getParamsWithCallback={this.getParamsWithCallback}
        />
      );
    }
});

module.exports = MainPageCont;
