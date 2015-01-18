from models import *
from run import db
import sys
import math
import hashlib
import time
from communication import sendPickNotificationEmail

'''DATABASE INSERTION/UPDATE'''
#Adds driver to database
def addDriver(id, alias, oLat, oLon, dLat, dLon, date):
  url = makeURL(id)
  driver = Driver(id, alias, oLat, oLon, dLat, dLon, date, url)
  db.session.add(driver)
  save()
  return driver

#Adds passenger to database
def addPassenger(id, alias, oLat, oLon, dLat, dLon, date):
  url = makeURL(id)
  passenger = Passenger(id, alias, oLat, oLon, dLat, dLon, date, url)
  db.session.add(passenger)
  save()
  return passenger

#Adds a driver to a passenger's picks
def pickDriver(driverID, passengerID, add):
  driver = getDriver(driverID)
  passenger = getPassenger(passengerID)
  if(add):
    passenger.pick(driver)
  else:
    passenger.unpick(driver)
  save()

#Adds a passenger to a driver's picks
def pickPassenger(passengerID, driverID, add):
  passenger = getPassenger(passengerID)
  driver = getDriver(driverID)
  if(add):
    driver.pick(passenger)
  else:
    driver.unpick(passenger)
  save()

#Validates driver
def validateDriver(driverID):
  driver = getDriver(driverID)
  driver.validate()
  save()

#Validates passenger
def validatePassenger(passengerID):
  passenger = getPassenger(passengerID)
  passenger.validate()
  save()


def updatePassenger(passengerDict):
  passenger = getPassenger(passengerDict['email'])
  return update(passenger,passengerDict)

def updateDriver(driverDict):
  driver = getDriver(driverDict['email'])
  return update(driver,driverDict)

#Updates given model
def update(model, dictionary):
  if(model != ''):
    model.oLat = dictionary['oLat']
    model.oLon = dictionary['oLon']
    model.dLat = dictionary['dLat']
    model.dLon = dictionary['dLon']
    model.date = dictionary['date']
    model.alias = dictionary['alias']
    db.session.add(model)
    save()
    return True
  else:
    return False

'''DATABASE GET'''
#Retrieve driver instance by ID
def getDriver(driverID):
  try:
    result = Driver.query.filter_by(email=driverID).first()
  except:
    result = ''
  finally:
    return result


#Retrieve passenger instance by ID
def getPassenger(passengerID):
  try:
    result = Passenger.query.filter_by(email=passengerID).first()
  except:
    result = ''
  finally:
    return result


#Returns all drivers that contain passenger route and same date
#Identifies drivers whose boundary box contains the passenger's route and are in same direction
#PARAMS: Passenger's origin and destination coordinates
def findMatchableDrivers(oLat, oLon, dLat, dLon, date):
  #Query for all drivers then do post processing, no nice way to struture this query 
  drivers = Driver.query.filter(Driver.date == date).all()
  res = []
  for i in range(len(drivers)):
    #Determining bounding box
    minLat, maxLat = min(drivers[i].oLat, drivers[i].dLat), max(drivers[i].oLat, drivers[i].dLat)
    minLon, maxLon = min(drivers[i].oLon, drivers[i].dLon), max(drivers[i].oLon, drivers[i].dLon)
    if (minLat <= oLat <= maxLat and minLat <= dLat <= maxLat):
      if (minLon <= oLon <= maxLon and minLon <= dLon <= maxLon):
        if(sameDirection(oLat, oLon, dLat, dLon, drivers[i].oLat, drivers[i].oLon, drivers[i].dLat, drivers[i].dLon)):
          res.append(drivers[i])
  return formatResults(res)

#Returns all passengers within given bound box and same date
#Returns passengers whose coordinates are in the driver's boundary box and are in same direction 
#PARAMS: Driver's origin and destination coordinates
def findMatchablePassengers(oLat, oLon, dLat, dLon, date):
  res = []
  minLat, maxLat = min(oLat, dLat), max(oLat, dLat)
  minLon, maxLon = min(oLon, dLon), max(oLon, dLon)
  maxLat, minLon = makeBuffer(maxLat,minLon, 5, "NW") 
  minLat, maxLon = makeBuffer(minLat,maxLon, 5, "SE")
  passengers = Passenger.query.filter(Passenger.date == date,
    Passenger.oLat >= minLat, Passenger.oLat <= maxLat,
    Passenger.dLat >= minLat, Passenger.dLat <= maxLat,
    Passenger.oLon >= minLon, Passenger.oLon <= maxLon,
    Passenger.dLon >= minLon, Passenger.dLon <= maxLon).all()
  #Query does most of filtering, then check for same diretion
  for i in range(len(passengers)):
    if(sameDirection(oLat, oLon, dLat, dLon, passengers[i].oLat, passengers[i].oLon, passengers[i].dLat, passengers[i].dLon)):
      res.append(passengers[i])
  return formatResults(res)

#Returns all picks by given driver
def findDriverPicks(driverID):
  return getDriver(driverID).picks

#Returns all picks by given driver
def findPassengerPicks(passengerID):
  return getPassenger(passengerID).picks

#Returns object with user's email, origin, destination, and pick information
def getInfoByUrl(url):
  match = Driver.query.filter_by(editURL=url).all()
  if(len(match)>0):
    driver = match[0]
    picks = findDriverPicks(driver.email)
    return 'D', objectifyWithPickInfo(driver, picks)
  match = Passenger.query.filter_by(editURL=url).all()
  if(len(match)>0):
    passenger = match[0]
    picks = findPassengerPicks(passenger.email)
    return 'P', objectifyWithPickInfo(passenger, picks)
  return 'NA', False

#Retrieves driver's info by email
def getDriverInfo(email):
  driver = getDriver(email)
  picks = findDriverPicks(driver.email)
  return objectifyWithPickInfo(driver, picks)

#Retrieves passenger's info by email
def getPassengerInfo(email):
  passenger = getPassenger(email)
  picks = findPassengerPicks(passenger.email)
  return objectifyWithPickInfo(passenger, picks)

#Validates existing urls
def urlExists(url, validate):
  urlType, info = getInfoByUrl(url)
  if(urlType == 'P'):
    if(validate):
      validatePassenger(info['email'])
    return True
  elif(urlType == 'D'):
    if(validate):
      validateDriver(info['email'])
    return True
  else:
    return False

def sendMessage(to, sender, message, fromType):
  sent = True
  try:
    if(fromType.upper().startsWith('D')):
      passenger = getPassenger(to)
      url = passenger.editURL
    else:
      driver = getDriver(to)
      url = driver.editURL
    sendPickNotificationEmail(to, sender, url)
  except:
    sent = False
  finally:
    return sent


'''DATABASE DELETION'''
#Deletes driver + route from database
def deleteDriver(id):
  driver = getDriver(id)
  db.session.delete(driver)
  save()
  return ''

#Deletes passenger + route from database
def deletePassenger(id):
  passenger = getPassenger(id)
  db.session.delete(passenger)
  save()
  return ''

'''HELPER FUNCTIONS'''
#Commits db session changes
def save():
  try:
    db.session.commit()
  except:
    e = sys.exc_info()[0]
    print e
    print 'Error in session'
  finally:
    print 'After db.session.commit()'

#Returns JSON-friendly data from a model array
def formatResults(modelArray):
  res = []
  for i in range(len(modelArray)):
    res.append(objectify(modelArray[i]))
  return res

#Pulls model data into JSON format
def objectify(model):
  obj = {
    "email": model.email,
    "alias": model.alias,
    "origin": [float(model.oLat), float(model.oLon)],
    "destination": [float(model.dLat), float(model.dLon)],
    "date": model.date
  }
  return obj

#Extends objectify with pick information
def objectifyWithPickInfo(model, picks):
  obj = objectify(model)
  obj["picks"] = parseUserPicks(model, picks)
  return obj

#Takes users pick information and returns array of each pick denoting either CONFIRMED or PENDING status
def parseUserPicks(user, picks):
  res = []
  for pick in picks:
    if (user in pick.picks):
      res.append({"id": pick.email, "status": "CONFIRMED"})
    else:
      res.append({"id": pick.email, "status": "PENDING"})
  return res

#Adds buffer around location
def makeBuffer(lat, lon, miles, direction):
  #This earth radius in miles may not be entirely accurate - there are various numbers and the earth is not a perfect sphere
  #for the case of a buffer though, probably doesn't really matter
  earthRadiusMiles = 3959
  northwest = math.radians(315)
  southeast = math.radians(135)
  lat = math.radians(lat)
  lon = math.radians(lon)

  #cast as float or this breaks, because angular direction is a tiny tiny number 
  angularDirection = float(miles)/float(earthRadiusMiles)
  if(direction == "NW"):
    bearing = northwest
  if(direction == "SE"):
    bearing = southeast

  newLat = math.asin(math.sin(lat) * math.cos(angularDirection)) + math.cos(lat) * math.sin(angularDirection) * math.cos(bearing)
  newLon = lon + math.atan2(math.sin(bearing) * math.sin(angularDirection) * math.cos(lat), math.cos(angularDirection) - math.sin(lat) * math.sin(newLat))
  
  return math.degrees(newLat), math.degrees(newLon)

def sameDirection(oLat1, oLon1, dLat1, dLon1, oLat2, oLon2, dLat2, dLon2):
  x1 = float(oLat1) - float(dLat1)
  y1 = float(oLon1) - float(dLon1)
  x2 = float(oLat2) - float(dLat2)
  y2 = float(oLon2) - float(dLon2)
  dot = x1 * x2 + y1 * y2
  return dot>0

def makeURL(id):
  id = id + time.strftime("%M%S")
  hash = hashlib.md5(id).hexdigest()
  url = hash[0:8]
  while(urlExists(url,False)):
      id = id + time.strftime("%M%S")
      hash = hashlib.md5(id).hexdigest()
      url = hash[0:8]
  return url

