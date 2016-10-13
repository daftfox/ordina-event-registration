'use strict';

var SwaggerExpress = require('swagger-express-mw');
var cors = require('cors');
var app = require('express')();
var path = require('path');
module.exports = app; // for testing

var port = 3000; // default

var baseDir = "";
var env = 'single_instance'; // default for single instance mode (when back-end is not running in the stack)
var dir = path.parse(process.cwd());

// check if the back-end is running in single instance mode or in the stack
if(dir.base !== 'back-end'){
  baseDir = './back-end/';
  env = undefined;
}

if(env){
  process.env.NODE_ENV = env;
}

var config = {
  appRoot:      "./", // required config
  swaggerFile:  baseDir + "api/swagger/swagger.yaml"
};

process.env.NODE_CONFIG_DIR = baseDir + "config/";

app.use(cors());

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  if(env){
    app.set('port', port);
    app.listen(port, function(){
      console.log('Backend server listening on port ' + app.get('port') + ' in ' + app.get('env') + ' mode');
    })
  }
});