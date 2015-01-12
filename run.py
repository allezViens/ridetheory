from flask import Flask, request, jsonify, redirect, url_for
# from flask.ext.mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
import os
import json
import sys
import customutilities

app = Flask(__name__, static_folder='build', static_url_path='')

app.config.update(
	#Comment out for production
	DEBUG = True,
	#Email Settings
	SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL",'postgresql://localhost/allezviens'),
	# MAIL_SERVER = 'smtp.gmail.com',
	# MAIL_PORT = 465,
	# MAIL_USE_SSL = True,
	# MAIL_DEFAULT_SENDER = 'allezviens01@gmail.com',
	# MAIL_USERNAME = 'allezviens01@gmail.com',
	# MAIL_PASSWORD = 'swiftmanatee'
	# MAIL_USERNAME = os.environ.get('MAIL_USERNAME'),
	# MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
	)

db = SQLAlchemy(app)
# mail = Mail(app)

from connect import * 
# from communication import *

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/api/message', methods=['POST'])
def apiSendMessage():
	if (request.headers['Content-Type'][:16] == 'application/json'):
		print request.data
		data = json.loads(request.data)
		print 'jsonified data'
		print data
		#fromID email
		#toID email
		#fromType
		#message string 
		sendMessage(data['to'], data['from'], data['message'], data['fromType'])
		return 'Message sent'

@app.route('/api/passenger/update', methods=['POST'])
def passengerUpdate():
	if (request.headers['Content-Type'][:16] == 'application/json'):
		data = json.loads(request.data)
		data = customutilities.detuplify(data)
		if updatePassenger(data):
			return 'Passenger record updated successfully'
		else:
			return 'ERROR. Passenger record was not updated.'

@app.route('/api/driver/update', methods=['POST'])
def driverUpdate():
	if (request.headers['Content-Type'][:16] == 'application/json'):
		data = json.loads(request.data)
		data = customutilities.detuplify(data)
		if updateDriver(data):
			return 'Driver record updated successfully.'
		else:
			return 'ERROR. Driver record not updated.'

@app.route('/api/driver', methods=['GET', 'POST'])
def drivers():
	if (request.method == 'GET'):
		oLat, oLon = float(request.args.get('oLat')), float(request.args.get('oLon'))
		dLat, dLon = float(request.args.get('dLat')), float(request.args.get('dLon'))
		date = request.args.get('date')
		results = findMatchableDrivers(oLat, oLon, dLat, dLon, date)
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				oLat, oLon = float(data['origin'][0]), float(data['origin'][1])
				dLat, dLon = float(data['destination'][0]), float(data['destination'][1])
				addDriver(data['id'], oLat, oLon, dLat, dLon, data['date'])
				# sendValidationEmail(data['id'], 'http://giphy.com/gifs/running-penguin-baby-s73EQWBuDlcas')
				return 'Driver added to database'
			if (data['type'] == 'pick'):
				pickPassenger(data['passengerID'],data['driverID'])
				return 'Successful pick'

@app.route('/api/passenger', methods=['GET', 'POST'])
def passengers():
	if (request.method == 'GET'):
		oLat, oLon = float(request.args.get('oLat')), float(request.args.get('oLon'))
		dLat, dLon = float(request.args.get('dLat')), float(request.args.get('dLon'))
		date = request.args.get('date')
		results = findMatchablePassengers(oLat, oLon, dLat, dLon, date)
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				oLat, oLon = float(data['origin'][0]), float(data['origin'][1])
				dLat, dLon = float(data['destination'][0]), float(data['destination'][1])
				addPassenger(data['id'], oLat, oLon, dLat, dLon, data['date'])
				# sendValidationEmail(data['id'], 'http://giphy.com/gifs/running-penguin-baby-s73EQWBuDlcas')
				return 'Passenger added to database'
			if (data['type'] == 'pick'):
				pickDriver(data['driverID'],data['passengerID'])
				return 'Successful pick'

@app.route('/api/trip/<urlID>', methods=['GET'])
def apiTrip(urlID):
	if (request.method == 'GET'):
		urlType, info = getInfoByUrl(urlID)
		if(urlType == 'P'):
		  return jsonify(passenger=info)
		if(urlType == 'D'):
		  return jsonify(driver=info)
	
@app.route('/trip/<urlID>')
def trip(urlID):
	if(urlExists(urlID)):
		return app.send_static_file('index.html')
	else: 
		print 'url does not exist'
		return '404 route not found'
	

if (__name__ == '__main__'):
    app.run()