import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a document title']
        },
        description: String,
        group: String,
        file: {
            type: String,
            required: [true, 'Please add a document file']
        },
        stateSigned: String,
        dateString: Number,
        dateForm: String,
        accounts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor'
        }]
    },
    {
        timestamps: true
    }
)

const Document = mongoose.model('Document', documentSchema, 'documents')

export default Document
