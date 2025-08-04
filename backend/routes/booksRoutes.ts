import express from 'express';
import {
	createBook,
	deleteBook,
	getAllBooks,
	getBookById,
	getRecentBooks,
	searchBookByTitle,
	updateBook
} from '../controllers/bookController.js';
import { canEdit } from '../middlewares/canEdit.js';
import { coverMiddleware, upload } from '../middlewares/coverMiddleware.js';
import { isAuth } from '../middlewares/isAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const booksRouter = express.Router();

booksRouter.use(isAuth);

booksRouter.route('/get-all').get(getAllBooks);
booksRouter.route('/search-by-title').post(searchBookByTitle);
booksRouter.route('/get-recent').get(getRecentBooks);
booksRouter
	.route('/add')
	.post(upload.single('bookCover'), coverMiddleware, createBook);
booksRouter
	.route('/:id')
	.get(getBookById)
	.delete(isAdmin, deleteBook)
booksRouter
.route('/:id/edit')
.get(canEdit,getBookById)
.patch(canEdit, upload.single('bookCover'), coverMiddleware, updateBook )

export default booksRouter;
