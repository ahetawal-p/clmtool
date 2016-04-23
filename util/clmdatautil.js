/**
This file should contains all the query function connecting to postgres.
All of the function should return a promis object.
**/
var dbutil = require('./dbutil.js');
var Q = require('q');
var constants = require('./constants.js'); 

var extractActiveCampaignData = function(userInfo) {
	console.log("\nExtracting ____Active Campaign data____\n");
	return dbutil.query(constants.activeCampaignDataQuery,[userInfo.userName], false, false);
}

var extractTotalSalesCampaignData = function(userInfo) {
	console.log("\nExtracting ____Sales Campaign data____\n");
	var finalQuery = constants.totalSalesCampaignDataQuery;
	if('Member' === userInfo.userTitle){
		finalQuery = finalQuery + ' AND UPPER(TM1."FirstName")=($1)';
	}
    if('Member' === userInfo.userTitle){
	return dbutil.query(finalQuery,[userInfo.userName], false, false);
    }
    return dbutil.query(finalQuery, false);
}

var extractHeatMapData = function(userInfo) {
	console.log("\nExtracting ____Sales Heat Map data____ \n");
	return dbutil.query(constants.heatMapDataQuery, false, false);
}

var addNewCampaign = function(campaignInfo){
    console.log("\nAdding New Campaign \n");
    var deferred = Q.defer();
    dbutil.query(constants.getUserIDQuery, [campaignInfo.userName],true,false)
    	.then(function(result){
            dbutil.query(constants.addNewCampaignDataQuery,[campaignInfo.campaignName, campaignInfo.startDate, campaignInfo.endDate, result.UserID], true, false)
                .then(function(value){
                        console.log("Campaign inserted successfully !! with rows: " + value);
                        deferred.resolve(campaignInfo);
                    },function(error){
                        deferred.reject(error);
        });
    });
    return deferred.promise;    
}

module.exports = {
    extractActiveCampaignData : extractActiveCampaignData,
    extractTotalSalesCampaignData : extractTotalSalesCampaignData,
    extractHeatMapData : extractHeatMapData,
    addNewCampaign : addNewCampaign,
};