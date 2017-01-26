var fs = require('fs');
var path = require('path');
var elasticsearch = require('elasticsearch');

exports.getClient = function () {
  try {
    var confFile = fs.readFileSync(__dirname + '/../elastic.json', 'utf-8');
    return JSON.parse(confFile);
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

exports.setClient = function (settings) {
  try {
      fs.writeFileSync(__dirname + '/../elastic.json', settings, 'utf-8', 664);
      return {status: true};
  }
  catch (error) {
    console.log(error);
    return {status: false};
  }
};

exports.eping = function (res, connect_id) {
  var client = new elasticsearch.Client({host: connect_id, log: 'error'});
  client.ping ({requestTimeout: 30}, function (err, response, status) {
      if (err) {
        res.json({ping: false});
      } else {
        res.json({ping: true});
      }
    });
};
