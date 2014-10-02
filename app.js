var logger = require('./log');

var express = require('express');
var session = require('express-session');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var parseString = require('xml2js').parseString;
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
	res.render('index');
});
app.get('/list', function(req,res){
	res.render('list');
});
app.get('/detail', function(req,res){
	res.render('detail');
});
app.get('/api/connector/list', function(req,res){
	var dir = './connector/'; // your directory

	var files = fs.readdirSync(dir);
	
	var list = [];
	
	files.sort(function(a, b) {
	               return a - b;
	});

	for(var i=0;i<files.length;i++){
		if(files[i]!='.gitignore'){
			list.push(files[i]);
		}
	}

	res.json({ connectors: list });
});
app.get('/api/connector/detail/:name', function(req,res){
	
	var name = req.params.name;
	logger.info('Connector name: ' + name);
	
	var dir = './connector/';
	var filename = dir + name + '/' + name + '.xml';
	
	logger.info('Read configuration: ' + filename);
	fs.readFile(filename, "utf8", function (err, data) {
		// logger.info(err);
		// logger.info(data);
		
		parseString(data, function (err, result) {
			
		    res.end(JSON.stringify(result));
		});
		
	});
	
	
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

app.use(serveStatic(__dirname + "/www"));

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/');
});
app.listen(60000);