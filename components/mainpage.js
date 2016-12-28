var React = require('react');
var fetch = require('node-fetch');
var elasticsearch = require('elasticsearch');

// Import components
var MAHeader = require('./header');
var MAMain = require('./main');
var MAFooter = require('./footer');

var MainPage = React.createClass({

    propTypes: {
      docURL: React.PropTypes.string.isRequired
    },
    getInitialState: function () {
      return {
        topMessage: "",
        title: "Meeting Analytics",
        ehost: "",
        eport: 0,
        evalidate: false
      };
    },

    validateEClient: function () {
      var self = this;
      var connect_id = this.state.ehost+':'+this.state.eport;
      var client = new elasticsearch.Client({host: connect_id, log: 'error'});
      client.ping ({requestTimeout: 3000}, function (error) {
        if ( error ) {
          self.setState({evalidate: false});
        } else {
          self.setState({evalidate: true});
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
                 ehost: json.host,
                 eport: parseInt(json.port)
               });
               self.validateEClient();
           })}
         });
    },

    setEClient: function () {
      var eclient = JSON.stringify({host: this.state.ehost, port: this.state.eport});
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
                 updateTopMessageHandler("Unable to update Elasticsearch settings");
               }
           })}
         });
    },

    handleUpdateEClient: function (event) {
      if ( event.target.name == "host" ) {
          this.setState({ehost: event.target.value});
      } else if ( event.target.name == "port" ) {
          this.setState({eport: event.target.value});
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

    updateTopMessageHandler (text) {
      this.setState({topMessage: text});
    },

    render: function () {
      // TO FINISH
      let main = null;
      if ( this.state.evalidate ) {
        main = (<MAMain updateTopMessageHandler={this.updateTopMessageHandler} docURL={this.props.docURL}/>);
      } else {
        main = (
          <div>
            <p>Please provide the Elasticsearch connection settings</p>
            <form onSubmit={this.handleESubmit}>
              <label>Host:
                <input type="text" name="host" value={this.state.ehost} onChange={this.handleUpdateEClient} required/>
              </label>
              <label>Port:
                <input type="number" name="port" min="1" value={this.state.eport}onChange={this.handleUpdateEClient} required/>
              </label>
              <input type="submit" name="submit" value="Submit"/>
            </form>
          </div>
        );
      }

      return (
        <div>
          <MAHeader topMessage={this.state.topMessage} title={this.state.title}/>
          {main}
          <MAFooter/>
        </div>
      )
    }
});

module.exports = MainPage;
