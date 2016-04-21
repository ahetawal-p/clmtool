var Q = require('q');
var plotly = require('plotly')("clmtool", "s161fgwksx");
//var plotly = require('plotly')("ahetawal", "ec75z2x1p5");


var plotter = function(data, graphOptions) {
	
	var deferred = Q.defer();

	// var sampleResponse = {
	// 	"url" : 'https://plot.ly/~ahetawal/298'
	// };
	//deferred.resolve(sampleResponse);

	plotly.plot(data, graphOptions, function (error, msg) {
	    if (error) {
			console.log(error);
		 	deferred.reject(error);
		 } else {
	  		deferred.resolve(msg);
	  	}
	});
	return deferred.promise;
}


var getPlotData = function(plotId){

	var deferred = Q.defer();

	plotly.getFigure('clmtool', plotId, function (error, figure) {
	    if (error) {
			console.log(error);
		 	deferred.reject(error);
		 } else {
		 	console.log(JSON.stringify(figure.data));
	  		deferred.resolve(figure);
	  	}
	});
	return deferred.promise;


}



module.exports = {
    plotMe : plotter,
    getPlotData : getPlotData
};

