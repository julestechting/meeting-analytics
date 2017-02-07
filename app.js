var React = require('react');
var ReactDOM = require('react-dom')
var MainPageCont = require('./components/mainpagecontainer');

ReactDOM.render(
  React.createElement(MainPageCont, {docURL: document.URL}),
  document.getElementById('ma-app')
);
