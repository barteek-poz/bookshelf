import { Request, Response } from "express"
import { getAdminSummaryModel } from "../models/adminModel"

export const getSummary = async(req:Request, res:Response) => {
    try {
      const summary = await getAdminSummaryModel()
      res.status(200).json({
          status:'Success', 
          data:summary
      })
    } catch (err) {
      res.status(400).json({
          status:'Fail', 
          message:err
      }
      )
    }
  }