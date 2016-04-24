var Q = require('q');
var plotly = require('plotly')("clmtool", "s161fgwksx");
//var plotly = require('plotly')("ahetawal", "ec75z2x1p5");
var fs = require('fs');

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

	plotly.getFigure('tanaysd', plotId, function (error, figure) {
	    if (error) {
	    	console.log ("Get Plot data error below..");
        	console.log(error);
		 	deferred.reject(error);
		 } else {
		 	console.log(JSON.stringify(figure.data));
	  		deferred.resolve(figure);
	  	}
	});
	return deferred.promise;
}

var getPlotImage = function(figure){

	var deferred = Q.defer();

	var imgOpts = {
        format: 'png',
        width: 1000,
        height: 500
    };

    plotly.getImage(figure, imgOpts, function (error, imageStream) {
        if (error) {
        	console.log ("Get Image error below..");
        	console.log (error);
        	deferred.reject(error);
		} else {
			var fileStream = fs.createWriteStream('2.png');
        	imageStream.pipe(fileStream);
        	imageStream.on('end', function() {
        			console.log("Stream added to files..");
    				deferred.resolve('2.png');
  			});
        	
		}
        
    });
	return deferred.promise;
}



module.exports = {
    plotMe : plotter,
    getPlotData : getPlotData,
    getPlotImage : getPlotImage
};

