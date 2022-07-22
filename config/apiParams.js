import Contact from '../models/app/contactModel.js'
import Account from '../models/app/accountModel.js'
import Vendor from '../models/app/vendorModel.js'
import Document from '../models/app/documentModel.js'
import User from '../models/app/userModel.js'
import Settings from '../models/app/settingsModel.js'
import Inventory from '../models/app/inventoryModel.js'

const apiParams = [
    {
        endpoint: 'settings',
        test: 'siteName',
        Model: Settings
    },
    {
        endpoint: 'contacts',
        test: 'fullName',
        Model: Contact
    },
    {
        endpoint: 'accounts',
        test: 'category',
        Model: Account
    },
    {
        endpoint: 'vendors',
        test: 'name',
        Model: Vendor
    },
    {
        endpoint: 'users',
        test: 'email',
        Model: User
    },
    {
        endpoint: 'documents',
        test: 'type',
        Model: Document
    },
    {
        endpoint: 'services',
        test: '_sID',
        Model: Service
    },
    {
        endpoint: 'inventory',
        test: 'title',
        Model: Inventory
    }
]

export default apiParams
