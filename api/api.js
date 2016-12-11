var express = require('express'),
    router = express.Router(),
    ics = require('./ics');

router.post ('/ics', function (req, res) {
  res.json(ics.icsParse(req.body));
});

router.get ('/', function (req, res) {
    res.send("Welcome to the API!");
});

module.exports = router;
