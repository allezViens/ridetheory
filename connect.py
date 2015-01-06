from models import *
from run import db
import sys
import math

'''DATABASE INSERTION/UPDATE'''
#Adds driver to database
def addDriver(id, oLat, oLon, dLat, dLon, date):
	driver = Driver(id, oLat, oLon, dLat, dLon, date)
	db.session.add(driver)
	save()

#Adds passenger to database
def addPassenger(id, oLat, oLon, dLat, dLon, date):
  passenger = Passenger(id, oLat, oLon, dLat, dLon, date)
  db.session.add(passenger)
  save()

#Adds driver-passenger pick to table
def pickDriver(driverID, passengerID):
  driver = getDriver(driverID)
  passenger = getPassenger(passengerID)
  passenger.pick(driver) 
  save()

#Adds passenger-driver pick to table
def pickPassenger(passengerID, driverID):
  passenger = getPassenger(passengerID)
  driver = getDriver(driverID)
  driver.pick(passenger)
  save()

#Validates users
def validateDriver(driverID):
  driver = getDriver(driverID)
  driver.validateDriver()
  save()

def validatePassenger(passengerID):
  passenger = getPassenger(passengerID)
  passenger.validatePassenger()
  save()

'''DATABASE GET'''
#TODO: Retrieve driver instance by ID
def getDriver(driverID):
  return Driver.query.filter_by(name=driverID).one()
  #return Driver.query.filter_by(id=driverID).one()

#TODO: Retrieve passenger instance by ID
def getPassenger(passengerID):
  return Passenger.query.filter_by(name=passengerID).one()

#Returns all drivers that contain passenger route and same date
#PARAMS: Passenger's origin and destination coordinates
def findMatchableDrivers(oLat, oLon, dLat, dLon, date):
  drivers = Driver.query.filter(Driver.date == date).all()
  res = []
  for i in range(len(drivers)):
    minLat, maxLat = min(drivers[i].oLat, drivers[i].dLat), max(drivers[i].oLat, drivers[i].dLat)
    minLon, maxLon = min(drivers[i].oLon, drivers[i].dLon), max(drivers[i].oLon, drivers[i].dLon)
    if (minLat <= oLat <= maxLat and minLat <= dLat <= maxLat):
      if (minLon <= oLon <= maxLon and minLon <= dLon <= maxLon):
        res.append(drivers[i])
  return formatResults(res)

#Returns all passengers within given bound box and same date
#PARAMS: Driver's origin and destination coordinates
def findMatchablePassengers(oLat, oLon, dLat, dLon, date):
  minLat, maxLat = min(oLat, dLat), max(oLat, dLat)
  minLon, maxLon = min(oLon, dLon), max(oLon, dLon)
  maxLat, minLon = makeBuffer(maxLat,minLon, 5, "NW") 
  minLat, maxLon = makeBuffer(minLat,maxLon, 5, "SE")
  passengers = Passenger.query.filter(Passenger.date == date,
    Passenger.oLat >= minLat, Passenger.oLat <= maxLat,
    Passenger.dLat >= minLat, Passenger.dLat <= maxLat,
    Passenger.oLon >= minLon, Passenger.oLon <= maxLon,
    Passenger.dLon >= minLon, Passenger.dLon <= maxLon).all()
  minLong, maxLong = min(oLong, dLong), max(oLong, dLong)
  return formatResults(passengers)

#Returns all picks by given driver
def findDriverPicks(driverID):
  return getDriver(driverID).picks

#Returns all picks by given driver
def findPassengerPicks(passengerID):
  return getPassenger(passengerID).picks

#TODO: Checks if both driver and passenger have picked each other
def isReciprocal(driverID, passengerID):
	return '' 

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

def makebuffer(lat,lon,miles,direction):
  #This earth radius in miles may not be entirely accurate - there are various numbers and the earth is not a perfect sphere
  #for the case of a buffer though, probably doesn't really matter
  earthRadiusMiles = 3959
  northwest = math.radians(315)
  southeast = math.radians(135)
  lat = math.radians(lat)
  lon = math.radians(lon)

  #cast as float or this breaks, because angular direction is a tiny tiny number 
  angularDirection = float(miles)/float(earthRadiusMiles)
  print angularDirection
  if(direction=="NW"):
    bearing = northwest
  if(direction=="SE"):
    bearing = southeast

  newLat = math.asin(math.sin(lat)*math.cos(angularDirection)) + math.cos(lat)*math.sin(angularDirection)*math.cos(bearing)
  newLon = lon + math.atan2(math.sin(bearing)*math.sin(angularDirection)*math.cos(lat), math.cos(angularDirection)-math.sin(lat)*math.sin(newLat))
  
  return math.degrees(newLat), math.degrees(newLon)


