from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from run import db

driverPicks = db.Table('driverPicks',
  db.Column('driver_id', db.Integer, db.ForeignKey('driver.id')),
  db.Column('passenger_id', db.Integer, db.ForeignKey('passenger.id'))
)

passengerPicks = db.Table('passengerPicks',
  db.Column('driver_id', db.Integer, db.ForeignKey('driver.id')),
  db.Column('passenger_id', db.Integer, db.ForeignKey('passenger.id'))
)

class Driver(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String)
  oLat = db.Column(db.Numeric)
  oLon = db.Column(db.Numeric)
  dLat = db.Column(db.Numeric)
  dLon = db.Column(db.Numeric)
  picks = db.relationship('Passenger', secondary ='driverPicks', backref = db.backref('pickedBy',lazy='dynamic'))

  def __init__(self, name, oLat, oLon, dLat, dLon):
    self.name = name
    self.oLat = oLat
    self.oLon = oLon
    self.dLat = dLat
    self.dLon = dLon

  def __repr__(self):
    return '<User %r>' % self.name

  def pick(self, passenger):
    self.picks.append(passenger)
    return self

class Passenger(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String)
  oLat = db.Column(db.Numeric)
  oLon = db.Column(db.Numeric)
  dLat = db.Column(db.Numeric)
  dLon = db.Column(db.Numeric)
  picks = db.relationship('Driver', secondary ='passengerPicks', backref = db.backref('pickedBy',lazy='dynamic'))

  def __init__(self, name, oLat, oLon, dLat, dLon):
    self.name = name
    self.oLat = oLat
    self.oLon = oLon
    self.dLat = dLat
    self.dLon = dLon

  def __repr__(self):
    return '<User %r>' % self.name

  def pick(self, driver):
    self.picks.append(driver)
    return self

