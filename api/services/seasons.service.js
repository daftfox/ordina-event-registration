'use strict';

var db = require("../../db");
var Status = require("../helpers/Status.helper");
var moment = require('moment');

exports.getSeason = function(args, res, next) {
    /**
     * parameters expected in the args:
     * seasonId (BigDecimal)
     **/
    var season;
    var message;
    var seasonId = args.seasonId.value;
    var sql =   "SELECT * FROM seasons WHERE id = ?;";
    if(seasonId){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query( sql, [seasonId], function(err, rows) {
                if(!err && rows[0]){
                    season = {
                        id              : rows[0].id,
                        name            : rows[0].name,
                        description     : rows[0].description,
                        creation_date   : rows[0].creation_date.toISOString()
                    };
                }
                message = err;
                connection.release();
                // Don't use the db here, it has been returned to the pool.
                if(!message && season) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200);
                    res.end(season);
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
                    Status.setStatus(message.code, res);
                    res.end({message: message});
                }
            });
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(405);
        res.end({message: "seasonId can't be null"});
    }
};

exports.getAllSeasons = function(args, res, next) {
    var seasons = [];
    var message;
    var sql =   "SELECT * FROM seasons;";
    db.getConnection(function(err, connection) {
        message = err;
        connection.query(sql, function(err, rows) {
            if(!err && rows.length > 0){
                for(var i = 0; i != rows.length; i ++){
                    var season = {
                        id              : rows[i].id,
                        name            : rows[i].name,
                        description     : rows[i].description,
                        creation_date   : moment(rows[i].creation_date).format('YYYY-MM-DD HH:mm:ss')
                    };
                    seasons.push(season);
                }
            } else {
                if(err){
                    message = err;
                } else {
                    message = {
                        code: "NOT_FOUND"
                    }
                }
            }

            connection.release();
            // Don't use the db here, it has been returned to the pool.
            if(!message && seasons) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.end(seasons);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                Status.setStatus(message.code, res);
                res.end({message: message});
            }
        });
    });
};

exports.newSeason = function(args, res, next) {
    /**
     * parameters expected in the args:
     * season (Season)
     **/
    var insertId;
    var message;
    var season = args.season.value;
    var sql =   "INSERT INTO seasons (name, description)" +
                "VALUES (?, ?);";

    var validationSql = "SELECT COUNT(*) as num " +
                        "FROM seasons " +
                        "WHERE name = ?;"

    if(season){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query(validationSql, [season.name], function(err, rows){
                message = err;
                if(rows[0].num == 0){
                    connection.query( sql, [season.name, season.description], function(err, rows) {
                        if(!err){
                            insertId = rows.insertId;
                        }
                        message = err;
                        connection.release();
                        // Don't use the db here, it has been returned to the pool.

                        if(!message && insertId) {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(201);
                            res.end({id: insertId});
                        }
                        else {
                            res.setHeader('Content-Type', 'application/json');
                            Status.setStatus(message.code, res);
                            res.end({message: message});
                        }
                    });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    Status.setStatus('ER_DUP_ENTRY', res);
                    res.end({message: 'A season with the same name was found!'});
                }
            });
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(405);
        res.end({message: "season can't be null"});
    }
};

exports.updateSeason = function(args, res, next) {
    var message;
    var season = args.season.value;
    var seasonId = args.seasonId.value;
    var sql =   "UPDATE seasons " +
                "SET name=?, description=?" +
                "WHERE id = ?;";

    if(seasonId && season){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query( sql, [season.name, season.description, seasonId], function(err, rows) {
                message = err;
                connection.release();
                // Don't use the db here, it has been returned to the pool.

                if(!message) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(204);
                    res.end();
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
                    Status.setStatus(message.code, res);
                    res.end({message: message});
                }
            });
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(405);
        res.end({message: "season can't be null"});
    }
};