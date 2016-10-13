'use strict';

var db = require("../../db");
var Status = require("../helpers/Status.helper");
var moment = require('moment');

exports.availability = function(args, res, next) {
    /**
     * parameters expected in the args:
     * eventId (Unsigned Integer)
     **/
    var availability = 0; // default
    var message;
    var eventId = args.eventId.value;
    var sql =   "SELECT" +
                    "(SELECT max_tickets as availability FROM events WHERE id = ?) - " +
                    "(SELECT COUNT(*) FROM registrations WHERE event_id = ?) as availability;";

    if(eventId){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query( sql, [eventId, eventId], function(err, rows) {
                if(!err && rows[0]){
                    availability = rows[0].availability || 0;
                }
                message = err;
                connection.release();
                // Don't use the db here, it has been returned to the pool.

                if(!err && availability >= 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200);
                    res.end({availability: availability});
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
        Status.setStatus(405);
        res.end({message: "eventId can't be null"});
    }
};

exports.getAllEvents = function(args, res, next) {
    var events = [];
    var message;
    var sql =   "SELECT * FROM events;";
    db.getConnection(function(err, connection) {
        message = err;
        connection.query(sql, function(err, rows) {
            if(!err && rows.length > 0){
                for(var i = 0; i != rows.length; i ++){
                    var event = {
                        id              : rows[i].id,
                        name            : rows[i].name,
                        season_id       : rows[i].season_id,
                        event_date      : moment(rows[i].event_date).format('YYYY-MM-DD HH:mm:ss'),
                        description     : rows[i].description,
                        max_tickets     : rows[i].max_tickets,
                        fee             : rows[i].fee,
                        location        : rows[i].location,
                        end_sale_date   : moment(rows[i].end_sale_date).format('YYYY-MM-DD HH:mm:ss'),
                        creation_date   : moment(rows[i].creation_date).format('YYYY-MM-DD HH:mm:ss')
                    };
                    events.push(event);
                }
            }
            message = err;
            connection.release();
            // Don't use the db here, it has been returned to the pool.
            if(!message && events) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200);
                res.end(events);
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                Status.setStatus(message.code, res);
                res.end({message: message});
            }
        });
    });
};

exports.getEvent = function(args, res, next) {
    /**
     * parameters expected in the args:
     * eventId (Unsigned Integer)
     **/
    var event;
    var message;
    var eventId = args.eventId.value;
    var sql =   "SELECT * FROM events WHERE id = ?;";
    if(eventId){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query( sql, [eventId], function(err, rows) {
                if(!err && rows[0]){
                    event = {
                        id              : rows[0].id,
                        name            : rows[0].name,
                        season_id       : rows[0].season_id || null,
                        event_date      : moment(rows[0].event_date).format('YYYY-MM-DD HH:mm:ss'),
                        description     : rows[0].description,
                        max_tickets     : rows[0].max_tickets,
                        fee             : rows[0].fee,
                        location        : rows[0].location,
                        end_sale_date   : moment(rows[0].end_sale_date).format('YYYY-MM-DD HH:mm:ss'),
                        creation_date   : moment(rows[0].creation_date).format('YYYY-MM-DD HH:mm:ss')
                    };
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
                if(!message && event) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200);
                    res.end(event);
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
        res.end({message: "eventId can't be null"});
    }
};

exports.newEvent = function(args, res, next) {
    /**
     * parameters expected in the args:
     * event (Event object)
     **/
    var insertId;
    var message;
    var event = args.event.value;
    var sql =   "INSERT INTO events (name" +
                                    ", season_id" +
                                    ", description" +
                                    ", max_tickets" +
                                    ", fee" +
                                    ", location" +
                                    ", end_sale_date" +
                                    ", event_date)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
    var validationDate = moment(event.event_date).format('YYYY-MM-DD');
    var validationSql = "SELECT COUNT(*) as num " +
                        "FROM events " +
                        "WHERE DATE(event_date) = ? AND name = ?";

    if(event){
        db.getConnection(function(err, connection) {
            message = err;

            connection.query(validationSql, [validationDate, event.name], function(err, rows){
                if(rows[0].num == 0){
                    message = err;
                    connection.query( sql, [event.name,
                        event.season_id,
                        event.description,
                        event.max_tickets,
                        event.fee,
                        event.location,
                        event.end_sale_date,
                        event.event_date], function(err, rows) {
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
                    res.end({message: "An event with the same name is already planned for that date!"});
                }
            });
        });
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(405);
        res.end({message: "event can't be null"});
    }
};

exports.updateEvent = function(args, res, next) {
    /**
     * parameters expected in the args:
     * eventId (Unsigned Integer)
     * event (Event object)
     **/
    var message;
    var event = args.event.value;
    var sql =   "UPDATE events " +
                "SET name=?" +
                ", season_id=?" +
                ", description=?" +
                ", max_tickets=?" +
                ", fee=?" +
                ", location=?" +
                ", end_sale_date=?" +
                ", event_date=?" +
                "WHERE id = ?;";

    if(event){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query( sql, [event.name,
                event.season_id,
                event.description,
                event.max_tickets,
                event.fee,
                event.location,
                event.end_sale_date,
                event.event_date,
                event.id], function(err, rows) {
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
        res.end({message: "event can't be null"});
    }
};