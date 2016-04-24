$(document).ready(function() {

	var hiddenUserName = $( "#userName" ).val();

	var loading = function() {
        // add the overlay with loading image to the page
        var over = '<div id="overlay">' +
            '<img id="loading" src="http://i1238.photobucket.com/albums/ff493/jeffry2012/156.gif">' +
            '</div>';
        $(over).appendTo('body');
    };


	$('.email-button').on('click', function() {
		loading();
  		var posting = $.post( "/emailme", { 
                    user_name: hiddenUserName
                });
		 	posting.done(function(data){
		  		console.log("Success " + data);
		  		if(data == 'Success'){
		  			alert("Email sent !")
		  		} else {
		  			alert("Error: " + data);
		  		}
		  		 $('#overlay').remove();
            });

		  	posting.fail(function(data){
		  		alert("Error sending email: " + JSON.stringify(data.responseJSON));
		  		 $('#overlay').remove();
            });
	});




});