'use strict';

var url = require('url');


var SeasonsService = require('../services/seasons.service');

module.exports.getSeason = function getSeason (req, res, next) {
    SeasonsService.getSeason(req.swagger.params, res, next);
};

module.exports.getAllSeasons = function getSeason (req, res, next) {
    SeasonsService.getAllSeasons(req.swagger.params, res, next);
};

module.exports.newSeason = function newSeason (req, res, next) {
    SeasonsService.newSeason(req.swagger.params, res, next);
};

module.exports.updateSeason = function updateSeason (req, res, next) {
    SeasonsService.updateSeason(req.swagger.params, res, next);
};