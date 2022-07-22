import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/app/userModel.js'
import messages from '../utils/messages.js'

export const protect = asyncHandler(async (req, res, next) => {

    const authorization = await req.headers?.authorization;

    if (authorization && authorization.startsWith('Bearer')) {

        // Get token from header
        const token = authorization.split(' ')[1]

        if (!token) {
            res.status(403)
            throw new Error(messages.controllers.users.missingAuthToken)
        }

        try {

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            if(decoded?.id){
                req.user = await User.findById(decoded.id).select('-password')
            }

            next()
        } catch (error) {
            res.status(403).send(error)
        }
    } else {
        res.status(401)
        throw new Error(messages.controllers.users.missingAuthToken)
    }
})

export const verifyEmail = asyncHandler(async (req, res, next) => {

    const email = req.body?.email;

    if (!email) {
        res.status(400)
        throw new Error('Please provide your email..')
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() })

    // email verification
    // Temporary
    const emailVerified = await userExists?.email;

    if (emailVerified) {
        next()
    } else {
        res.status(401)
        throw new Error('User email cannot be verified at this time. Please check your email or enter a correct one.')
    }
})

export const verifyUser = asyncHandler(async (req, res, next) => {
    const { firstName, email, password } = req.body

    if (!firstName || !email || !password) {
        res.status(400)
        throw new Error('Please provide firstName, email and password!')
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() })

    if (userExists) {
        res.status(400)
        throw new Error('User is already registered!')
    }

    // email verification
    const emailVerified = !!email

    if (emailVerified) {
        next()
    } else {
        res.status(401)
        throw new Error('Invalid user data')
    }
})
