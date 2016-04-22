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
var salesAcrossStatesSequence = [clmdatautil.extractTotalSalesCampaignData, clmgraphutil.genSalesAcrossStatesGraph];
var topSalesPerformersSequence = [clmgraphutil.genTopPerformersHeatGraph];
var addNewCampaignSequence = [
					clmdatautil.addNewCampaign, 
					clmdatautil.extractActiveCampaignData, 
					clmgraphutil.genActiveCampaignGraph
				];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tester', function(req, res, next) {
  res.render('tester', { title: 'Express' });
});

router.post('/addcampaign', function(req, res, next) {
	var body = req.body;
	var addCampaignObject = {
		"campaignName" : body.campaign_name,
		"startDate" : body.start_date,
		"endDate" : body.end_date,
		"userName" :  body.user_name.toUpperCase(),
	}
	console.log("Add campaign Input: " + JSON.stringify(addCampaignObject));
	
	Q.allSettled([runSequence(addCampaignObject, addNewCampaignSequence)])
		.spread(function(result){
			if(result.state === 'fulfilled') {
				console.log("All steps completed > " + JSON.stringify(result));
				res.send('Added');
			} else {
				res.send("Check data for the new campaign");
			}

		});
});




/* POST User Sing In */
router.post('/signin', function(req, res, next) {
	var body = req.body;
	var userInfoObject = {
		"userName" : body.user_name.toUpperCase(),
		"userEmail" : body.user_email,
		"userTitle" : body.user_job,
	}
	
	console.log("User Input: " + JSON.stringify(userInfoObject));
	
	if('Supervisor' === userInfoObject.userTitle){
		generateSupervisorDashboard(userInfoObject, res, next);
	} else {
		generateUserDashboard(userInfoObject, res, next);
	}

});


/**
Method used for generating USER dashabord.
Note: Pay close attention to Q.AllSettled arraylist passed. Its used 
for all the queries and graphing logic needed for creating user dashabord.
**/
var generateUserDashboard = function(userInfo, res, next) {
	
	// Run all sequences in parallel, and then generate the FINAL dashboard for the user	
	Q.allSettled([
					runSequence(userInfo, activeCampaignSequence), 
				  	runSequence(userInfo, totalSalesCampaignSequence)
				 ]).spread(function(g1, g2){

		console.log("User Graph1 data " + JSON.stringify(g1));
		console.log("User Graph2 data " + JSON.stringify(g2));
		
		var dashboard_json = {
			    "rows": [
				    [{"plot_url": g1.value.url}],
				    [{"plot_url": g2.value.url}]
			    ]
    	};

    	getDashboardUrlAndSendResponse(dashboard_json, userInfo, res, false, next);
	})
}



/**
Method used for generating SUPERVISOR dashabord.
Note: Pay close attention to Q.AllSettled arraylist passed. Its used 
for all the queries and graphing logic needed for creating user dashabord.
**/
var generateSupervisorDashboard = function(userInfo, res, next) {
	// Run all sequences in parallel, and then generate the FINAL dashboard for the user	
	Q.allSettled([
					runSequence(userInfo, topSalesPerformersSequence),
					runSequence(userInfo, salesAcrossStatesSequence)
				 ]).spread(function(g1, g2){

		console.log("SuperVisor Graph1 data " + JSON.stringify(g1));
		console.log("SuperVisor Graph2 data " + JSON.stringify(g2));
		
		var dashboard_json = {
			    "rows": [
				    [{"plot_url": g1.value.url}],
				    [{"plot_url": g2.value.url}]
			    ]
		};
		
		getDashboardUrlAndSendResponse(dashboard_json, userInfo, res, true, next);
    	
    	
	})
}


/**
Common mehtod used for generating dashboard on plotly and then responding
back with the dashbaord url which is displayed in an iFrame on the webpage
**/
var getDashboardUrlAndSendResponse = function(partial_dashboard_json, userInfo, res, isSupervisor, next){

	// common props for dashboard payload required by plotly
	var viewerName = "userview";

	var common_json = {
			"banner": {
			    "visible": true,
			    "backgroundcolor": "#3d4a57",
			    "textcolor": "white",
			    "title": "Welcome " + userInfo.userName  + "!",
			    "links": []
			},
			 "requireauth": false,
			 "auth": {
			   	"username": "",
			   	"passphrase": ""
			 }
		};

	// Copying both partial and common dashboard json into a new final payload object.
	var finalPayload = Object.assign({}, partial_dashboard_json, common_json);
	
	// Appending custom title if Supervisor
	if(isSupervisor){
		finalPayload.banner.title += "  (Supervisor view)";
		viewerName = "supervisorview";
	}

	try {
		var myData = 'dashboard=' + encodeURIComponent(JSON.stringify(finalPayload));
    	//console.log(myData);
    	unirest.post('https://dashboards.ly/publish')
    	.headers({'content-type': 'application/x-www-form-urlencoded'})
    	.send(myData)
    	.end(function(resposne){
    		console.log(resposne.body.url);
    		var newDashboardUrl = 'https://dashboards.ly' + resposne.body.url;
    	 	//var newDashboardUrl = "http://www.cnn.com";
    	 	res.render(viewerName, { title: 'CLM Dashboard', url: newDashboardUrl, dashName: userInfo.userName });

    	 });
    } catch(e) {
    	console.log(e);
    	next(e);
    }
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
