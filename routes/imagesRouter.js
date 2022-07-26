import express from 'express'
import imagesController from '../controllers/imagesController.js'
import { protect } from '../middleware/authMiddleware.js'

const {
    getInventoryImages,
    uploadInventoryImage,
    uploadAvatarImage
} = imagesController;

const imagesRouter = express.Router();

imagesRouter.route('/inventory').get(protect, getInventoryImages).post(protect, uploadInventoryImage)
imagesRouter.route('/avatars').post(protect, uploadAvatarImage)

export default imagesRouter
