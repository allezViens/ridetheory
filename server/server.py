# from flask import Flask, request
# import os.path

# app.run()
from flask import Flask, request, json
import requests
import connect
app = Flask(__name__, static_folder='../client', static_url_path='')

# @app.route('/')
# def root():
# 	return app.send_static_file('index.html')

@app.route('/waypoint', methods=['GET', 'POST'])
def waypoints():
	if (request.method == 'GET'):
		temp = connect.findDrivers([10,12], [43, 45])
		return str(temp)
	if (request.method == 'POST'):
		if request.headers['Content-Type'] == 'application/json':
			print request.data
# @app.route('/drivers', methods=['GET', 'POST'])
# def drivers():
# 	if (request.method == 'GET'):

# 	if (request.method == 'POST'):

# @app.route('/passengers', methods=['GET', 'POST'])
# def passengers():
# 	if (request.method == 'GET'):

# 	if (request.method == 'POST'):

if (__name__ == '__main__'):
    app.run()