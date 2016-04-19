var express = require('express');
var router = express.Router();
var plotlyutil = require('../util/plotlyutil.js');
var Q = require('q');
var unirest = require('unirest');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/signin', function(req, res, next) {
	var body = req.body;
	console.log(JSON.stringify(body));
	generateDashboard(res);

  	
});


var generateDashboard = function(res) {
		
	Q.allSettled([genGraph1(), genGraph2()]).spread(function(g1, g2){

		console.log("Graph1 data " + JSON.stringify(g1));
		console.log("Graph2 data " + JSON.stringify(g2));
		
		var dashboard_json = {
			    "rows": [
				    [{"plot_url": "https://plot.ly/~ahetawal/298/"}, {"plot_url": "https://plot.ly/~ahetawal/300/"}],
				    [{"plot_url": "https://plot.ly/~ahetawal/298"}]
			    ],
			    "banner": {
			    "visible": true,
			    "backgroundcolor": "#3d4a57",
			    "textcolor": "white",
			    "title": "Welcome Tanay !",
			    "links": []
			    },
			    "requireauth": false,
			    "auth": {
			    "username": "",
			    "passphrase": ""
			    }
    	};

    	var myData = 'dashboard=' + encodeURIComponent(JSON.stringify(dashboard_json));
    	unirest.post('https://dashboards.ly/publish')
    	.headers({'content-type': 'application/x-www-form-urlencoded'})
    	.send(myData)
    	.end(function(resposne){
    		console.log(resposne.body.url);
    		var newDashboardUrl = 'https://dashboards.ly' + resposne.body.url;
    		res.render('clmdata', { title: 'Express', url: newDashboardUrl });

    	})
	})
}

var genGraph1 = function(data){
	var data = [
		  {
		    x: ["giraffes", "orangutans", "monkeys"],
		    y: [20, 14, 23],
		    type: "bar"
		  }
	];
	var graphOptions = {filename: "basic-bar", fileopt: "overwrite", "world_readable":true};
	return plotlyutil.plotMe(data, graphOptions);
}


var genGraph2 = function(data){
	var data = [{
		  values: [19, 26, 55],
		  labels: ['Residential', 'Non-Residential', 'Utility'],
		  type: 'pie'
		}];

	var layout = {
	  height: 400,
	  width: 500
	};

	var graphOptions = {filename: "piechart", fileopt: "overwrite", layout: layout, "world_readable":true};
	return plotlyutil.plotMe(data, graphOptions);
}




module.exports = router;
