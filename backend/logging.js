const {createLogger , transports} = require('winston')
const LokiTransport = require("winston-loki")

const options = {
    transports: [new LokiTransport({labels:{appName:'EventDesk'},
        host: 'http://78.47.29.73:3100'})],
  }
  
const logger = createLogger(options)

module.exports = {logger} 