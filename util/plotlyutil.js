var Q = require('q');
var plotly = require('plotly')("ahetawal", "ec75z2x1p5");

var plotter = function(data, graphOptions) {
	
	var deferred = Q.defer();

	var sampleResponse = {
		"url" : 'https://plot.ly/~ahetawal/298'
	};

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



module.exports = {
    plotMe : plotter
};

