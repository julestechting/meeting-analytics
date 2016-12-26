var fs = require('fs');
var path = require('path');

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
      return {status: true, code: "OK"};
  }
  catch (error) {
    console.log(error);
    return {status: false, code: error};
  }
};
