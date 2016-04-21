$(document).ready(function() {

	$( "#startdatepicker" ).datepicker();
	$( "#enddatepicker" ).datepicker();

	var hiddenUserName = $( "#userName" ).val();

	var createCampaign = function(){
		var name = $( "#name" ).val();
		var startDate = $("#startdatepicker").val();
		var endDate = $("#enddatepicker").val();

		var posting = $.post( "/addcampaign", { 
                    campaign_name: name,
                    start_date: startDate,
                    end_date: endDate,
                    user_name: hiddenUserName
                });
		 	posting.done(function(data){
		  		console.log("Success " + data);
		  		if(data == 'Added'){
		  			// reloading iframe
		  			$('#dashboard').attr('src', $('#dashboard').attr('src'));
		  			dialog.dialog( "close" );
		  		} else {
		  			alert("Error: " + data);
		  		}
		  		
            });

		  	posting.fail(function(data){
		  		console.log("Error registering: " + JSON.stringify(data.responseJSON));
            });

	}

	dialog = $( "#dialog-form" ).dialog({
			autoOpen: false,
			height: 400,
			width: 550,
			dialogClass: 'myStyle',
			modal: true,
			buttons: {
				Create: createCampaign,
				Cancel: function() {
					dialog.dialog( "close" );
				}
			},
			close: function() {
				form[ 0 ].reset();
			}
		});

		form = dialog.find( "form" ).on( "submit", function( event ) {
			event.preventDefault();
			createCampaign();
		});


	$('.at-button').on('click', function() {
  		dialog.dialog( "open" );
	});




});