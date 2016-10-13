var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var db = require('../test_db');
var fs = require('fs');

var firstId = 1,
    newName = "Pannekoek met spek",
    season = {
        name:           'Testseason',
        description:    'Testdescription'
},  season2 = {
        name:           'Testseason 2',
        description:    'Testdescription 2'
},  faultySeason = {
        description:    'Testdescription'
},
    baseDir = "/api";


describe('controllers', function () {

    describe('seasons', function () {

        // test if inserting a faulty object results in a bad request error
        it('should return a bad request error', function (done) {
            request(server)
                .post(baseDir+'/season')
                .send(faultySeason)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.message.should.eql("Request validation failed: Parameter (season) failed schema validation");

                    done();
                });
        });


        // test if object is inserted and an insertId is returned
        it('should return the newly inserted object\'s Id', function (done) {
            request(server)
                .post(baseDir+'/season')
                .send(season)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.eql({id: firstId});

                    done();
                });
        });

        // add second season for testing purposes
        it('should return the second inserted object\'s Id', function (done) {
            request(server)
                .post(baseDir+'/season')
                .send(season2)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.eql({id: firstId+1});

                    done();
                });
        });

        // test if inserting same object twice results in a conflict error
        it('should return a conflict error', function (done) {
            request(server)
                .post(baseDir+'/season')
                .send(season)
                .set('Accept', 'application/json')
                .expect(409)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.eql({message: "A season with the same name was found!"});

                    done();
                });
        });

        // test the entire object for correctly stored & returned values
        it('should return the newly inserted object', function (done) {
            request(server)
                .get(baseDir+'/season/' + firstId)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.hasOwnProperty('id').should.eql(true);
                    res.body.hasOwnProperty('name').should.eql(true);
                    res.body.hasOwnProperty('description').should.eql(true);
                    res.body.hasOwnProperty('creation_date').should.eql(true);

                    res.body.id.should.eql(firstId);
                    res.body.name.should.eql(season.name);
                    res.body.description.should.eql(season.description);

                    done();
                });
        });

        // test if two seasons are returned
        it('should return both inserted seasons', function (done) {
            request(server)
                .get(baseDir+'/season/all')
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.length.should.eql(2);
                    res.body[0].name.should.eql('Testseason');
                    res.body[1].name.should.eql('Testseason 2');

                    done();
                });
        });

        // test if two seasons are returned
        it('should update the first season', function (done) {
            season.name = newName;
            season.id = firstId;
            request(server)
                .put(baseDir+'/season/'+season.id)
                .send(season)
                .set('Accept', 'application/json')
                .expect(204)
                .end(function (err, res) {
                    should.not.exist(err);

                    done(err);
                });
        });

        // test if the name has been properly updated by the previous test
        it('should return updated season', function (done) {
            request(server)
                .get(baseDir+'/season/' + firstId)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.name.should.eql(season.name);

                    done();
                });
        });
    });
});
