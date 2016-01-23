var static = require('node-static');
var http = require('http');
var file = new static.Server('/home/jgirard/chall/challenge-C3-26/client/', {cache: 1800});

http.createServer(function (request, response) {
    file.serve(request, response, function (err, res) {
	if (err) {
	    console.error("> Error serving " + request.url + " - " + err.message);
	    response.writeHead(err.status, err.headers);
	    response.end();
	} else {
	    console.log("> " + request.url + " - " + res.message);
	}
    });
}).listen(9797);
