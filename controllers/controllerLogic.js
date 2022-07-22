import messages from '../utils/messages.js'

const msgs = messages.controllers.collections

const controllerLogic = {

    updateCollection: async (Collection, reqID, reqBody) => {
        const collectionItemToUpdate = await Collection.findById(reqID)
        if (!collectionItemToUpdate) {
            res.status(401)
            throw new Error(msgs.updateItem(reqID))
        }
        const updatedCollectionItem = await Collection.findByIdAndUpdate(reqID, reqBody, {
            new: true
        })
        return updatedCollectionItem
    },

    getCollectionItem: async (Collection, req, res) => {
        const reqID = req.params.id;
        const collectionItem = await Collection.findById(reqID)
        try {
            if (collectionItem) {
                res.status(200).json(collectionItem)
            } else {
                res.status(204).json({ 
                    message: msgs.noContent 
                })
            }
        } catch (err) {
            throw new Error(err)
        }
    },

    getCollectionItems: async (Collection, req, res) => {
        const collectionResults = await Collection.find();
        try {
            if (collectionResults) {
                res.status(200).json(collectionResults)
            } else {
                res.status(204).json({ message: msgs.noContent })
            }
        } catch (err) {
            throw new Error(err)
        }
    },

    setNewCollectionItem: async (Collection, testField, req, res) => {
        if (!req.body[testField]) { 
            res.status(401)
            throw new Error(msgs.newItem)
        }
        try {
            const newCollectionItem = await Collection.create(req.body)
            res.status(200).json(newCollectionItem)
        } catch (err) {
            throw new Error(err)
        }
    },

    setNewCollectionItems: async (Collection, req, res) => {
        if (!req.body?.length) {
            res.status(401)
            throw new Error(msgs.newItems)
        }
        try {
            const newCollectionItems = await Collection.insertMany(req.body)
            res.status(200).json(newCollectionItems)
        } catch (err) {
            throw new Error(err)
        }
    },

    updateCollectionItem: async (Collection, req, res) => {
        const reqID = req.params.id;
        const reqBody = req.body;
        try {
            const updatedCollectionItem = await controllerLogic.updateCollection(Collection, reqID, reqBody)
            res.status(200).json(updatedCollectionItem)
        } catch (err) {
            throw new Error(err)
        }
    },

    updateCollectionItems: async (Collection, req, res) => {
        const data = req.body;
        const ids = data.map(item => item.id);

        const collectionItemsToUpdate = await Collection.find({ '_id': { $in: ids } });

        if (!collectionItemsToUpdate) {
            res.status(401)
            throw new Error(msgs.updateItem(`ids: ${ids.join(',')}`))
        }
        try {
            let updatedData = []

            for (const id of ids) {
                const documentData = await data.find(item => item.id === id).reqBody;
                const updatedCollectionItem = await Collection.findByIdAndUpdate(id, documentData, {
                    new: true
                })
                updatedData.push(updatedCollectionItem)
            }
            res.status(200).json(updatedData)
        } catch (err) {
            throw new Error(err)
        }
    },

    deleteCollectionItem: async (Collection, req, res) => {
        const reqID = req.params.id;
        const collectionItemToDelete = await Collection.findById(reqID)
        const idToDelete = await collectionItemToDelete?._id;
        if (!idToDelete) {
            res.status(204).json({ message: msgs.noContent })
        }
        try {
            await collectionItemToDelete.remove()
            res.status(200).json({ id: reqID })
        } catch (err) {
            throw new Error(err)
        }
    },

    deleteCollectionItems: async (Collection, req, res) => {
        const reqIDs = req.params.id;
        const ids = reqIDs.split('_');
        const collectionResults = await Collection.find();
        if (!collectionResults?.length) {
            res.status(401)
            throw new Error(msgs.deleteItems(ids.join(', ')))
        }
        try {
            await collectionResults.deleteMany({ _id: ids.includes(_id) })
            res.status(200).json({ ids })
        } catch (err) {
            throw new Error(err)
        }
    }
}

export default controllerLogic