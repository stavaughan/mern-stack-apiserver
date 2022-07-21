import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import getters from '../lib/getters.js'

export const tokenHandler = {

    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET, { 
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    },
    
    async createUserToken(user, code, req, res) {

        const token = generateToken(user._id);

        const days = 30;

        res.cookie('jwt', token, {
            expires: getters.expirationDate(days), 
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https', 
            sameSite: 'none'
        });
    
        user.password = undefined;

        const resultObject = {
            status: 'success',
            data: { user },
            token,
        }

        res.status(code).json(resultObject);
    },
    
    async getHashedPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);
        return hashedPW
    }
}