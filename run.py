# from flask import Flask, request
# import os.path

# app.run()
from flask import Flask, request, jsonify, redirect, url_for
from flask.ext.sqlalchemy import SQLAlchemy
import os
from connect import *
app = Flask(__name__, static_folder='client', static_url_path='')

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/driver', methods=['GET', 'POST'])
def drivers():
	if (request.method == 'GET'):
		oLat, oLong = float(request.args.get('oLat')), float(request.args.get('oLong'))
		origin = [oLat, oLong]
		dLat, dLong = float(request.args.get('dLat')), float(request.args.get('dLong'))
		destination = [dLat, dLong]
		results = connect.findDrivers(origin, destination)
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				oLat, oLong = float(data['origin'][0]), float(data['origin'][1])
				origin = [oLat, oLong]
				dLat, dLong = float(data['destination'][0]), float(data['destination'][1])
				destination = [dLat, dLong]
				connect.createDriver(origin, destination, data['id'])
				return 'Driver added to database'
			if (data['type'] == 'pick'):
				connect.pickPassenger(data['driverID'],data['passengerID'])
				return 'Successful pick'

@app.route('/passenger', methods=['GET', 'POST'])
def passengers():
	if (request.method == 'GET'):
		oLat, oLong = float(request.args.get('oLat')), float(request.args.get('oLong'))
		origin = [oLat, oLong]
		dLat, dLong = float(request.args.get('dLat')), float(request.args.get('dLong'))
		destination = [dLat, dLong]
		results = connect.findPassengers(origin, destination)
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				oLat, oLong = float(data['origin'][0]), float(data['origin'][1])
				origin = [oLat, oLong]
				dLat, dLong = float(data['destination'][0]), float(data['destination'][1])
				destination = [dLat, dLong]
				connect.createPassenger(origin, destination, data['id'])
				return 'Passenger added to database'
			if (data['type'] == 'pick'):
				connect.pickDriver(data['passengerID'],data['driverID'])
				return 'Successful pick'

if (__name__ == '__main__'):
    app.run()