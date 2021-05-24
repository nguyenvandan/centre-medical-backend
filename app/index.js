  require('@babel/register')({
    plugins: ['transform-class-properties', 'syntax-class-properties']
  });
  // require('console-stamp')(console);
  // const figlet = require('figlet');
  // const logger = require('./app/libs/logger');
  require('./server');
  