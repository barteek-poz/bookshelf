import express from 'express'
import { login, logout, refreshAccessToken, signup } from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.route('/signup').post(signup)
authRouter.route('/login').post(login)
authRouter.route('/logout').post(logout)
authRouter.post('/refresh-token', refreshAccessToken);


export default authRouter