const express = require('express')
const {loginUser, signupUser, logoutUser} = require('../controllers/userController.js')
const ExpressBrute = require('express-brute')
const store = new ExpressBrute.MemoryStore();

const bruteForce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 1000 * 60,
    maxWait: 1000 * 60 * 10,
    lifetime: 1000 * 60 * 10
})

const router = express.Router();

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.post('/logout', logoutUser)

module.exports = router