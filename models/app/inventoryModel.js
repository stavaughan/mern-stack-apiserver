import mongoose from 'mongoose'
import getters from '../../lib/getters.js'

const { toLower } = getters

const inventorySchema = new mongoose.Schema(
    {
        userID: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        category: {
            type: String,
            required: true,
            enum: [
                'collectibles',
                'furniture',
                'footwear',
                'fine china',
                'dinnerware',
                'electronics',
                'clothing',
                'firearms',
                'tools',
                'cds',
                'books',
                'cookingware',
                'crystal',
                'rugs',
                'art'
            ]
        },
        imageID: String,
        images: [String],
        subcategory: String,
        title: {
            type: String,
            required: true
        },
        description: String,
        size: String,
        materials: [String],
        quantity: {
            type: Number,
            default: 1
        },
        brand: String,
        marketValue: {
            retail: Number,
            wholesale: Number
        },
        urls: [{
            type: String,
            set: toLower
        }],
        comments: String
    },
    {
        timestamps: true
    }
)

const Inventory = mongoose.model('Inventory', inventorySchema, 'inventory')

export default Inventory
