var express = require('express')
var jade = require('jade');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var os = require('os');

app.set('port', 8080);
app.set('views', path.resolve(__dirname, 'views'));
app.set('public', path.resolve(__dirname, 'public'));
app.set('json spaces', 4);

app.use(express.static( app.get('public') ));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(function (err, req, res, next){
  res.status(err.status || 500);
  log.error('Internal error(%d): %s',res.statusCode,err.message);
  res.send({ error: 'Error is occured!!! -> ' + err.message });
  return;
});
app.use(function (req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.get('/', function (req, res) {
  res.send( jade.renderFile(path.resolve(app.get('views'), 'index.jade'),
    { title: 'IPTV Dashboard' })
  );
});

app.listen(app.get('port'), function() {
  console.log('Listening on %s', app.get('port'));
});

