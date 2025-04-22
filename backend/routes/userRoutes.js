import express from 'express'
import { getAllUsers, deleteUser, getUserById, updateUser } from '../controllers/userController.js'
import { isAuth, login, logout, refreshAccessToken, signup } from '../controllers/authController.js'


const usersRouter = express.Router()


usersRouter.route('/').get(getAllUsers)
usersRouter.route('/signup').post(signup)
usersRouter.route('/login').post(login)
usersRouter.route('/:id').get(getUserById).delete(deleteUser).patch(updateUser)
usersRouter.route('/logout').post(logout)
usersRouter.post('/refresh-token', refreshAccessToken);


export default usersRouter