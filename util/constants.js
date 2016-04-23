var multiline = require('multiline'); 

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
UPPER(TM1."FirstName")=($1)
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
	*/});

var extractHeatMapDataQuery = multiline.stripIndent(function(){/*
SELECT first_name as "FirstName", quarter "Quater", sales_amout_usd "Sales"
	FROM public.qsd;
	*/});

var addNewCampaignDataQuery = multiline.stripIndent(function(){/*
INSERT
INTO
	PUBLIC."Campaign"("CampaignName" , "CampaignStartDate" , "CampaignEndDate", "UserID" , "CampaignPhaseID" , "IsCampaignApproved", "Created_TS" , 
	"Updated_TS") 
VALUES
	(
		($1) , ($2) , ($3) , ($4), 1, 'Y' , CURRENT_DATE , CURRENT_DATE
	);
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


module.exports = {

    databaseURL: process.env.DATABASE_URL || "postgres://localhost:5432/CLM",

	activeCampaignDataQuery : extractActiveCampaignDataQuery.replace(/(\n|\t)/g, ' '),
	totalSalesCampaignDataQuery : extractTotalSalesCampaignDataQuery.replace(/(\n|\t)/g, ' '),
	addNewCampaignDataQuery : addNewCampaignDataQuery.replace(/(\n|\t)/g, ' '),
	getUserIDQuery : getUserIDQuery.replace(/\n/g, ' ').replace(/(\n|\t)/g, ' '),
	heatMapDataQuery : extractHeatMapDataQuery.replace(/(\n|\t)/g, ' ')

};