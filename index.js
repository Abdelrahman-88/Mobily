const express = require('express')
var cors = require('cors')
const dbConnection = require('./common/connection/confg')
const { userRouter } = require('./common/router/allRoutes')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('welcome'))
app.use(userRouter)
dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))