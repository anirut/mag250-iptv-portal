require('consoleplusplus');
var express = require('express')
var jade = require('jade');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var fsGrubber = require('./fs-grubber.js');
// var exGrubber = require('./ex-grubber.js');

app.set('port', 8080);
app.set('views', path.resolve(__dirname, 'views'));
app.set('public', path.resolve(__dirname, 'public'));
app.set('json spaces', 4);

app.use(express.static( app.get('public') ));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  console.error('Internal error(%d): %s',res.statusCode,err.message);
  res.send({ error: 'Error is occured!!! -> ' + err.message });
  return;
});
app.use(function(req, res, next){
  console.info('%s %s', req.method, req.url);
  next();
});

app.get('/', function(req, res) {
  fsGrubber.films.init(function(data) {
    res.send( jade.renderFile(path.resolve(app.get('views'), 'index.jade'),
      { data: data.error || data })
    );
  });
});
app.get('/getStream', function(req, res) {
  fsGrubber.films.getStream(req.query.url, function(data) {
    var tmpStream = typeof data.stream == 'object' ? data.stream[0] : data.stream;
    console.debug('Stream: %s', data.error ? null : tmpStream);
    res.json(data.error ? null : tmpStream);
  });
});

app.listen(app.get('port'), function() {
  console.info('Listening on %s', app.get('port'));
});

