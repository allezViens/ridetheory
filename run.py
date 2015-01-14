from flask import Flask, request, jsonify, redirect, url_for
from flask.ext.mail import Mail
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
	MAIL_SERVER = 'smtp.gmail.com',
	MAIL_PORT = 465,
	MAIL_USE_SSL = True,
	MAIL_DEFAULT_SENDER = 'allezviens01@gmail.com',
	MAIL_USERNAME = 'allezviens01@gmail.com',
	MAIL_PASSWORD = 'swiftmanatee'
	# MAIL_USERNAME = os.environ.get('MAIL_USERNAME'),
	# MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
	)

db = SQLAlchemy(app)
mail = Mail(app)

from connect import * 
from communication import *

#Places for people to go 
@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/trip/<urlID>')
def trip(urlID):
	if(urlExists(urlID,True)):
		return app.send_static_file('index.html')
	else: 
		print 'url does not exist'
		return '404 route not found'
	
#Places for developers to go
@app.route('/api/driver', methods=['POST','GET'])
def driver():
	if (request.method == 'GET'):
		email = request.args.get('email')
		results = getDriverInfo(email)
		return jsonify(results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			oLat, oLon = float(data['origin'][0]), float(data['origin'][1])
			dLat, dLon = float(data['destination'][0]), float(data['destination'][1])
			driver = addDriver(data['email'], data['alias'], oLat, oLon, dLat, dLon, data['date'])
			sendValidationEmail(data['email'], driver.editURL)
			return 'Driver added to database'
		else:
			return 'Incorrect data type for POST request. Use JSON format.'

@app.route('/api/passenger', methods=['POST','GET'])
def passenger():
	if (request.method == 'GET'):
		email = request.args.get('email')
		results = getPassengerInfo(email)
		return jsonify(results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			oLat, oLon = float(data['origin'][0]), float(data['origin'][1])
			dLat, dLon = float(data['destination'][0]), float(data['destination'][1])
			passenger = addPassenger(data['email'], data['alias'], oLat, oLon, dLat, dLon, data['date'])
			sendValidationEmail(data['email'], passenger.editURL)
			return 'Driver added to database'
		else:
			return 'Incorrect data type for POST request. Use JSON format.'

@app.route('/api/driver/matches', methods=['GET'])
def driverMatches():
	if (request.method == 'GET'):
		oLat, oLon = float(request.args.get('oLat')), float(request.args.get('oLon'))
		dLat, dLon = float(request.args.get('dLat')), float(request.args.get('dLon'))
		date = request.args.get('date')
		results = findMatchableDrivers(oLat, oLon, dLat, dLon, date)
		return jsonify(matches=results)
	else:
		return 'Only GET requests are allowed on this route'

@app.route('/api/passenger/matches', methods=['GET'])
def passengerMatches():
	if (request.method == 'GET'):
		oLat, oLon = float(request.args.get('oLat')), float(request.args.get('oLon'))
		dLat, dLon = float(request.args.get('dLat')), float(request.args.get('dLon'))
		date = request.args.get('date')
		results = findMatchablePassengers(oLat, oLon, dLat, dLon, date)
		return jsonify(matches=results)
	else:
		return 'Only GET requests are allowed.'

@app.route('/api/message', methods=['POST'])
def message():
	if (request.headers['Content-Type'][:16] == 'application/json'):
		data = json.loads(request.data)
		if(sendMessage(data['to'], data['from'], data['message'], data['fromType'])):
			return 'Message sent successfully.'
		else:
			return 'ERROR. Message not sent.'
	else: 
		return 'Incorrect data type for POST request. Use JSON format.'

@app.route('/api/trip', methods=['GET', 'POST'])
def apiTrip():
	if (request.method == 'GET'):
		urlType, info = getInfoByUrl(request.args.get('token'))
		if(urlType == 'P'):
		  return jsonify(passenger=info)
		if(urlType == 'D'):
		  return jsonify(driver=info)
		else:
			return 'ERROR. No info associated with URL token '
	if (request.method == 'POST'):
		data = json.loads(request.data)
		if(urlExists(data['token'],False)):
		  data = customutilities.detuplify(data)
		  if(data['type'][0].upper()=='D'):
		  	if(updateDriver(data)):
		  		return 'Driver record updated successfully'
		  	else:
		  		return 'ERROR. Driver record was not updated.'
		  elif (data['type'][0].upper()=='P'):
		  	if(updatePassenger(data)):
		  		return 'Passenger record updated successfully'
		  	else:
		  		return 'ERROR. Passenger record was not updated.'
		  else:
		  	return 'ERROR. Incorrect type. Please specify Driver or Passenger.'
		else:
			return 'ERROR. No route associated with token: ' + data['urlID']

@app.route('/api/trip/picks', methods=['GET', 'POST'])
def tripPicks():
	if (request.method == 'GET'):
		urlToken = request.args.get('urlToken')
		urlType, info = getInfoByUrl(urlID)
		if(urlType == 'P'):
			return jsonify(info.picks)
		elif (urlType == 'D'):
			return jsonify(info.picks)
		else:
			return 'ERROR. No route associated with token or no token given.'
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			type, info = getInfoByUrl(data['token'])
			if (type=='D'):
				if(data['pickType'][0].upper()=='A'):
					pickPassenger(data['email'], info['email'], True)
					return 'Successful pick'
				elif (data['pickType'][0].upper()=='D'):
					pickPassenger(data['email'], info['email'], False)
					return 'Successful pick'
				else:
					return 'Incorrect pick type. Specify add or delete.'
			if (type=='P'):
				if(data['pickType'][0].upper()=='A'):
					pickDriver(data['email'], info['email'], True)
					return 'Successful pick'
				elif (data['pickType'][0].upper()=='D'):
					pickDriver(data['email'], info['email'], False)
					return 'Successful pick'
				else:
					return 'Incorrect pick type. Specify add or delete.'
			else:
				return 'No route/user associated with that url token.'

if (__name__ == '__main__'):
    app.run()