from flask.ext.mail import Mail, Message
from run import mail

# def sendUserEmail(to, replyTo, message, url):
# 	header = 'Allez Viens User Contacted You'
# 	sender = 'messages@allezviens.com'
# 	url = 'allez-viens.herokuapp.com/trip/' + url
# 	body = "You've recieved a message from a user at Allez Viens regarding <a href='" + url + "'>this route.</a> <br>" + message + "<br>Replying to this message will reply directly to the user." 
# 	sendEmail([to], replyTo, sender, header, body)

def sendValidationEmail(to, url):
	header = 'Ride Theory Validation'
	sender = 'verify@ridetheory.com'
	replyTo = 'noreply@ridetheory.com'
	url = 'allez-viens.herokuapp.com/trip/' + url
	body = "Please click <a href='" + url + "'>this link</a> to validate and edit your route.</br> If you did not request this, please disregard this email."
	sendEmail([to], replyTo, sender, header, body)

def sendPickNotificationEmail(to, replyTo, url):
	print 'pick notification email'
	header = 'Ride Theory User Contacted You'
	sender = 'notifications@ridetheory.com'
	url = 'ridetheory.herokuapp.com/trip/' + url
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
