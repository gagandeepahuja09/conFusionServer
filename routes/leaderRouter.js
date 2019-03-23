var express = require('express');
var bodyParser = require('body-parser');
var leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/').all(function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'type/plain' });
  next();
})
.get(function(req, res, next) {
  res.end('Will send all the leaderships to you!');
})
.post(function(req, res, next) {
  res.end('Will add the leaderships: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req, res, next) {
  res.end('Deleting all leaderships');
});

leaderRouter.route('/:leaderId').get(function(req, res, next) {
  res.end('Will send details of the leadership: ' + req.params.leaderId + ' to you!');
})
.put(function(req, res, next) {
  res.write('Updating the leadership: '+ req.params.leaderId + '.\n');
  res.end('Will update the leadership: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req, res, next) {
    res.end('Deleting leadership: ' + req.params.leaderId);
});

module.exports = leaderRouter;