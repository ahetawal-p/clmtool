var express = require('express');
var router = express.Router();
var plotlyutil = require('../util/plotlyutil.js');
var Q = require('q');
var unirest = require('unirest');
var clmdatautil = require('../util/clmdatautil.js');
var clmgraphutil = require('../util/clmgraphutil.js');

// Add more sequences as we build more charts.
// DONT Forget to add respective extract queries and graph logic for each of the new sequences
var activeCampaignSequence = [clmdatautil.extractActiveCampaignData, clmgraphutil.genActiveCampaignGraph];
var totalSalesCampaignSequence = [clmdatautil.extractTotalSalesCampaignData, clmgraphutil.genSalesCampaignGraph];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST User Sing In */
router.post('/signin', function(req, res, next) {
	var body = req.body;
	var userInfoObject = {
		"userName" : body.user_name,
		"userEmail" : body.user_email,
		"userTitle" : body.user_job,
	}
	console.log("User Input: " + JSON.stringify(userInfoObject));
	generateDashboard(userInfoObject, res);
});


var generateDashboard = function(userInfo, res) {
	
	// Run all sequences in parallel, and then generate the FINAL dashboard for the user	
	Q.allSettled([
					runSequence(userInfo, activeCampaignSequence), 
				  	runSequence(userInfo, totalSalesCampaignSequence)

				 ]).spread(function(g1, g2){

		console.log("Graph1 data " + JSON.stringify(g1));
		console.log("Graph2 data " + JSON.stringify(g2));
		
		var dashboard_json = {
			    "rows": [
				    [{"plot_url": g1.value.url}, {"plot_url": g2.value.url}],
				    [{"plot_url": g1.value.url}]
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
    	console.log(myData);
    	// unirest.post('https://dashboards.ly/publish')
    	// .headers({'content-type': 'application/x-www-form-urlencoded'})
    	// .send(myData)
    	// .end(function(resposne){
    	// 	console.log(resposne.body.url);
    	// 	var newDashboardUrl = 'https://dashboards.ly' + resposne.body.url;
    	 	res.render('clmdata', { title: 'CLM Data', url: null, dashName: userInfo.userName });

    	// })
	})
}

/**
 Generalized Utility function to run array of promises in sequence.
 In this case run extract data first, and then pass that data to plotly graphing
**/
var runSequence = function(userInfo, processes){
	var result = Q(userInfo);
	processes.forEach(function(f){
		result = result.then(f);
	});
	return result;
}

module.exports = router;
