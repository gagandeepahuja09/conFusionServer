var express = require('express');
var bodyParser = require('body-parser');
var promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/').all(function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'type/plain' });
  next();
});

promoRouter.route('/').get(function(req, res, next) {
  res.end('Will send all the promotions to you!');
});

promoRouter.route('/').post(function(req, res, next) {
  res.end('Will add the promotions: ' + req.body.name + ' with details: ' + req.body.description);
});

promoRouter.route('/').delete(function(req, res, next) {
  res.end('Deleting all promotions');
});

promoRouter.route('/:promotionsId').all(function(req, res, next) {
  res.writeHead(200, { 'Content-Type': 'type/plain' });
  next();
});

promoRouter.route('/:promotionsId').get(function(req, res, next) {
  res.end('Will send details of the promotions: ' + req.params.promotionsId + ' to you!Will send details of the promotions: ' + req.params.promotionsId + ' to you!');
});

promoRouter.route('/:promotionsId').put(function(req, res, next) {
  res.write('Updating the promotions: '+ req.params.promotionsId + '.\n');
  res.end('Will update the promotions: ' + req.body.name + ' with details: ' + req.body.description);
});

promoRouter.route('/:promotionsId').delete(function(req, res, next) {
    res.end('Deleting promotions: ' + req.params.promotionsId);
});

module.exports = promoRouter;
