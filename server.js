var express = require('express'),
  path = require('path'),
  app = express(),
  bodyParser = require('body-parser'),
  api = require('./api/api');

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);

app.use('/', express.static(path.join(__dirname,'/public')));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
