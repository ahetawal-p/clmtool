$(document).ready(function() {
  $('.login-input').on('focus', function() {
  		$('.login').addClass('focused');
	});

   $('.login-btn').hover(function() {
  		validateEmail($("#email-input").val());
  	});

	$('.login').on('submit', function(e) {
		  e.preventDefault();
		  var email = "";
		  email = $("#email-input").val();
          var name = $("#name-input").val();
		  if(!isValidEmailAddress(email)){
		  	$("#validation-msg").show();
		  }else if(!name || name.trim().length == 0){
            $("#name-validation-msg").show();
          }else {
		  	$('.login').removeClass('focused').addClass('loading');
		 	var posting = $.post( "/register", { 
                    user_email:  email.trim(),
                    user_name:   name.trim()
                });
		 	posting.done(function(data){
		  		$('.text').text('Get Ready...');
            });

		  	posting.fail(function(data){
		  		console.log("Error registering: " + JSON.stringify(data.responseJSON));
                $('.confirmEmailMsg').text(data.responseJSON.message  + "!");
                $('.text').text('Try again :(');

		  	});

		  	posting.always(function(data){
		  		$('.login-form').hide();
		  		$('.confirmEmailMsg').show();
		 		$('.login').removeClass('loading');
                $('.login').addClass('focused');
		  	});
		 }
	});

$("#email-input").keyup(function(){
		var email = $("#email-input").val();
        validateEmail(email);
    });
	
	function validateEmail(email){
		if(email != 0) {
        	email = email.trim();
            if(isValidEmailAddress(email)) {
                $("#email-input-error").removeClass('invalid');
                $("#email-input-error").addClass('valid');
            } else {
                $("#email-input-error").addClass('invalid');
            }
        } else {
            $("#email-input-error").attr('class', 'emailvalidator');
        }
        $("#validation-msg").hide();    
    }

	function isValidEmailAddress(emailAddress) {
    		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    		if(pattern.test(emailAddress)){
    			if (emailAddress.indexOf('@salesforce.com', emailAddress.length - '@salesforce.com'.length) !== -1) {
            		return true;
        		} else {
            		//console.log('Email must be a salesforce e-mail address (your.name@salesforce.com).');
            		return false;
        		}
    		} else {
        		//console.log('Not a valid e-mail address.');
        		return false;
    		}
		}

});