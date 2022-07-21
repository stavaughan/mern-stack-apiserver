import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import messages from './utils/messages.js'
import {
    usersRouter,
    standardRouter,
    itemCollectionRouter,
    settingsRouter,
    imagesRouter,
    documentsRouter
} from './routes/routers.js'

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB()

const app = express()

app.disable('x-powered-by');

const jsonEncode = {
    limit: '50mb',
    extended: true
}

const corsOptions = {
    origin:['http://localhost:3000'],
    credentials:true
}

app.use(cookieParser())
app.use(express.json(jsonEncode))
app.use(express.urlencoded(jsonEncode))
app.use(helmet())
app.use(fileUpload())
app.use(cors(corsOptions))

/*
    These are samples of endpoints I used for a monolithic project.
    Going the microservice route, next time!!
    However, this worked for me.

    FYI: The endpoints are sample endpoints derived from an actual project I worked on.
    Change them to suit your needs.

    I created different routers to increase the readability of the code, while working on the larger project.
*/

app.use('/api/users', usersRouter)

// MongoDB single document collections
app.use('/api/owner', itemCollectionRouter)


app.use('/api/settings', settingsRouter)

// MongoDB multi document collections

app.use('/api/accounts', standardRouter)
app.use('/api/contacts', standardRouter)
app.use('/api/vendors', standardRouter)

// Cloudinary images or whatever image hosting service you prefer
app.use('/api/images', imagesRouter)

// pdf files stored in file system
app.use('/api/document-files', documentsRouter)

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.disable('verbose errors')
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
} else {
    app.enable('verbose errors')
    app.get('/', (req, res) => res.send(messages.root()))
}

// Forbidden Error Handler
app.get('/403', (req, res, next) => {
    const err = new Error(messages.noAccess())
    err.status = 403;
    next(err)
})

// Internal Server Error Handler
app.get('/500', (req, res, next) => {
    const err = new Error(messages.noAccess())
    err.status = 500;
    next(err)
})

// Not Found Error Handler
app.use((req, res, next) => {
    res.status(404)
    res.format({
        html: () => res.type('html').send(messages.notFound()),
        json: () => res.json({ error: messages.notFoundJSON }),
        default: () => res.type('txt').send(messages.notFoundText)
    })
})

// CSRF Attack Handler
app.use((err, req, res, next) => {
    if (err.code !== "EBADCSRFTOKEN") return next(err)
    res.status(403)
    res.send(messages.csrfAttack())
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Listening: http://localhost:${PORT}`))
