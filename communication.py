from flask.ext.mail import Mail, Message
from run import mail

#Sends email notifying user about posted route
def sendValidationEmail(to, url):
	header = 'Allez Viens Validation'
	sender = 'verify@allezviens.com'
	replyTo = 'noreply@allezviens.com'
	url = 'allez-viens.herokuapp.com/trip/' + url
	body = "Please click <a href='" + url + "'>this link</a> to validate and edit your route.</br> If you did not request this, please disregard this email."
	sendEmail([to], replyTo, sender, header, body)


#Sends email notifying user about pick
def sendPickNotificationEmail(to, replyTo, url):
	header = 'Allez Viens User Contacted You'
	sender = 'messages@allezviens.com'
	url = 'allez-viens.herokuapp.com/trip/' + url
	body = "A user at Allez Viens has expressed interest in riding with you regarding <a href='" + url + "'>this route.</a> <br><br>Replying to this message will reply directly to the user." 
	sendEmail([to], replyTo, sender, header, body)

#Sends email via smtp service using template 
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

	#For Development, uncomment to use function from command line
	# with app.app_context():
	# 	mail.send(msg)