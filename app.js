#!/usr/bin/env node
/**
 * Module dependencies.
 */
var path = require('path'),
		http = require('http'),
		express = require('express'),
		ejs = require('ejs'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		errorHandler = require('errorhandler'),
		config = require('./helpers/config');
var app = express();

// set environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//template engine
app.engine('html', require('ejs').renderFile);

//add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'angular')));
app.use(require('./routes'));

// development mode error handler
if ('development' == app.get('env')) {
	app.use(errorHandler());
}
http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});
