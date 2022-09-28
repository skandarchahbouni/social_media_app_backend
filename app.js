require('dotenv').config()
const express = require("express")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const eventsRouter = require('./routes/events')
const uploadRouter = require('./routes/upload')
const notificationsRouter = require('./routes/notifications')
const errorHandler = require('./middlewares/error_handler')
const notFound = require('./middlewares/not_found')
const authenticationMiddleware = require('./middlewares/auth')

const app = express()

const corsConfig = {
    credentials: true,
    origin: true,
}


app.use('/static/images',express.static(__dirname + '/static/images'));
app.use(cors(corsConfig))

app.use(express.json())
app.use(cookieParser())


// Routes 
app.use('/api/auth', authRouter)
app.use('/api/users', authenticationMiddleware, usersRouter)
app.use('/api/posts', authenticationMiddleware,  postsRouter)
app.use('/api/events', authenticationMiddleware, eventsRouter)
app.use('/api/upload', authenticationMiddleware, uploadRouter)
app.use('/api/notifications', authenticationMiddleware, notificationsRouter)
app.use(errorHandler)
app.use(notFound)

const port = process.env.PORT || 8080
const start = () => {
    try {
        app.listen(port)
        console.log(`Server is running on port ${port}`)
    } catch (error) {
        console.log("Server is not listening")
    }
}

start()