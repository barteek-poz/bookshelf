import express from 'express'
import { getAllUsers, deleteUser, getUserById, updateUser, getUserBooks } from '../controllers/userController.js'
import { updateUserBooks } from '../middlewares/updateUserBooks.js'

const usersRouter = express.Router()

usersRouter.route('/').get(getAllUsers)
usersRouter.route('/:id').get(getUserById).delete(deleteUser).patch(updateUser)
usersRouter.route('/:id/books').post(updateUserBooks, getUserBooks)



export default usersRouter