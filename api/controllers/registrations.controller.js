'use strict';

var url = require('url');


var RegistrationsService = require('../services/registrations.service');

module.exports.registerUser = function registerUser (req, res, next) {
    RegistrationsService.registerUser(req.swagger.params, res, next);
};