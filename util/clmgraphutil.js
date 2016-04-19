/**
This file should contain all the graphing logic for each type of graph.
An array of data rows will be passed in to each of the function here, 
to manipulate it and send to plotly for graphing.
**/

var plotlyutil = require('../util/plotlyutil.js');
var Q = require('q');

var genActiveCampaignGraph = function(data){
	console.log("Active graph " + data);
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


var genSalesCampaignGraph = function(data){
	console.log("Sales graph " + data);
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

module.exports = {
    genActiveCampaignGraph : genActiveCampaignGraph,
    genSalesCampaignGraph : genSalesCampaignGraph

};