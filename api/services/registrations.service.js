'use strict';

var db = require("../../db");
var Status = require("../helpers/Status.helper");

exports.registerUser = function(args, res, next) {
    /**
     * parameters expected in the args:
     * eventId (Unsigned Integer)
     * registration (Registration)
     **/
    var insertId;
    var message;
    var registration = args.registration.value;

    var sql =   "INSERT INTO registrations (name, email, event_id)" +
                "VALUES (?, ?, ?);";

    if(registration){
        db.getConnection(function(err, connection) {
            message = err;
            connection.query( sql, [registration.name, registration.email, registration.event_id], function(err, rows) {
                message = err;
                connection.release();
                // Don't use the db here, it has been returned to the pool.

                if(!message) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(201);
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
        res.end({message: "registration can't be null"});
    }
}