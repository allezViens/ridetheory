# from flask import Flask, request
# import os.path

# app.run()
from flask import Flask, request, jsonify
import json
import requests
import connect
app = Flask(__name__, static_folder='client', static_url_path='')

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/driver', methods=['GET', 'POST'])
def drivers():
	if (request.method == 'GET'):
		print 'get method'
		origin = []
		origin.append(float(request.args.get('oLat')))
		origin.append(float(request.args.get('oLong')))
		destination = []
		destination.append(float(request.args.get('dLat')))
		destination.append(float(request.args.get('dLong')))
		print origin
		print destination
		results = connect.findDrivers(origin, destination)
		print 'after results'
		print results
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				origin = []
				origin.append(float(data['origin'][0]))
				origin.append(float(data['origin'][1]))
				destination = []
				destination.append(float(data['destination'][0]))
				destination.append(float(data['destination'][1]))
				print(origin,destination)
				print(data['id'])
				print(origin,destination)
				connect.createDriver(origin, destination, data['id'])
				return 'Driver added to database'
			if (data['type'] == 'pick'):
				connect.pickPassenger(data['driverID'],data['passengerID'])
				return 'Successful pick'

@app.route('/passenger', methods=['GET', 'POST'])
def passengers():
	if (request.method == 'GET'):
		origin = []
		origin.append(float(request.args.get('oLat')))
		origin.append(float(request.args.get('oLong')))
		destination = []
		destination.append(float(request.args.get('dLat')))
		destination.append(float(request.args.get('dLong')))
		print origin
		print destination
		results = connect.findPassengers(origin, destination)
		print 'after results'
		print results
		return jsonify(matches=results)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'][:16] == 'application/json'):
			data = json.loads(request.data)
			if (data['type'] == 'create'):
				origin = []
				origin.append(float(data['origin'][0]))
				origin.append(float(data['origin'][1]))
				destination = []
				destination.append(float(data['destination'][0]))
				destination.append(float(data['destination'][1]))
				connect.createPassenger(origin, destination, data['id'])
				return 'Passenger added to database'
			if (data['type'] == 'pick'):
				connect.pickDriver(data['passengerID'],data['driverID'])
				return 'Successful pick'

if (__name__ == '__main__'):
    app.run()