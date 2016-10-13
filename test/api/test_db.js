var mysql = require('mysql');
var db = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'tester',
    password : '18684d7ab61b689efa1db607218b05d1fd7c90096534abd7fcc5c8f4896ae5bc',
    database : 'code_and_comedy_test',
    multipleStatements: true
});

module.exports = db;