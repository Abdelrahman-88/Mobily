const express = require('express')
var cors = require('cors')
require('dotenv').config()
const { dbConnection, conn } = require('./common/connection/confg')
const {
    userRouter,
    documentRouter,
    adminRouter,
    serviceRouter,
    orderRouter
} = require('./common/router/allRoutes')
const runJob = require('./common/jobs')


const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
    // app.use("/uploads", express.static("uploads"))

app.use(cors())

app.get('/', (req, res) => res.send('welcome'))
app.use(userRouter, documentRouter, adminRouter, serviceRouter, orderRouter)
dbConnection()

runJob()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))