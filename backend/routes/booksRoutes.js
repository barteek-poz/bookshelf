import express from 'express';
import {
	getAllBooks,
	createBook,
	getBookById,
	deleteBook,
	updateBook,
	searchBookByTitle,
	getRecentBooks,
} from '../controllers/bookController.js';
import { upload, coverMiddleware } from '../middlewares/coverMiddleware.js';
import { isAuth } from '../middlewares/isAuth.js';
import { canEdit } from '../middlewares/canEdit.js';

const booksRouter = express.Router();
booksRouter.use(isAuth);

booksRouter.route('/search-by-title').post(searchBookByTitle);
booksRouter.route('/get-recent').get(getRecentBooks);
booksRouter
	.route('/add')
	.post(upload.single('bookCover'), coverMiddleware, createBook);
booksRouter
	.route('/:id')
	.get(getBookById)
	.delete(deleteBook)
booksRouter
.route('/:id/edit')
.get(canEdit,getBookById)
.patch(canEdit, upload.single('bookCover'), coverMiddleware, updateBook )

export default booksRouter;
