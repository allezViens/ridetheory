# from flask import Flask, request
# import os.path

# app.run()
from flask import Flask, request
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
		origin = request.args.get('origin')
		destination = request.args.get('destination')
		temp = connect.findDrivers(origin, destination)
		return str(temp)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'] == 'application/json'):
			data = json.loads(request.data)
			connect.createDriver(data['origin'], data['destination'], data['id'])
			return 'Driver added to database'

@app.route('/passenger', methods=['GET', 'POST'])
def passengers():
	if (request.method == 'GET'):
		origin = request.args.get('origin')
		destination = request.args.get('destination')
		temp = connect.findPassengers(origin, destination)
		return str(temp)
	if (request.method == 'POST'):
		if (request.headers['Content-Type'] == 'application/json;charset=UTF-8'):
			data = json.loads(request.data)
			connect.createPassenger([data['origin']['lat'],data['origin']['lon']], [data['destination']['lat'],data['destination']['lon']], 1)
			return 'Passenger added to database'

if (__name__ == '__main__'):
    app.run()