var express = require('express');
var app = express();
var http = require('http');
var SparqlClient = require('sparql-client');
var util = require('util');
var bodyParser = require('body-parser');
var crypto = require('crypto');


app.use( bodyParser.json() );       // to support JSON-encoded bodies

var queryResults = {};

var performSPARQLQuery = function(query, hash) {
	var endpoint = 'http://dbpedia.org/sparql';
	// Get the leaderName(s) of the given citys
	// if you do not bind any city, it returns 10 random leaderNames
	//	var query = "select distinct ?Concept where {[] a ?Concept} LIMIT 10";
	var client = new SparqlClient(endpoint);

	var prefixes = "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n";
	prefixes += "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n";
	prefixes += "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";
	prefixes += "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n";
	prefixes += "PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n";
	prefixes += "PREFIX dc: <http://purl.org/dc/elements/1.1/>\n";
	prefixes += "PREFIX : <http://dbpedia.org/resource/>\n";
	prefixes += "PREFIX dbpedia2: <http://dbpedia.org/property/>\n";
	//prefixes += "PREFIX dbpedia: <http://dbpedia.org/>\n";
	prefixes += "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n";
	query = prefixes + query;
	
	//	console.log("Query to " + endpoint);
	console.log("Hash: " + hash);
	console.log("Query: " + query);
	queryResults[hash] = {"error":"Result not ready", "errId":42};
	client.query(query)
	  .execute(function(error, results) {
			console.log("SPARQL Query executed");
	  		//console.log(util.inspect(arguments, null, 20, true))
	  		var result;
	  		if (error) {
	  			result = {'error': error };
	  		} else {
	  			result = results;
	  		}
			//console.log(result);
			//console.log(hash);	
	  		queryResults[hash] = result;
		});
};

// cross-domain fix
app.all('/', function(req, res, next) {
      	res.header("Access-Control-Allow-Origin", "*");
      	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.get('/blarql/:hash', function(req, res) {
	var digest = req.params.hash;
	console.log('Request for hash:' + digest);
	var results = queryResults[digest];
	console.log(queryResults);
	if (!results) {
		res.status(404).send('Query result not found.');
	}
	res.json(results);
});

app.post('/blarql', function(req, res) {
	//console.log(req);
	var query = req.body.query;
	if (!query) {
		return res.status(400).send('Bad Request');
	}
	console.log("GOT QUERY: " + query);
	var hash = crypto.createHash('sha1');
	hash.update(query);
	var digest = hash.digest('hex');
	if (!queryResults[digest]) {
		performSPARQLQuery(query, digest);
	}
	res.json({"query":req.body.query, "hash": digest});
});

app.use(express.static(__dirname + '/client'));

/*app.get('/', function(req, res) {
	res.send('<h1>BLARQL de GIGA ANTON</h1>');
});*/


app.listen(3000);



