var express = require('express');
var request = require('superagent');
var config = require('./config').module;
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

app.use(express.static(__dirname + '/public'));


var NON_INTERACTIVE_CLIENT_ID = config.client_id;
var NON_INTERACTIVE_CLIENT_SECRET = config.client_secret;

var authData = {
  client_id: NON_INTERACTIVE_CLIENT_ID,
  client_secret: NON_INTERACTIVE_CLIENT_SECRET,
  grant_type: 'client_credentials',
  audience: config.auth0_audience
}

// First, authenticate this client and get an access_token
// This could be cached
function getAccessToken(req, res, next) {
  request
    .post(`https://${config.auth0_domain}.auth0.com/oauth/token`)
    .send(authData)
    .end(function(err, res) {
      req.access_token = res.body.access_token
      next();
    })
}

app.get('/', function(req, res) {
  res.render('index');
})

app.get('/movies', getAccessToken, function(req, res) {
  request
    .get(`${config.api_host}/movies`)
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      console.log(data);
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('movies', {
          movies: movies
        });
      }
    })
})

app.get('/authors', getAccessToken, function(req, res) {
  request
    .get(`${config.api_host}/reviewers`)
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var authors = data.body;
        res.render('authors', {
          authors: authors
        });
      }
    })
})

app.get('/publications', getAccessToken, function(req, res) {
  request
    .get(`${config.api_host}/publications`)
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var publications = data.body;
        res.render('publications', {
          publications: publications
        });
      }
    })
})

app.get('/pending', getAccessToken, function(req, res) {
  request
    .get(`${config.api_host}/pending`)
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function(err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('pending', {
          movies: movies
        });
      }
    })
})

module.exports = app;
