import express from 'express';
import { addUserBook, deleteUserBook, getAllUsers, getUserBooks, getUserById } from '../controllers/userController.js';
import { isAuth } from '../middlewares/isAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const usersRouter = express.Router() 
usersRouter.use(isAuth)

usersRouter.route('/get-all').get(isAdmin, getAllUsers)
usersRouter.route('/:id').get(getUserById)
usersRouter.route('/:id/add-book').post(addUserBook)
usersRouter.route('/:id/books').get(getUserBooks)
usersRouter.route('/:userId/books/:bookId').delete(deleteUserBook)



export default usersRouter