var mysql = require('mysql');

// free, slow online db
/*var db = mysql.createPool({
    host     : 'db4free.net',
    user     : 'cnc_2',
    password : '18943318f90e38630d9c8d81eb81dedfdb15ec67e6479e209fbf529e6fb40333',
    database : 'code_and_comedy_',
    connectionLimit: 10
});*/

var db = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'cnc',
    password : '18943318f90e38630d9c8d81eb81dedfdb15ec67e6479e209fbf529e6fb40333',
    database : 'code_and_comedy',
    connectionLimit: 10
});

module.exports = db;