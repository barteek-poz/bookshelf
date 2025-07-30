import { Request, Response } from 'express';
import { getGenresModel } from '../models/genreModel.js';

export const getAllGenres = async (req:Request, res:Response) => {
    try {
      const genres = await getGenresModel()
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