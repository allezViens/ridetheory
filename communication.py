from flask.ext.mail import Mail, Message
from run import mail

def sendUserEmail(to, message):
	header = 'Allez Viens User Contacted You'
	sendEmail([to], header, message)

def sendValidationEmail(to, url):
	header = 'Allez Viens Validation'
	body = "Please click <a href='" + url + "'>this link</a> to validate and edit your route.</br> If you did not request this, please disregard this email."
	sendEmail([to], header, body)

def sendEmail(to, header, body):
	msg = Message(
		header,
		sender='allezviens01@gmail.com',
		recipients=to
		)
	msg.body = "body"
	msg.html = body
	mail.send(msg)
