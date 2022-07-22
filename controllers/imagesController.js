import asyncHandler from 'express-async-handler'
import Contact from '../models/app/contactModel.js'
import cloudinaryControllers from './cloudinaryControllers.js'
import controllerLogic from './controllerLogic.js'
import getters from '../lib/getters.js'

const imagesController = {

    /**
     * @desc Get inventory images ID's
     * @route GET /api/images/inventory
     * @access Private
     */
    getInventoryImages: asyncHandler(async (req, res) => {
        return await cloudinaryControllers.getCloudinaryData({
            res,
            filter: 'folder: inventory',
            max: 200
        })
    }),

    /**
     * @desc Upload inventory image
     * @route POST /api/images/inventory
     * @access Private
     */
    uploadInventoryImage: asyncHandler(async (req, res) => {

        const data = req.body;
        const name = getters.getName(data.name, 5)

        const size = Number(data?.size);

        const MAX_SIZE = 1 * 1024 * 1024;

        if (size > MAX_SIZE) {
            res.status(401)
            throw new Error('Image too large. Make sure image is less than 1MB')
        }

        try {
            const uploadedImage = await cloudinaryControllers.uploadCloudinaryData({
                res,
                // base64 image format
                dataUrl: data.url,
                pid: name,
                folder: 'inventory',
                msgSuccess: `Success! Invoice item image ${name} has been uploaded.`
            });
            return uploadedImage
        } catch (error) {
            throw new Error(error)
        }
    }),

    /**
     * @desc Upload avatar image
     * @route POST /api/images/avatars
     * @access Private
     */
    uploadAvatarImage: asyncHandler(async (req, res) => {

        const data = req.body;
        const avatarID = getters.getName(data.name, 5);

        const size = Number(data?.size);

        const MAX_SIZE = 1 * 1024 * 1024;

        if (size > MAX_SIZE) {
            res.status(401)
            throw new Error('Image too large. Make sure image is less than 1MB')
        }

        if (data?.id !== 'new') {
            await controllerLogic.updateCollection(Contact, data.id, { avatarID })
        }

        try {
            const uploadedImage = await cloudinaryControllers.uploadCloudinaryData({
                res,
                // base64 image format
                dataUrl: data.url,
                pid: avatarID,
                folder: 'profile-images',
                msgSuccess: `Success! Avatar ${avatarID} has been uploaded.`
            });
            return uploadedImage
        } catch (error) {
            throw new Error(error)
        }
    })
}

export default imagesController
