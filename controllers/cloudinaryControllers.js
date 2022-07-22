import cloudinary from '../config/cloudinary.js'

const cloudinaryControllers = {

    getCloudinaryData: async ({ res, filter, max }) => {
        const { resources } = await cloudinary.v2.search
            .expression(filter)
            .sort_by('public_id', 'desc')
            .max_results(max)
            .execute();

        const publicIds = resources.map((file) => ({
            pid: file.public_id,
            url: file.url, // http: for development only
            //secure_url: file.secure_url // https: use for production
        }))
        res.send(publicIds)
    },

    uploadCloudinaryData: async ({res, dataUrl, pid, folder, msgSuccess}) => {
        try {
            const uploadResponse = await cloudinary.v2.uploader.upload(dataUrl, {
                public_id: pid,
                folder
            });
            res.json({ 
                msg: msgSuccess,
                pid
            })
        } catch (err) {
            res.status(500)
            throw new Error(err)
        }
    }
};

export default cloudinaryControllers;
