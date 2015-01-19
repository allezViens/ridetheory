#Separates tuple origin and destination into single variables stored in the dictionary
def detuplify(userDict):
  oLat, oLon = userDict['origin'][0], userDict['origin'][1]
  dLat, dLon = userDict['destination'][0], userDict['destination'][1]
  userDict['oLat'] = oLat
  userDict['oLon'] = oLon
  userDict['dLat'] = dLat
  userDict['dLon'] = dLon
  #sometimes id is used in place of email
  if('id' in userDict):
    userDict['email'] = userDict['id']
  del userDict['origin']
  del userDict['destination']
  return userDict

#Turns single variable origin lat and long into tuples
def tuplify(userDict):
  userDict['origin'] = [userDict['oLat'],userDict['oLon']]
  userDict['destination'] = [userDict['dLat'],userDict['dLon']]
  del userDict['oLat'] 
  del userDict['oLon']
  del userDict['dLat']
  del userDict['dLon']
  return userDict








