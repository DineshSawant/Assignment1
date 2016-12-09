var express = require("express");
var app = express();

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/users', function(req, res) {
	// console.log(req.query);
	response = {
	   "success": true,
	   "total": 9	   
	};
	// Prepare output in JSON format
	if(req.query.page == 1) {
		response.users = [
	        { id: 1, fName: 'Lisa', lName: 'Joy', email: 'lisa@gmail.com', phone: '555-111-1224', birthDate: '20/09/1988' },
	        { id: 2, fName: 'Bart', lName: 'Gim', email: 'bart@gmail.com', phone: '555-222-1234', birthDate: '20/09/1988' },
	        { id: 3, fName: 'Homer', lName: 'Cri', email: 'home@gmail.com', phone: '555-222-1244', birthDate: '20/09/1988' }
	    ]
	}else if(req.query.page == 2) {
		response.users = [
	        { id: 4, fName: 'Marge', lName: 'Winy', email: 'marge@gmail.com', phone: '555-222-1254', birthDate: '20/09/1988' },
	        { id: 5, fName: 'Sachin', lName: 'Khedkar', email: 'sachin@gmail.com', phone: '555-222-1244', birthDate: '20/09/1988' },
	        { id: 6, fName: 'Rohit', lName: 'Patil', email: 'rohit@gmail.com', phone: '555-222-1244', birthDate: '20/09/1988' }
	    ]
	}else {
		response.users = [
			{ id: 7, fName: 'Jay', lName: 'Mishra', email: 'jsy@gmail.com', phone: '555-222-1244', birthDate: '20/09/1988' },
	        { id: 8, fName: 'DS', lName: 'Mulani', email: 'ds@gmail.com', phone: '555-222-1244', birthDate: '20/09/1988' },
	        { id: 9, fName: 'KD', lName: 'Deshmukh', email: 'kd@gmail.com', phone: '555-222-1244', birthDate: '20/09/1988' }
	    ]
	}
   	res.end(JSON.stringify(response));
});

var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Example app listening at http://%s:%s", host, port);
});