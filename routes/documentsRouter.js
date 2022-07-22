import express from 'express'
import documentsController from '../controllers/documentsController.js'
import { protect } from '../middleware/authMiddleware.js'

const { getDocument, upLoadDocument } = documentsController;

const documentsRouter = express.Router();

documentsRouter.route('/:id').get(protect, getDocument)
documentsRouter.route('/').post(protect, upLoadDocument)

export default documentsRouter
