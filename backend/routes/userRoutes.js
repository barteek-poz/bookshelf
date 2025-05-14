import express from 'express'
import { getAllUsers, deleteUser, getUserById, updateUser, getUserBooks, addUserBook, deleteUserBook } from '../controllers/userController.js'
import { updateUserBooks } from '../middlewares/updateUserBooks.js'
import { isAuth } from '../controllers/authController.js'

const usersRouter = express.Router()
usersRouter.use(isAuth)

usersRouter.route('/').get(getAllUsers)
usersRouter.route('/:id').get(getUserById).delete(deleteUser).patch(updateUser)
usersRouter.route('/:id/add-book').post(addUserBook)
usersRouter.route('/:id/books').get(updateUserBooks, getUserBooks)
usersRouter.route('/books/:bookId').delete(deleteUserBook)



export default usersRouter