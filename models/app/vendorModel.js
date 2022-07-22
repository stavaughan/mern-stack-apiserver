import mongoose from 'mongoose'
import addressSchema from '../subModels/addressModel.js'
import websiteSchema from '../subModels/websiteModel.js'

const vendorSchema = new mongoose.Schema(
    {
        venID: String,
        name: {
            type: String,
            required: [true, 'Please add a vendor name']
        },
        incomeType: String,
        incomeIDs: [String],
        expenseIDs: [String],
        expenseTypes: [String],
        addresses: [addressSchema],
        websites: [websiteSchema],
        notes: String
    },
    {
        timestamps: true
    }
)

const Vendor = mongoose.model('Vendor', vendorSchema, 'vendors')

export default Vendor