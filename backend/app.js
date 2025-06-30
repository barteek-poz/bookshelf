import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import booksRouter from './routes/booksRoutes.js'
import genresRouter from './routes/genresRoutes.js'
import usersRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoutes.js'

const corsOptions = {
    origin: 'http://localhost:5173',  
    credentials: true,  
    allowedHeaders: ['Content-Type', 'Authorization'], 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  };

const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/books', booksRouter)
app.use('/api/v1/genres', genresRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/auth', authRouter)

export default app