from flask.ext.mail import Mail, Message
from run import mail
import os

deploymentURL = os.environ.get("DEPLOYMENT_URL","http://localhost:5000")

def sendValidationEmail(to, url):
	header = 'Ride Theory Validation'
	sender = 'verify@ridetheory.com'
	replyTo = 'noreply@ridetheory.com'
	url = deploymentURL  + '/trip/' + url
	body = "Please click <a href='" + url + "'>this link</a> to validate and edit your route.</br> If you did not request this, please disregard this email."
	sendEmail([to], replyTo, sender, header, body)

def sendPickNotificationEmail(to, replyTo, url):
	print 'pick notification email'
	header = 'Ride Theory User Contacted You'
	sender = 'notifications@ridetheory.com'
	url = deploymentURL + '/trip/' + url
	body = "A user at Ride Theory has expressed interest in riding with you regarding <a href='" + url + "'>this route.</a> <br>Replying to this message will reply directly to the user." 
	sendEmail([to], replyTo, sender, header, body)

def sendEmail(to, replyTo, sender, header, body):
	print 'send email'
	print 'to'
	print to
	print 'reply to'
	print replyTo
	print 'sender'
	print sender
	msg = Message(
		header,
		recipients=to,
		reply_to = replyTo,
		sender = sender
		)
	msg.body = "body"
	msg.html = body
	mail.send(msg)
