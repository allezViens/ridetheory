from flask.ext.mail import Mail, Message
from run import mail

def sendUserEmail(to, replyTo, message, url):
	header = 'Allez Viens User Contacted You'
	sender = 'messages@allezviens.com'
	url = 'allez-viens.herokuapp.com/trip/' + url
	body = "You've recieved a message from a user at Allez Viens regarding <a href='" + url + "'>this route.</a> <br>" + message + "<br>Replying to this message will reply directly to the user." 
	sendEmail([to], replyTo, sender, header, body)

def sendValidationEmail(to, url):
	header = 'Allez Viens Validation'
	sender = 'verify@allezviens.com'
	replyTo = 'noreply@allezviens.com'
	url = 'allez-viens.herokuapp.com/trip/' + url
	body = "Please click <a href='" + url + "'>this link</a> to validate and edit your route.</br> If you did not request this, please disregard this email."
	sendEmail([to], replyTo, sender, header, body)

def sendEmail(to, replyTo, sender, header, body):
	msg = Message(
		header,
		recipients=to,
		reply_to = replyTo,
		sender = sender
		)
	msg.body = "body"
	msg.html = body
	mail.send(msg)
