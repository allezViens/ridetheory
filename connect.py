from models import *
from run import db

'''DATABASE INSERTION'''
#Adds driver to database
def addDriver(id, oLat, oLong, dLat, dLong):
	driver = Driver(id, oLat, oLong, dLat, dLong)
	db.session.add(driver)
	save()

#Adds passenger to database
def addPassenger(id, oLat, oLong, dLat, dLong):
	passenger = Passenger(id, oLat, oLong, dLat, dLong)
	db.session.add(passenger)
	save()

#TODO: Adds driver-passenger pick to table
def pickDriver(driverID, passengerID):
	driver = getDriver(driverID)
	passenger = getPassenger(passengerID)
	driver.pick(passenger)
	save()

#TODO: Adds passenger-driver pick to table
def pickPassenger(passengerID, driverID):
	passenger = getPassenger(passengerID)
	driver = getDriver(driverID)
	passenger.pick(driver)
	save()

#TODO: Adds bi-directional matches (join table)
def addMatch(driverID, passengerID):
	save()
	return '' 

'''DATABASE GET'''
#TODO: Retrieve driver instance by ID
def getDriver(driverID):
	return Driver.query.filter_by(id=driverID).one()

#TODO: Retrieve passenger instance by ID
def getPassenger(passengerID):
	return Passenger.query.filter_by(id=passengerID).one()

#TODO: Returns all drivers that contain passenger route
#PARAMS: Passenger's origin and destination coordinates
def findDriversByLoc(oLat, oLong, dLat, dLong):
	drivers = Driver.query().all()
	res = []
	for i in range(drivers):
		minLat, maxLat = min(drivers[i].oLat, drivers[i].dLat), max(drivers[i].oLat, drivers[i].dLat)
		minLong, maxLong = min(drivers[i].oLong, drivers[i].dLong), max(drivers[i].oLong, drivers[i].dLong)
		if (minLat <= oLat <= maxLat and minLat <= dLat <= maxLat):
			if (minLong <= oLong <= maxLong and minLong <= dLong <= maxLong):
				res.append(drivers[i])
	return res

#TODO: Returns all passengers within given bound box
#PARAMS: Driver's origin and destination coordinates
def findPassengersByLoc(oLat, oLong, dLat, dLong):
	minLat, maxLat = min(oLat, dLat), max(oLat, dLat)
	minLong, maxLong = min(oLong, dLong), max(oLong, dLong)
	passengers = Passenger.query.filter(Passenger.oLat >= minLat, Passenger.oLat <= maxLat,
		Passenger.dLat >= minLat, Passenger.dLat <= maxLat,
		Passenger.oLong >= minLong, Passenger.oLong <= maxLong,
		Passenger.dLong >= minLong, Passenger.dLong <= maxLong)
	return passengers

#TODO: Returns all picks by given driver
def findDriverPicks(driverID):
	return getDriver(driverID).picks

#TODO: Returns all picks by given driver
def findPassengerPicks(passengerID):
	return getPassenger(passengerID).picks

'''DATABASE DELETION'''
#TODO: Deletes driver + route from database
def deleteDriver(id):
	save()
	return ''

#TODO: Deletes passenger + route from database
def deletePassenger(id):
	save()
	return ''

#TODO: Delete driver's picks from table
def deleteDriverPicks(driverID):
	save()
	return ''

#TODO: Delete passenger's picks from table
def deletePassengerPicks(passengerID):
	save()
	return ''

def save():
	db.session.commit()