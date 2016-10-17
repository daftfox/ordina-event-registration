var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var db = require('../test_db');
var fs = require('fs');

var firstId = 1,
    newName = "Pannekoek met spek",
    event = {
    name:           'Testevent',
    description:    'Testdescription',
    season_id:      null,
    max_tickets:    250,
    fee:            10.5,
    location:       'Hoofdkantoor Ordina, Nieuwegein',
    end_sale_date:  '2017-01-31 13:00:00',
    event_date:     '2017-02-14 19:00:00'
},  event2 = {
    name:           'Testevent 2',
    description:    'Testdescription 2',
    season_id:      null,
    max_tickets:    250,
    fee:            10.5,
    location:       'Hoofdkantoor Ordina, Nieuwegein',
    end_sale_date:  '2017-01-31 14:00:00',
    event_date:     '2017-02-15 20:00:00'
},  faultyEvent = {
    description:    'Testdescription',
    season_id:      null,
    max_tickets:    250,
    fee:            10.5,
    location:       'Hoofdkantoor Ordina, Nieuwegein',
    end_sale_date:  '2017-01-31 12:00:00',
    event_date:     '2017-02-14 18:00:00'
};

var baseDir = "/api";


describe('controllers', function () {

    // reset the entire database before testing
    before(function (done) {
        var sql = fs.readFileSync('./test/api/init_database.sql', 'utf8');
        db.query(sql, function (err, res) {
            done();
        })
    });

    describe('events', function () {

        // test if inserting a faulty object results in a bad request error
        it('should return a bad request error', function (done) {
            request(server)
                .post(baseDir + '/event')
                .send(faultyEvent)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.body.message.should.eql("Request validation failed: Parameter (event) failed schema validation");

                    done();
                });
        });


        // test if object is inserted and an insertId is returned
        it('should return the newly inserted object\'s Id', function (done) {
            request(server)
                .post(baseDir+'/event')
                .send(event)
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.eql({id: firstId});

                    done();
                });
        });

        // add second event for testing purposes
        it('should return the second inserted object\'s Id', function (done) {
            request(server)
                .post(baseDir+'/event')
                .send(event2)
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
                .post(baseDir+'/event')
                .send(event)
                .set('Accept', 'application/json')
                .expect(409)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.eql({message: "An event with the same name is already planned for that date!"});

                    done();
                });
        });

        // test the entire object for correctly stored & returned values
        it('should return the newly inserted object', function (done) {
            request(server)
                .get(baseDir+'/event/' + firstId)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.hasOwnProperty('id').should.eql(true);
                    res.body.hasOwnProperty('name').should.eql(true);
                    res.body.hasOwnProperty('description').should.eql(true);
                    res.body.hasOwnProperty('season_id').should.eql(true);
                    res.body.hasOwnProperty('max_tickets').should.eql(true);
                    res.body.hasOwnProperty('location').should.eql(true);
                    res.body.hasOwnProperty('fee').should.eql(true);
                    res.body.hasOwnProperty('event_date').should.eql(true);
                    res.body.hasOwnProperty('creation_date').should.eql(true);
                    res.body.hasOwnProperty('end_sale_date').should.eql(true);

                    res.body.id.should.eql(firstId);
                    res.body.name.should.eql(event.name);
                    res.body.description.should.eql(event.description);
                    res.body.max_tickets.should.eql(event.max_tickets);
                    res.body.location.should.eql(event.location);
                    res.body.fee.should.eql(event.fee);
                    res.body.event_date.should.eql(event.event_date);
                    res.body.end_sale_date.should.eql(event.end_sale_date);

                    done();
                });
        });

        // test if two events are returned
        it('should return both inserted events', function (done) {
            request(server)
                .get(baseDir+'/event/all')
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.length.should.eql(2);
                    res.body[0].name.should.eql('Testevent');
                    res.body[1].name.should.eql('Testevent 2');

                    done();
                });
        });

        // test if two events are returned
        it('should update the first event', function (done) {
            event.name = newName;
            event.id = firstId;
            request(server)
                .put(baseDir+'/event')
                .send(event)
                .set('Accept', 'application/json')
                .expect(204)
                .end(function (err, res) {
                    should.not.exist(err);

                    done(err);
                });
        });

        // test if the name has been properly updated by the previous test
        it('should return updated event', function (done) {
            request(server)
                .get(baseDir+'/event/' + firstId)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.name.should.eql(event.name);

                    done();
                });
        });
    });
});
