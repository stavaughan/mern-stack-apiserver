import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs';

const documentsDirectory = '/backend/data/documents/';

const fileUpload = {

    getDocument: async (req, res) => {

        const { id } = req.params;
        const filePath = `.${documentsDirectory + id}.pdf`;

        if (!fs.existsSync(filePath)) {
            res.status(404)
            throw new Error('the file does not exist.')
        }

        try {
            const file = fs.createReadStream(filePath);
            file.pipe(res);

        } catch (err) {
            res.status(401)
            throw new Error(err)
        }
    },

    upLoadDocument: async (req, res) => {

        if (req.files === null) {
            res.status(401)
            throw new Error("no file was uploaded")
        }

        const file = req.files.file;
        const fileName = file.name.replaceAll(' ', '');
        const documentFile = documentsDirectory + fileName;

        file.mv(`.${documentFile}`, (err) => {
            if (err) {
                res.status(500)
                throw new Error(err)
            }
            res.json({ fileName, filePath: documentFile })
        })
    }
}

export default fileUpload
