var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var db = require('../test_db');
var fs = require('fs');

var firstId = 1,
    registration = {
        name: "Testuser",
        email: "testuser@ordina.nl",
        event_id: 1
    },
    baseDir = "/api";


describe('controllers', function () {

    describe('registrations', function () {

        // test if object is inserted and an insertId is returned
        it('should return the newly inserted object\'s Id', function (done) {
            request(server)
                .post(baseDir+'/registration')
                .send(registration)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);

                    done();
                });
        });
    });
});
