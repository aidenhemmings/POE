const User = require('../models/userModel')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: '9d' });
}

const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.loginUser(email, password)

        const token = createToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.MODE_ENV === 'production',
            maxAge: 9 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        })

        res.status(200).json({email, token})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.signupUser(email, password)

        const token = createToken(user._id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.MODE_ENV === 'production',
            maxAge: 9 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        })

        res.status(200).json({email, user})
    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.MODE_ENV === 'production',
        expires: new Date(0)
    })

    res.status(200).json({message: 'Logged out successfully'})
}

module.exports = {
    loginUser,
    signupUser,
    logoutUser
}