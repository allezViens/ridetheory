from flask import Flask, request, jsonify, redirect, url_for
from flask.ext.mail import Mail
from flask.ext.sqlalchemy import SQLAlchemy
import os
import json
import sys

app = Flask(__name__, static_folder='build', static_url_path='')
mail = Mail(app)


app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL",'postgresql://localhost/allezviens')
db = SQLAlchemy(app)

app.config.update(
	#Comment out for production
	# DEBUG=True,
	#Email Settings
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
	MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
	)
db = SQLAlchemy(app)

from connect import * 
from communication import *

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/driver', methods=['GET', 'POST'])
def drivers():
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
				addDriver(data['id'], oLat, oLon, dLat, dLon, data['date'])
				# sendValidationEmail(data['id'], 'http://giphy.com/gifs/running-penguin-baby-s73EQWBuDlcas')
				return 'Driver added to database'
			if (data['type'] == 'pick'):
				pickPassenger(data['passengerID'],data['driverID'])
				return 'Successful pick'

@app.route('/passenger', methods=['GET', 'POST'])
def passengers():
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
				addPassenger(data['id'], oLat, oLon, dLat, dLon, data['date'])
				# sendValidationEmail(data['id'], 'http://giphy.com/gifs/running-penguin-baby-s73EQWBuDlcas')
				return 'Passenger added to database'
			if (data['type'] == 'pick'):
				pickDriver(data['driverID'],data['passengerID'])
				return 'Successful pick'

@app.route('/trip/<urlID2>', methods=['GET'])
def route(urlID2):
	if (request.method == 'GET'):
		type, info = getInfoByUrl(urlID2)
		if(type == 'P'):
		  return jsonify(passenger=info[0])
		if(type == 'D'):
		  return jsonify(driver=info[0])
	

if (__name__ == '__main__'):
    app.run()