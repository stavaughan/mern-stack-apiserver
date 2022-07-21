import express from 'express'
import requestControllers from '../controllers/requestControllers.js'
import { protect } from '../middleware/authMiddleware.js'
const {
    getItems,
    setItem,
    updateItem,
    deleteItem
} = requestControllers;

const itemCollectionRouter = express.Router();

itemCollectionRouter.route('/').get(protect, getItems).post(protect, setItem)
itemCollectionRouter.route('/:id').patch(protect, updateItem)
itemCollectionRouter.route('/:id').delete(protect, deleteItem)

export default itemCollectionRouter