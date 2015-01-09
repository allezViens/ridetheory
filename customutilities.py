def formatResults(modelArray):
  res = []
  for i in range(len(modelArray)):
    print 'in for loop'
    res.append(objectify(modelArray[i]))
  return res

def objectify(model):
  print'objectify top'
  obj = {
    "id": model.email,
    "origin": [float(model.oLat), float(model.oLon)],
    "destination": [float(model.dLat), float(model.dLon)],
    "date": model.date
  }
  return obj

def makeBuffer(lat,lon,miles,direction):
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

def detuplify(userDict):
  oLat, oLon = userDict['origin'][0], userDict['origin'][1]
  dLat, dLon = userDict['destination'][0], userDict['destination'][1]
  userDict['oLat'] = oLat
  userDict['oLon'] = oLon
  userDict['dLat'] = dLat
  userDict['dLon'] = dLon
  if('id' in userDict):
    userDict['email'] = userDict['id']
  del userDict['origin']
  del userDict['destination']
  return userDict

def tuplify(userDict):
  userDict['origin'] = [userDict['oLat'],userDict['oLon']]
  userDict['destination'] = [userDict['dLat'],userDict['dLon']]
  del userDict['oLat'] 
  del userDict['oLon']
  del userDict['dLat']
  del userDict['dLon']
  return userDict








