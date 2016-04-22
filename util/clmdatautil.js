/**
This file should contains all the query function connecting to postgres.
All of the function should return a promis object.
**/
var dbutil = require('./dbutil.js');
var Q = require('q');
var multiline=require('multiline'); 

var extractActiveCampaignDataQuery = multiline.stripIndent(function(){/*
SELECT
	DISTINCT UPPER(TM1."FirstName") "FirstName"
	, C1."CampaignName" 
	, P1."PhaseID" 
	, P1."PhaseName" 
FROM
	"Campaign" C1 
		JOIN "Phase" P1 
		ON C1."CampaignPhaseID"=P1."PhaseID" 
		JOIN "Users" AS TM1 
		ON C1."UserID"=TM1."UserID" 
WHERE
	UPPER(C1."IsCampaignApproved")='Y'
	AND CURRENT_DATE BETWEEN C1."CampaignStartDate" 
	AND C1."CampaignEndDate"
	AND UPPER(TM1."FirstName")=($1)
ORDER BY
	P1."PhaseID"
	*/});



var extractTotalSalesCampaignDataQuery = multiline.stripIndent(function(){/*
SELECT
	DISTINCT UPPER(TM1."FirstName") "FirstName"
	, C1."CampaignName" 
	, S1."StateCode" 
	, SUM(COALESCE(CDS1."SalesAmount_USD" , 0)) over (PARTITION BY C1."CampaignID") "TotalSalesAmount_USD_ByCampaign" 
	, CF1."ForecastAmount_USD" 
	, SUM(COALESCE(CDS1."SalesAmount_USD" , 0)) over (PARTITION BY S1."StateCode") "TotalSalesAmount_USD_ByState" 
FROM
	"Campaign" C1 
		JOIN "Phase" P1 
		ON C1."CampaignPhaseID"=P1."PhaseID"  
		JOIN "CampaignDailySales" CDS1 
		ON C1."CampaignID"=CDS1."CampaignID" 
		JOIN "CampaignForecast" CF1 
		ON c1."CampaignID"=CF1."CampaignID" 
		JOIN "Store" S1 
		ON c1."StoreID"=s1."StoreID" 
		JOIN "Users" AS TM1 
		ON C1."UserID"=TM1."UserID"
WHERE
	UPPER(C1."IsCampaignApproved") = 'Y' 
	AND CURRENT_DATE BETWEEN C1."CampaignStartDate" 
	AND C1."CampaignEndDate"
	AND UPPER(TM1."FirstName")=($1)
	*/});


var addNewCampaignDataQuery = multiline.stripIndent(function(){/*
INSERT
INTO
	PUBLIC.Campaign(CampaignName , CampaignStartDate , CampaignEndDate, UserID , CampaignPhaseID , IsCampaignApproved , Created_TS , 
	Updated_TS) 
VALUES
	(
		($1) , ($2) , ($3) , ($4), 1, 'N' , CURRENT_DATE , CURRENT_DATE
	)
*/});

// Get UserID
var getUserIDQuery = multiline.stripIndent(function(){/*
SELECT
	DISTINCT "UserID" 
FROM
	"Users" 
WHERE
	"FirstName"=($1)
*/});

//Replace newline & tabs with a single space.
extractActiveCampaignDataQuery = extractActiveCampaignDataQuery.replace(/\n/g, ' ').replace(/\t/g,' ');
extractTotalSalesCampaignDataQuery = extractTotalSalesCampaignDataQuery.replace(/\n/g, ' ').replace(/\t/g,' ');
addNewCampaignDataQuery = addNewCampaignDataQuery.replace(/\n/g, ' ').replace(/\t/g,' ');
getUserIDQuery = getUserIDQuery.replace(/\n/g, ' ').replace(/\t/g,' ');
getCampaignIDQuery = getCampaignIDQuery.replace(/\n/g, ' ').replace(/\t/g,' ');

// extractTopCampaignData=extractTopCampaignData.replace(/\n/g, ' ').replace(/\t/g,' ');


var extractActiveCampaignData = function(userInfo) {
	console.log("Active Campaign -- " + userInfo.userName);
	return dbutil.query(extractActiveCampaignDataQuery,[userInfo.userName], false, false);
}

var extractTotalSalesCampaignData = function(userInfo) {
	console.log("Sales Campaign -- " + userInfo.userName);
	return dbutil.query(extractTotalSalesCampaignDataQuery,[userInfo.userName], false, false);
}

var extractTopCampaignData = function(userInfo){
	var deferred = Q.defer();
	setTimeout(function(){
		console.log("TOP Campaingns -- " + userInfo.userName);
		deferred.resolve("Top");
	}, 1000);
	return deferred.promise;	
}

var addNewCampaign = function(campaignInfo){
	console.log("Add new Campaign from user " + campaignInfo.userName);

	var deferred = Q.defer();

	// TANAY update the add new campaign query above, and keep the position of the 
	// insert values same as below i.e. $1 is userName, $2 is campaignName and so on

	return dbutil.query(getUserIDQuery, [campaignInfo.userName],true,false); //output of this needs to go to line 148 for UserID - don't know how though.

	dbutil.query(addNewCampaignDataQuery,
		[CampaignID, campaignInfo.campaignName, campaignInfo.startDate, campaignInfo.endDate, UserID], 
		true, false).then(function(value){
						console.log("Campaign inserted successfully !! with rows: " + value);
						deferred.resolve(campaignInfo);
					},function(error){
						deferred.reject(error);
		});

	return deferred.promise;	
}


module.exports = {
    extractActiveCampaignData : extractActiveCampaignData,
    extractTotalSalesCampaignData : extractTotalSalesCampaignData,
    extractTopCampaignData : extractTopCampaignData,
    addNewCampaign : addNewCampaign,
};