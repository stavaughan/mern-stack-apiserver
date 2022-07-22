import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
    {
        //TODO: change type to 'title' and 'title' to description
        type: String,
        title: {
            type: String,
            required: [true, 'Please add a document title']
        },
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