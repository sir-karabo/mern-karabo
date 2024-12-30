const express = require('express')
const router = express.Router()

const User = require('./user.model')
const generateToken = require('../middleware/generate-token')

// Register endpoint
router.get('/register', async (req, res) => {
    try {
        // const { username, email, password } = req.body
        // const user = new User({ email, username, password })

        // await user.save()

        res.status(201).send({ message: 'User registered successfully' })
    } catch (error) {
        console.error('Error registering user', error)
        res.status(500).send({ message: 'Error registering user' })
    }
})

module.exports = router