// Express initialization
var express = require('express');
var app = express(express.logger());
app.use(express.json());
app.use(express.urlencoded());
app.set('title', 'nodeapp');

// Cross-origin resource sharing
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Mongo initialization
var mongoUri = process.env.MONGOLAB_URI || 
    process.env.MONGOHQ_URL || 
    'mongodb://localhost/scorecenter';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
});

// Format time
function getTime()  {
    var cdate = new Date();
	var time = cdate.getMonth() + "/";
    time += cdate.getDay() + "/";
	time += cdate.getFullYear() + " ";
    time += cdate.getHours() + ":";
	if (cdate.getMinutes() < 10) {
    	time += "0" + cdate.getMinutes();
	}
    else {time += cdate.getMinutes()}
    return time;
}

app.get('/scores.json', function (request, response) {
	var usr = request.query.username;
	if (usr == null) {
		response.send([]);
	}
	else {
		db.collection('scores', function(er, collection) {
			collection.find({username: usr}).sort({score: -1}).toArray(function(err, results){
				if (!err) {
					response.send(results);
				}
			});
		});
	}
});

app.post('/submit.json', function(request, response) {
	var usr = request.body.username;
	var score = request.body.score;
	var grid = request.body.grid;
	if (usr == null || score == null || grid == null) {
		response.send("Bad data!");
	}
	else {
		var time = getTime();
		var record = {
			'username': usr,
			'score': score,
			'grid': grid,
			'created_at': time
		};
		db.collection('scores', function(er, collection) {
			if (!er) {
				collection.insert(record);
			}
		});
	}
});

app.get('/', function(request, response) {
	db.collection('scores', function(er, collection) {
		collection.find().sort({score: -1}).toArray(function(err, results) {
			if (!err) {
				var html = "<!DOCTYPE HTML><html><head><title>2048 Scores</title></head><body><h1>2048 Game Scores</h1><table><tr><th>Score</th><th>Username</th><th>Time</th></tr>";
				for (var i = 0; i < results.length; i++) {
					html += "<tr><td>" + results[i]['score'] + "</td><td>" + results[i]['username'] + "</td><td>" + results[i]['created_at'] + "</td></tr>";
				}
				html += "</table></body></html>"
				response.send(html);
			}
		});
	});
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web
// -process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);
