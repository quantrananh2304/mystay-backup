const app = require('express')()
const bodyParser = require('body-parser')
const { facebookConversionApi } = require('./controllers/facebook.controller')
const { getAccesstoken, getClientSession } = require('./controllers/tripla.controller')

app.use(bodyParser.json())

app.post('/getAccesstoken', getAccesstoken)

app.post('/getClientSession', getClientSession)

app.get('/facebook-conversion-api', facebookConversionApi)

module.exports = {
  path: '/api/',
  handler: app
}
