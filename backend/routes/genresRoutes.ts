import express from 'express'
import { getAllGenres } from '../controllers/genreController.js'

const genresRouter = express.Router()

genresRouter.route('/').get(getAllGenres)

export default genresRouter