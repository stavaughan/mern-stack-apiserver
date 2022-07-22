import mongoose from 'mongoose'
import addressSchema from './addressModel.js'

const addressesSchema = new mongoose.Schema(
    {
        physical: addressSchema,
        sameAsPhysical: Boolean,
        mailing: addressSchema
    },
    { 
        _id : false 
    }
)

export default addressesSchema