import asyncHandler from 'express-async-handler'
import fileUpload from './fileUpload.js'

const documentsController = {

    /**
     * @desc Get documents from file directory
     * @route GET /api/document-files/:id
     * @access Private
     */
    getDocument: asyncHandler(async (req, res) => await fileUpload.getDocument(req, res)),

    /**
     * @desc Upload new document to documents directory
     * @route POST /api/document-files/
     * @access Private
     */
    upLoadDocument: asyncHandler(async (req, res) => await fileUpload.upLoadDocument(req, res))
}

export default documentsController
