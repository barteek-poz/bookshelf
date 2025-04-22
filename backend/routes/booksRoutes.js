import express from 'express'
import { getAllBooks, createBook, getBookById, deleteBook, updateBook, getUserBooks } from '../controllers/bookController.js'
import { upload, coverMiddleware } from '../middlewares/coverMiddleware.js'
import { isAuth } from '../controllers/authController.js'

const booksRouter = express.Router()
booksRouter.use(isAuth)

booksRouter.route('/').post(getUserBooks)
booksRouter.route('/add').post(upload.single("bookCover"), coverMiddleware, createBook)
booksRouter.route('/:id').get(getBookById).delete(deleteBook).patch(upload.single("bookCover"), coverMiddleware, updateBook)

export default booksRouter