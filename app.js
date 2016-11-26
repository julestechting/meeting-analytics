var React = require('react');
var ReactDOM = require('react-dom')
var MainPage = require('./components/mainpage');

ReactDOM.render(
  React.createElement(MainPage, null),
//<div className="w3-container w3-teal">Hello World!</div>,
document.getElementById('ma-app')
);
