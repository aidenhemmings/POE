require('dotenv').config()

const express = require('express')
const userRoutes = require('./routes/userRouter')
const https = require('https')
const path = require('path')
const fs = require('fs')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(csrf({
    cookie:{
        httpOnly: true,
        secure: process.env.MODE_ENV === 'production',
        sameSite: 'lax'
    } 
}))

app.get('/api/csrf-token', (req, res) => {
    res.json({csrfToken: req.csrfToken()});
})

app.use('/api/user', userRoutes)

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    console.log(req.path, req.method)
    next()
})

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

const sslServer = https.createServer({
    key:fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert:fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        sslServer.listen(process.env.PORT, () => {
            console.log('HTTPS Server successfully connected on port 5000')
        })
    })
    .catch((error) => {
        console.log(error)
    })