import express from 'express'
import imagesController from '../controllers/imagesController.js'
import { protect } from '../middleware/authMiddleware.js'

const {
    getInventoryImages,
    uploadInventoryImage,
    uploadAvatarImage,
    uploadBusLogo
} = imagesController;

const imagesRouter = express.Router();

imagesRouter.route('/inventory').get(protect, getInventoryImages).post(protect, uploadInventoryImage)
imagesRouter.route('/avatars').post(protect, uploadAvatarImage)
imagesRouter.route('/logos').post(protect, uploadBusLogo)

export default imagesRouter
