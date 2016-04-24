var mailer = require("nodemailer");
var constants = require('./constants.js');
var Q = require('q');
var fs = require('fs');

var email_sender_id = constants.email_sender_id || 'chocochips1101@gmail.com';
var email_sender_pass = constants.email_sender_pass || 'test123456789';


// Use Smtp Protocol to send Email
var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: email_sender_id,
        pass: email_sender_pass
    }
});

var payload = {
           	from: "CLM Tool<do-not-reply@gmail.com>"
            };


var sendMail = function(content, toEmail, subject) {
	var currentDate = new Date();
	payload.text = 'CLM Data as of: ' + currentDate;
	payload.to = toEmail;
	payload.subject = subject;
	payload.attachments = [
		{   // stream as an attachment
            filename: 'Top Performers.png',
            content: fs.createReadStream('2.png')
        }
	];

	var deferred = Q.defer();
	smtpTransport.sendMail(payload, function(error) {
		if (error) {
			console.log("Send email error...");
			console.log(error);
		 	deferred.reject(error);
		 } else {
		 	fs.unlink('2.png', function() {
    				deferred.resolve("Successfully sent...");
  			});
	  		
	  	}

	});
	return deferred.promise;
}


module.exports = {
    sendMail : sendMail
};