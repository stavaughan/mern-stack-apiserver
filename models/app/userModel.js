import mongoose from 'mongoose'
import getters from '../../lib/getters.js'

const userSchema = new mongoose.Schema(
    {
        userID: String,
        email: {
            type: String,
            required: [true, 'Please add your email'],
            unique: true,
            set: getters.toLower
        },
        verified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        contactID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        },
        access: {
            type: String,
            enum: ['admin', 'read']
        },
        userRole: {
            type: String,
            enum: ['admin', 'approvedvisitor']
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema, 'users')

export default User
