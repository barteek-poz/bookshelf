import express from 'express';
import { addUserBook, deleteUserBook, getUserBooks, getUserById } from '../controllers/userController.js';
import { isAuth } from '../middlewares/isAuth.js';

const usersRouter = express.Router() 
usersRouter.use(isAuth)

usersRouter.route('/:id').get(getUserById)

// usersRouter.route('/').get(getAllUsers)
usersRouter.route('/:id/add-book').post(addUserBook)
usersRouter.route('/:id/books').get(getUserBooks)
usersRouter.route('/:userId/books/:bookId').delete(deleteUserBook)



export default usersRouter