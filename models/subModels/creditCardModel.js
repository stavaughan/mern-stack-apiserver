import mongoose from 'mongoose'
import getters from '../../lib/getters.js'

const creditCardSchema = new mongoose.Schema(
    {
        nameOnCard: String,
        creditCardNumber: {
            type: String,
            get: getters.obfuscateCC
        },
        expDate: String,
        cvc: String,
        zip: String
    }
)

export default creditCardSchema
