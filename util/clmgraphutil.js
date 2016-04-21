/**
This file should contain all the graphing logic for each type of graph.
An array of data rows will be passed in to each of the function here, 
to manipulate it and send to plotly for graphing.
**/

var plotlyutil = require('../util/plotlyutil.js');
var Q = require('q');

// TODO need to create grpah file specific to each user
var genActiveCampaignGraph = function(dbdata){
	console.log("Active graph " + JSON.stringify(dbdata));
	
	var xaxis = [];
	var yaxis = [];
	var fileName = "";

	// var myData = [
	// 		{"CampaignName":"C3","PhaseID":3, "FirstName": "Amit"},
	// 		{"CampaignName":"C4","PhaseID":4, "FirstName": "Amit"},
	// 		{"CampaignName":"C11","PhaseID":5, "FirstName": "Amit"},
	// 		{"CampaignName":"C7","PhaseID":7, "FirstName": "Amit"}
	// 	];
	
	var myData = dbdata;
	myData.forEach(function(results){
		console.log(results);
		yaxis.push(results.CampaignName);
		xaxis.push(results.PhaseID);
		fileName = "active_campaign_" + results.FirstName;
	});


	var data = [
		  {
		    x: xaxis,
		    y: yaxis,
		    type: "bar",
		    orientation: 'h',
		    marker:{
				color:"rgb(4, 158, 215)",
				line:{
					color:"white",
					width:0
				}
			}
		  }
	];

	var layout = {
			"autosize": true,
			"yaxis": {
				"tickfont": {
					"color": "black",
					"family": "\"Verdana\", monospace",
					"size": 14
				},
				"title": "Campaign Name",
				"ticks": "",
				"gridwidth": 1,
				"showgrid": false,
				"range": [-0.5, 10.5],
				"gridcolor": "white",
				"zeroline": false,
				"titlefont": {
					"color": "rgb(32, 18, 77)",
					"family": "\"Verdana\", monospace",
					"size": 16
				},
				"type": "category",
				"autorange": true
			},
			"paper_bgcolor": "rgb(229, 245, 249)",
			"plot_bgcolor": "rgb(229, 245, 249)",
			"title": "My Active Campaigns",
			"height": 626,
			"width": 1156,
			"titlefont": {
				"color": "rgb(32, 18, 77)",
				"size": 20
			},
			"xaxis": {
				"tickfont": {
					"color": "black",
					"family": "\"Verdana\", monospace",
					"size": 14
				},
				"title": "Phase",
				"gridwidth": 1,
				"showgrid": false,
				"range": [0, 7.368421052631579],
				"gridcolor": "white",
				"zeroline": false,
				"titlefont": {
					"color": "rgb(32, 18, 77)",
					"family": "\"Verdana\", monospace",
					"size": 16
				},
				"type": "linear",
				"autorange": true,
				ticktext : [
	                "DP",
	               	"Design",
	       		 	"Approval",
	               	"Go Live",
	               	"Campaign",     
	       			"Wrap-up",
	               	"Retro"
            	],
       			tickvals : [ 1, 2, 3, 4, 5, 6, 7]
			},
			"font": {
				"family": "\"Droid Sans\", sans-serif"
			}
		};

	var graphOptions = {filename: fileName, fileopt: "overwrite", "world_readable":true, "layout":layout};
	return plotlyutil.plotMe(data, graphOptions);
}



// TODO need to create grpah file specific to each user
var genSalesCampaignGraph = function(dbdata){
	console.log("Sales graph " + JSON.stringify(dbdata));
	

	var xaxis = [];
	var forecastAxis = [];
	var salesAxis = [];
	var fileName = "";

	// var myData = [
	// 			{"FirstName":"AMIT","CampaignName":"C11","StateCode":"CA","TotalSalesAmount_USD_ByCampaign":"53000","ForecastAmount_USD":200000,"TotalSalesAmount_USD_ByState":"53000"},
	// 			{"FirstName":"AMIT","CampaignName":"C7","StateCode":"WA","TotalSalesAmount_USD_ByCampaign":"33660","ForecastAmount_USD":160000,"TotalSalesAmount_USD_ByState":"33660"}
	// 		];
	
	var myData = dbdata;

	myData.forEach(function(results){
		console.log(results);
		xaxis.push(results.CampaignName);
		forecastAxis.push(results.ForecastAmount_USD);
		salesAxis.push(results.TotalSalesAmount_USD_ByCampaign);
		fileName = "sales_campaign_" + results.FirstName;
	});

	var salesTrace = {
		  x: xaxis,
		  y: salesAxis,
		  name: 'Sales',
		  type: 'bar'
	};

	var forecastTrace = {
		  x: xaxis,
		  y: forecastAxis,
		  marker: {
    		color: 'rgba(24, 24, 189, 0.4)'
  		 },
  		name: 'Forecast',
  		type: 'bar'
	};

	var data = [salesTrace, forecastTrace];

	var layout = {
		title: 'Sales vs Forecast',
		barmode: 'group',
		xaxis: {
		  title: 'Campaign Name'
		},
		yaxis: {
		  title: 'USD'
		}
	};
	
	var graphOptions = {filename: fileName, fileopt: "overwrite", layout: layout, "world_readable":true};
	return plotlyutil.plotMe(data, graphOptions);
}


var genSalesAcrossStatesGraph = function(dbdata){
	console.log("Sales State graph " + JSON.stringify(dbdata));
	var locationAxis = [];
	var zAxis = [];
	var fileName = "";

	// var myData = [
	// 			{"FirstName":"AMIT","CampaignName":"C11","StateCode":"CA","TotalSalesAmount_USD_ByCampaign":"53000","ForecastAmount_USD":200000,"TotalSalesAmount_USD_ByState":"53000"},
	// 			{"FirstName":"AMIT","CampaignName":"C7","StateCode":"WA","TotalSalesAmount_USD_ByCampaign":"33660","ForecastAmount_USD":160000,"TotalSalesAmount_USD_ByState":"33660"}
	// 		];

	var myData = dbdata;
	myData.forEach(function(results){
		console.log(results);
		locationAxis.push(results.StateCode);
		zAxis.push(results.TotalSalesAmount_USD_ByState);
		fileName = "sales_states_campaign_" + results.FirstName;
	});

	var data = [{
			"colorbar": {
				"bgcolor": "rgba(0, 0, 0, 0)"
			},
			"autocolorscale": false,
			"zmax": 70000,
			"uid": "94a168",
			"colorscale": [
				[0, "rgb(5,10,172)"],
				[0.35, "rgb(40,60,190)"],
				[0.5, "rgb(70,100,245)"],
				[0.6, "rgb(90,120,245)"],
				[0.7, "rgb(106,137,247)"],
				[1, "rgb(220,220,220)"]
			],
			"zmin": 10000,
			"locations": locationAxis,
			"reversescale": true,
			"type": "choropleth",
			"z": zAxis,
			"locationmode": "USA-states",
			"zauto": false
		}];

	var layout = {
			"autosize": true,
			"title": "Total Sales across States",
			"paper_bgcolor": "rgb(229, 245, 249)",
			"height": 700,
			"width": 1256,
			"titlefont": {
				"size": 20
			},
			"geo": {
				"scope": "usa",
				"bgcolor": "rgb(229, 245, 249)"
			}
	};

	var graphOptions = {filename: fileName, fileopt: "overwrite", layout: layout, "world_readable":true};
	return plotlyutil.plotMe(data, graphOptions);

}


var genTopPerformersHeatGraph = function(dbdata){
	console.log("Top Performers heat graph " + JSON.stringify(dbdata));
	var yAxis = [];
	var zAxis = [];
	var xAxis = []
	var fileName = "top_performers_sales";

	var myData = [
				{"FirstName":"AMIT","Quater":"Q1 2015","Sales":"700"},
				{"FirstName":"AMIT","Quater":"Q2 2015","Sales":"450"},
				{"FirstName":"AMIT","Quater":"Q3 2015","Sales":"900"},
				{"FirstName":"AMIT","Quater":"Q4 2015","Sales":"250"},

				{"FirstName":"Shea","Quater":"Q1 2015","Sales":"100"},
				{"FirstName":"Shea","Quater":"Q2 2015","Sales":"200"},
				{"FirstName":"Shea","Quater":"Q3 2015","Sales":"300"},
				{"FirstName":"Shea","Quater":"Q4 2015","Sales":"600"},

				{"FirstName":"Prachi","Quater":"Q1 2015","Sales":"800"},
				{"FirstName":"Prachi","Quater":"Q2 2015","Sales":"50"},
				{"FirstName":"Prachi","Quater":"Q3 2015","Sales":"700"},
				{"FirstName":"Prachi","Quater":"Q4 2015","Sales":"100"},

				{"FirstName":"Ramyata","Quater":"Q1 2015","Sales":"50"},
				{"FirstName":"Ramyata","Quater":"Q2 2015","Sales":"100"},
				{"FirstName":"Ramyata","Quater":"Q3 2015","Sales":"150"},
				{"FirstName":"Ramyata","Quater":"Q4 2015","Sales":"350"}
			];

	//var myData = dbdata;
	myData.forEach(function(results){
		console.log(results);
		xAxis.push(results.Quater);
		yAxis.push(results.FirstName);
		zAxis.push(results.Sales);
	});

	var data = [{
			"autocolorscale": false,
			//"zmax": 1200,
			"colorscale": [
				[0, "rgb(5,10,172)"],
				[0.35, "rgb(40,60,190)"],
				[0.5, "rgb(70,100,245)"],
				[0.6, "rgb(90,120,245)"],
				[0.7, "rgb(106,137,247)"],
				[1, "rgb(220,220,220)"]
			],
			"zmin": 100,
			"reversescale": true,
			"y": yAxis,
			"x": xAxis,
			"z": zAxis,
			"type": "heatmap"
		}];

	var layout = {
		"autosize": true,
		"yaxis": {
			"range": [-0.5, 4.5],
			"type": "category",
			"autorange": true
		},
		"title": "Top Sales Performers by Quarter",
		"height": 700,
		"width": 1120,
		"titlefont": {
			"size": 22
		},
		"xaxis": {
			"range": [-0.5, 7.5],
			"type": "category",
			"autorange": true
		},
		"font": {
			"size": 14
		}
	};

	var graphOptions = {filename: fileName, fileopt: "overwrite", layout: layout, "world_readable":true};
	return plotlyutil.plotMe(data, graphOptions);

}


var genTopCampaignGraph = function(dbdata) {
	console.log("Top Campaign graph " + dbdata);
	var data = [
		  {
		    x: ["C1", "C2", "C3"],
		    y: [20, 14, 23],
		    type: "bar"
		  }
	];
	var graphOptions = {filename: "top-campaigns", fileopt: "overwrite", "world_readable":true};
	return plotlyutil.plotMe(data, graphOptions);

}


module.exports = {
    genActiveCampaignGraph : genActiveCampaignGraph,
    genSalesCampaignGraph : genSalesCampaignGraph,
    genTopCampaignGraph : genTopCampaignGraph,
    genSalesAcrossStatesGraph: genSalesAcrossStatesGraph,
    genTopPerformersHeatGraph: genTopPerformersHeatGraph

};