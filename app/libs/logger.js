let path = require("path");
let fs = require("fs");
let appRoot = require("app-root-path"); // get abs path of server
let winston = require("winston"); // lib to create logger 

// check exists and create new directory if neccessary
let logDirectory = path.resolve(`${appRoot}`, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// conventional log level increase with priority descending:
// error: 0, info: 2, warn: 1, http: 3, verbose: 4, debug: 5, silly: 6
// ex: logger.error, logger.warn, ... logger.silly

// option to save log to file
let options = {
  infofile: {
    level: "silly", // maximum level log that will be saved to this file. In this case, save log for level 'silly' and below 
    filename: path.resolve(logDirectory, "info.log"),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB, below 
    maxFiles: 2,
  },
  errorfile: {
    level: "error", // maximum level log that will be saved to this file. In this case, save log for level 'error' and below 
    filename: path.resolve(logDirectory, "error.log"),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 2,
  },
};

// create logger 
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(
      // format of log that will be printed in .log files
      info =>`${info.timestamp} ${info.level}: ${info.message} ${(info.splat !== undefined ? `${info.splat}` : " ")}`
    )
  ),
  transports: [
    new winston.transports.File(options.infofile), // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File(options.errorfile) // - Write all logs with level `error` and below to `error.log`
  ],
});

// add console log command to diff log levels from silly to error. This will print log to console for development mode
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: "silly", // maximum level log that will be printed to console (silly and bellow)
    format: winston.format.combine(winston.format.colorize({ all:true })),
    handleExceptions: true,
  }));
}

module.exports = logger;
