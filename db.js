var mysql = require('mysql');
var db = mysql.createPool({
    host     : '127.0.0.1',
    user     : 'cnc',
    password : '18943318f90e38630d9c8d81eb81dedfdb15ec67e6479e209fbf529e6fb40333',
    database : 'code_and_comedy',
    connectionLimit: 10
});

module.exports = db;