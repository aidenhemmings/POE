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

const corsOptions = {
    origin: ['http://localhost:3000', 'https://localhost:3000'],
    credentials: true
};

const app = express()


app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// CSRF protection middleware
app.use(csrf({
    cookie: {
        httpOnly: false,
        secure: process.env.MODE_ENV === 'production', // Ensure secure cookies in production
        sameSite: 'lax'
    }
}));

app.get('/api/csrf-token', (req, res) => {
    console.log('csrf token generated', req.csrfToken)
    res.json({csrfToken: req.csrfToken()});
})

app.use('/api/user', userRoutes)

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    console.log(req.path, req.method)
    next()
})


const sslServer = https.createServer({
    key:fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert:fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        sslServer.listen(process.env.PORT, () => {
            console.log('HTTPS Server successfully connected on port ', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log('MongoDB conn error: ', error)
    })