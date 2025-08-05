import express from 'express';
import { addUserBook, deleteUserBook, getNumOfUsers, getUserBooks, getUserById } from '../controllers/userController.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isAuth } from '../middlewares/isAuth.js';

const usersRouter = express.Router() 
usersRouter.use(isAuth)


usersRouter.route('/get-users-number').get(isAdmin, getNumOfUsers)
usersRouter.route('/:id').get(getUserById)
usersRouter.route('/:id/add-book').post(addUserBook)
usersRouter.route('/:id/books').get(getUserBooks)
usersRouter.route('/:userId/books/:bookId').delete(deleteUserBook)



export default usersRouter