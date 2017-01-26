var express = require('express'),
    router = express.Router(),
    ics = require('./ics'),
    client = require('./client');

// ICS file parsing
router.post ('/ics', function (req, res) {
  res.json(ics.icsParse(req.body));
});

// Elasticsearch get/set settings
router.route ('/client')
  .get (function (req, res) {
    res.json(client.getClient());
  })

  .post (function (req, res) {
    res.json(client.setClient(req.body));
  });

router.get ('/client/:connect_id', function (req, res) {
    client.eping(res, req.params.connect_id);
});

// Default
router.get ('/', function (req, res) {
    res.send("Welcome to the API!");
});

module.exports = router;
