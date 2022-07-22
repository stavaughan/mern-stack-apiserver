import mongoose from 'mongoose'
import securityQuestionSchema from './securityQuestionModel.js'

const accountLoginSchema = new mongoose.Schema(
    {
        url: String,
        username: String,
        password: String,
        pin: Number,
        securityMessage: String,
        securityQuestions: [securityQuestionSchema]
    },
    { 
        _id : false 
    }
)

export default accountLoginSchema