from models import *
from run import db
import sys

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
  passenger.pick(driver) 
  save()

#TODO: Adds passenger-driver pick to table
def pickPassenger(passengerID, driverID):
  passenger = getPassenger(passengerID)
  driver = getDriver(driverID)
  driver.pick(passenger)
  save()

#TODO: Adds bi-directional matches (join table)
def addMatch(driverID, passengerID):
	save()
	return '' 

'''DATABASE GET'''
#TODO: Retrieve driver instance by ID
def getDriver(driverID):
  print 'in get driver'
  print driverID
  return Driver.query.filter_by(name=driverID).one()
  #return Driver.query.filter_by(id=driverID).one()

#TODO: Retrieve passenger instance by ID
def getPassenger(passengerID):
	return Passenger.query.filter_by(name=passengerID).one()

#TODO: Returns all drivers that contain passenger route
#PARAMS: Passenger's origin and destination coordinates
def findDriversByLoc(oLat, oLong, dLat, dLong):
  print 'in find Drivers by Location'
  drivers = Driver.query.all()
  print drivers
  res = []
  for i in range(len(drivers)):
    print drivers[i]
    minLat, maxLat = min(drivers[i].oLat, drivers[i].dLat), max(drivers[i].oLat, drivers[i].dLat)
    minLong, maxLong = min(drivers[i].oLon, drivers[i].dLon), max(drivers[i].oLon, drivers[i].dLon)
    if (minLat <= oLat <= maxLat and minLat <= dLat <= maxLat):
      if (minLong <= oLong <= maxLong and minLong <= dLong <= maxLong):
        res.append(drivers[i])
  print res
  return formatResults(res)

#TODO: Returns all passengers within given bound box
#PARAMS: Driver's origin and destination coordinates
def findPassengersByLoc(oLat, oLong, dLat, dLong):
  minLat, maxLat = min(oLat, dLat), max(oLat, dLat)
  minLong, maxLong = min(oLong, dLong), max(oLong, dLong)
  passengers = Passenger.query.filter(Passenger.oLat >= minLat, Passenger.oLat <= maxLat,
		Passenger.dLat >= minLat, Passenger.dLat <= maxLat,
		Passenger.oLon >= minLong, Passenger.oLon <= maxLong,
		Passenger.dLon >= minLong, Passenger.dLon <= maxLong).all()
  return formatResults(passengers)

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
  print 'save function'
  for obj in db.session:
    print obj
  try:
    db.session.commit()
  except:
    e = sys.exc_info()[0]
    print e
    print 'Error in session D:'
  finally:
    print 'after db.session.commit()'

def formatResults(modelArray):
  res = []
  for i in range(len(modelArray)):
    res.append(objectify(modelArray[i]))
  return res

def objectify(model):
  obj = {
    "id": model.name,
    "origin": [float(model.oLat), float(model.oLon)],
    "destination": [float(model.dLat), float(model.dLon)]
  }
  return obj

