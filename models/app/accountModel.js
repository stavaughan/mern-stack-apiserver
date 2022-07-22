import mongoose from 'mongoose'
import primaryOwnerSchema from '../subModels/primaryOwnerModel.js'
import creditCardSchema from '../subModels/creditCardModel.js'

const accountSchema = new mongoose.Schema(
    {
        accountID: String,
        category: String,
        subCategory: String,
        accountType: String,
        role: String,
        venID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Vendor'
        },
        contacts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        }],
        accountNumber: String,
        routingNumber: String,
        cardDetails: creditCardSchema,
        accountName: String,
        accountHolder: String,
        primaryOwner: primaryOwnerSchema,
        secondaryOwner: primaryOwnerSchema,
        notes: String
    },
    {
        timestamps: true
    }
)

const Account = mongoose.model('Account', accountSchema, 'accounts')

export default Account
