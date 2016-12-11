var React = require('react');
var ReactDOM = require('react-dom')
var MainPage = require('./components/mainpage');

ReactDOM.render(
  React.createElement(MainPage, {docURL: document.URL}),
  document.getElementById('ma-app')
);
