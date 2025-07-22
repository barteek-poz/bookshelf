import Genre from '../models/genreModel.js'
import { pool } from "../server.js";

export const getAllGenres = async (req, res) => {
    try {
      const [genres] = await pool.query('SELECT * FROM genres')
      res.status(200).json({
          status:'Success',
          data: genres
      })
    } catch(err) {
      res.status(400).json({
          status: 'Fail',
          message: err
      })
    }
   
  }