import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
const morgan = require('morgan')
const appRoot = require("app-root-path");
const path = require('path')
const fs = require('fs')

import mongodb from './libs/mongodb'
import baseResponse from './libs/baseResponse'
import corsOptionDelegate from './libs/corsOption'
const logger = require('./libs/logger')

import router from './feature'

const app = express()

// --------------------------------------------------
app.use(express.static(path.join(appRoot.toString(), "documents_patient")));

// setup logging
const logDirectory = path.join(appRoot.toString(), 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
} else {
  app.use(cors(corsOptionDelegate))
}

// console log, default if stream option is not set, show log on console
app.use(morgan('tiny', { stream: { write: (message, encoding) => { logger.info(message) } } }))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(helmet())
app.use(cookieParser())
app.use(baseResponse)

app.use('/', router)
app.get('/', (req, res) => {
  res.status(200).send('Welcome')
})

app.use((err, req, res, next) => {
  // err is error from next(e) function
  // you can do all error processing here, logging, parsing error messages, etc...
  // res.status(500).send('Something broke!')
  res.status(500).json({
    message: err.message,
    status: 'error'
  })
})

// app.use((req, res, next) => {
//   // add an unique request id to every api call
//   // usefull for tracing an request transaction
//   req.reqId = uuidv4()
//   next()
// })

const dbInMemoryHandler = require('./config/jest/db-handler.js')
const dbConnect = () => {
  mongodb.connect(err => {
    if (err) logger.error(err)
    logger.info('Connection has been established successfully')
  })
}
logger.info('process.env.NODE_ENV  ==> ', process.env.NODE_ENV)
process.env.NODE_ENV === 'Test' ? dbInMemoryHandler.connect() : dbConnect()

// Serve document files
app.get('/sendMePDF/:firstDirectory/:secondDirectory/:thirdDirectory/:fileName', function(req, res) {
  const {firstDirectory, secondDirectory, thirdDirectory, fileName} = req.params;
  const filePath = path.join(appRoot.toString(), firstDirectory, secondDirectory, thirdDirectory, fileName);
  logger.info("sendMePDF", filePath);
  res.sendFile(filePath);
})

export default app
