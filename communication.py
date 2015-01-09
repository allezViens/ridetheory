from flask.ext.mail import Mail, Message
from run import mail
# from run import app

def sendUserEmail(to, message):
	header = 'Allez Viens User Contacted You'
	sendEmail([to], header, message)

def sendValidationEmail(to, url):
	header = 'Allez Viens Validation'
	body = "Please click <a href='" + url + "'>this link</a> to validate and interact with your route.</br> If you did not request this, please disregard this email."
	sendEmail([to], header, body)

def sendEmail(to, header, body):
	msg = Message(
		header,
		recipients=to
		)
	msg.body = "body"
	msg.html = body
	mail.send(msg)

	#For Development, uncomment to use function from command line
	# with app.app_context():
	# 	mail.send(msg)

