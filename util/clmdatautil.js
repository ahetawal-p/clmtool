/**
This file should contains all the query function connecting to postgres.
All of the function should return a promis object.

**/

var dbutil = require('./dbutil.js');
var Q = require('q');

var extractActiveCampaignData = function(userInfo) {
	console.log("Active Campaingn -- " + userInfo.userName);
	var deferred = Q.defer();
	deferred.resolve("Active");
	return deferred.promise;
}


var extractTotalSalesCampaignData = function(userInfo) {
	var deferred = Q.defer();
	setTimeout(function(){
		console.log("Sales Campaingn -- " + userInfo.userName);
		deferred.resolve("Sales");
	}, 1000);
	return deferred.promise;
}


var extractTopCampaignData = function(userInfo){
	var deferred = Q.defer();
	setTimeout(function(){
		console.log("TOP Campaingns -- " + userInfo.userName);
		deferred.resolve("Top");
	}, 1000);
	return deferred.promise;	
}

/**
Form all your queries like this, with parameterized values, and 
then just return.
This will actually return an array of values/rows
**/

var sampleTOBEUsed = function(userInfo){

	// Pass in false for arrays, and if its a single value pass in as True.
	// See more in dbutil.js what parameters the .query() function takes in.

	return dbUtil.query("SELECT COUNT(*) FROM Campaingn where email=($1) and name=($2)", 
						[userInfo.userEmail, userInfo.userName], false);


}

module.exports = {
    extractActiveCampaignData : extractActiveCampaignData,
    extractTotalSalesCampaignData : extractTotalSalesCampaignData,
    extractTopCampaignData : extractTopCampaignData
};