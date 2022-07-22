import mongoose from 'mongoose'
import socialSchema from '../subModels/socialModel.js'
import getters from '../../lib/getters.js'

const settingsSchema = new mongoose.Schema(
    {
        siteName: String,
        copyRight: {
            link: {
                type: String,
                required: true,
                set: getters.toLower
            },
            label: {
                type: String,
                required: true
            }
        },
        siteBranding: {
            brand: {
                type: String,
                required: true
            },
            logo: {
                type: String,
                required: true
            }
        },
        social: [socialSchema],
        developer: {
            name: {
                type: String,
                required: true
            },
            subName: String,
            url: {
                type: String,
                set: getters.toLower
            }
        },
        siteData: Object
    },
    {
        timestamps: true
    }
)

const Settings = mongoose.model('Setting', settingsSchema, 'app-settings')

export default Settings
