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
  email = db.Column(db.String)
  alias = db.Column(db.String)
  editURL = db.Column(db.String)
  validated = db.Column(db.Boolean)
  oLat = db.Column(db.Numeric)
  oLon = db.Column(db.Numeric)
  dLat = db.Column(db.Numeric)
  dLon = db.Column(db.Numeric)
  date = db.Column(db.String)
  picks = db.relationship('Passenger', secondary='driverPicks', backref=db.backref('pickedBy',lazy='dynamic'))

  def __init__(self, email, alias, oLat, oLon, dLat, dLon, date, url):
    self.email = email
    self.alias = alias
    self.validated = False
    self.oLat = oLat
    self.oLon = oLon
    self.dLat = dLat
    self.dLon = dLon
    self.date = date
    self.editURL = url

  def __repr__(self):
    return '<User %r>' % self.email

  def pick(self, passenger):
    self.picks.append(passenger)
    return self

  def unpick(self, passenger):
    self.picks.remove(passenger)
    return self

  def validate(self):
  	self.validated = True
  	return self

class Passenger(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String)
  alias = db.Column(db.String)
  editURL = db.Column(db.String)
  validated = db.Column(db.Boolean)
  oLat = db.Column(db.Numeric)
  oLon = db.Column(db.Numeric)
  dLat = db.Column(db.Numeric)
  dLon = db.Column(db.Numeric)
  date = db.Column(db.String)
  picks = db.relationship('Driver', secondary='passengerPicks', backref=db.backref('pickedBy',lazy='dynamic'))

  def __init__(self, email, alias, oLat, oLon, dLat, dLon, date, url):
    self.email = email
    self.alias = alias
    self.validated = False
    self.oLat = oLat
    self.oLon = oLon
    self.dLat = dLat
    self.dLon = dLon
    self.date = date
    self.editURL = url

  def __repr__(self):
    return '<User %r>' % self.email

  def pick(self, driver):
    self.picks.append(driver)
    return self

  def unpick(self, driver):
    self.picks.remove(driver)
    return self

  def validate(self):
  	self.validated = True
  	return self
