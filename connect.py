from py2neo import Graph, watch, Node, Relationship, Path, ServiceRoot
import os

#watch requests to db-server
watch("httpstream")

#This is for using localhost 
#graph = Graph()

# This is for using graphenedb on heroku and azure on local machine
# graphenedb_url = os.environ.get("GRAPHENEDB_URL", "http://neo4j-av.cloudapp.net:7474/");
# graph = ServiceRoot(graphenedb_url).graph

#This is for connecting to local host for testing
# graph = ServiceRoot("http://localhost:7474/").graph

#This is for connecting to azure always
graph = ServiceRoot("http://neo4j-av.cloudapp.net:7474/").graph


def createWaypoint( coordinates ):
  return graph.merge_one("Waypoint", "coordinates", coordinates)

#origin and destination are dictionaries 
def createDriver( origin, destination, id ):
  driver = graph.merge_one("Driver", "id", id)
  graph.create_unique(Relationship(driver, "ORIGIN", createWaypoint(origin) ))
  graph.create_unique(Relationship(driver, "DESTINATION", createWaypoint(destination) ))

# create node:Passenger with 
def createPassenger( origin, destination, id):
  passenger = graph.merge_one("Passenger", "id", id)
  graph.create_unique(Relationship(passenger, "ORIGIN", createWaypoint(origin) ))
  graph.create_unique(Relationship(passenger, "DESTINATION", createWaypoint(destination) ))

#return all nodes with same origin and destination 
#origin and destination are arrays [lat,long]
def findNodes( label, origin, destination ):
  print 'in find nodes'
  a = "(origin {coordinates : %s})" % origin
  b = "(destination {coordinates: %s})" % destination
  query = "MATCH %s <-[:ORIGIN]-(passengers:%s)-[:DESTINATION]->%s return passengers" %(a,label,b)
  print 'query'
  print query
  data = graph.cypher.execute(query)
  print 'data'
  print data
  print 'after data'
  return parseTableData(data)

def findDrivers( origin, destination ):
  print 'in find drivers'
  return findNodes("Driver", origin, destination)


def findPassengers ( origin, destination ):
  return findNodes("Passenger", origin, destination)

def pickDriver(passengerId, driverId):
  a = graph.merge_one("Passenger","id",passengerId)
  b = graph.merge_one("Driver","id",driverId)
  graph.create_unique(Relationship(a,"PICKS",b))

def pickPassenger(driverId, passengerId):
  a = graph.merge_one("Driver","id",driverId)
  b = graph.merge_one("Passenger","id",passengerId)
  graph.create_unique(Relationship(a,"PICKS",b))
  # query = "MATCH (a),(b) WHERE a.id = %s AND b.id = %s CREATE (a)-[r:PICKS]->(b) RETURN r" %(userAId, userBId)
  # data = graph.cypher.execute(query)
#
'''
   | passengers              
---+--------------------------
 1 | (n0:Driver {id:"Jon"})  
 2 | (n5:Driver {id:"Jimmy"})
'''
def parseTableData( data ):
  print 'parseTableData'
  print data
  res = []
  # for i in range(0, len(data) + 1):
    # res.append(data[i][0]['id'])
  for record in data:
    res.append(record[0]['id'].encode("utf-8"))
  return res

# origin = [10,12]
# destination = [43,45]
# createDriver([10,12], [43,45], "Jon")
# createPassenger(origin, destination, "Adam")
# createPassenger(origin, destination, "Tony")
# print(findPassengers(origin, destination))
