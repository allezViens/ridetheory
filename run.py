# from flask import Flask, request
# import os.path

# app.run()
from flask import Flask, request, jsonify, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
import os

import json
import sys

app = Flask(__name__, static_folder='client', static_url_path='')

alchemyuri = os.environ["DATABASE_URL"];
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]
# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/allezviens'
db = SQLAlchemy(app)

import connect 

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/driver', methods=['GET', 'POST'])
def drivers():
	if (request.method == 'GET'):
		oLat, oLong = float(request.args.get('oLat')), float(request.args.get('oLong'))
		dLat, dLong = float(request.args.get('dLat')), float(request.args.get('dLong'))
		results = connect.findPassengersByLoc(oLat, oLong, dLat, dLong)
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				oLat, oLong = float(data['origin'][0]), float(data['origin'][1])
				dLat, dLong = float(data['destination'][0]), float(data['destination'][1])
				connect.addDriver(data['id'], oLat, oLong, dLat, dLong)
				return 'Driver added to database'
			if (data['type'] == 'pick'):
				connect.pickPassenger(data['passengerID'],data['driverID'])
				return 'Successful pick'

@app.route('/passenger', methods=['GET', 'POST'])
def passengers():
	if (request.method == 'GET'):
		oLat, oLong = float(request.args.get('oLat')), float(request.args.get('oLong'))
		dLat, dLong = float(request.args.get('dLat')), float(request.args.get('dLong'))
		print oLat
		results = connect.findDriversByLoc(oLat, oLong, dLat, dLong)
		print 'after results'
		print results
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				oLat, oLong = float(data['origin'][0]), float(data['origin'][1])
				dLat, dLong = float(data['destination'][0]), float(data['destination'][1])
				connect.addPassenger(data['id'], oLat, oLong, dLat, dLong)
				return 'Passenger added to database'
			if (data['type'] == 'pick'):
				connect.pickDriver(data['driverID'],data['passengerID'])
				return 'Successful pick'

if (__name__ == '__main__'):
    app.run()