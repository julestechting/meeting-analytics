var express = require('express'),
  path = require('path'),
  app = express();

app.use(express.static(path.join(__dirname,'/public')));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
