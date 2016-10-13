'use strict';

var url = require('url');


var EventsService = require('../services/events.service');

module.exports.availability = function availability (req, res, next) {
    EventsService.availability(req.swagger.params, res, next);
};

module.exports.getEvent = function getEvent (req, res, next) {
    EventsService.getEvent(req.swagger.params, res, next);
};

module.exports.getAllEvents = function getAllEvents (req, res, next) {
    EventsService.getAllEvents(req.swagger.params, res, next);
};

module.exports.newEvent = function newEvent (req, res, next) {
    EventsService.newEvent(req.swagger.params, res, next);
};

module.exports.updateEvent = function updateEvent (req, res, next) {
    EventsService.updateEvent(req.swagger.params, res, next);
};