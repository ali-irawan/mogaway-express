var logger = require('./log');

var express = require('express');
var session = require('express-session');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(compression({
  threshold: 512
}))

// parse application/json
app.use(bodyParser.json())

// to support URL-encoded bodies
app.use( bodyParser.urlencoded({ extended: false }) ); 


app.use(session({
		secret: 'ApL78n!_hyJLzMonNyu',
		resave: true,
	    saveUninitialized: true
}));

app.get('/', function(req,res){
	var dir = './connector/'; // your directory

	var files = fs.readdirSync(dir);
	files.sort(function(a, b) {
	               return fs.statSync(dir + a).mtime.getTime() - 
	                      fs.statSync(dir + b).mtime.getTime();
	});
	
	res.render('welcome', { connectors: files });
});

/**
 * {
 *     connector: "...",
 *     proc: "...",
 *     params: []
 * }
 */
app.post('/query',function(req, res){
	
	var connector = req.body.name;
	var proc = req.body.proc;
	var params = req.body.params;
	
	logger.info("Connector: " + connector);
	logger.info("Procedure: " + proc);
	logger.info("Parameters: " + JSON.stringify(params));
	
	var connector = require("./connector/" + connector + '/' + connector + '-impl');
	res.json(connector[proc](params));
});

app.listen(60000);