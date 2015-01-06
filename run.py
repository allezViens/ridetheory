# from flask import Flask, request
# import os.path

# app.run()
from flask import Flask, request, jsonify, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
import os

import json
import sys

app = Flask(__name__, static_folder='client', static_url_path='')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/allezviens'
db = SQLAlchemy(app)

from connect import *
db.create_all()


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
				addDriver(data['id'], oLat, oLon, dLat, dLon, '2015-01-05')
				# addDriver(data['id'], oLat, oLon, dLat, dLon, data['date'])
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
				addPassenger(data['id'], oLat, oLon, dLat, dLon, '2015-01-05')
				# addPassenger(data['id'], oLat, oLon, dLat, dLon, data['date'])
				return 'Passenger added to database'
			if (data['type'] == 'pick'):
				pickDriver(data['driverID'],data['passengerID'])
				return 'Successful pick'

if (__name__ == '__main__'):
    app.run()