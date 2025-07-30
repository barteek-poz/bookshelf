import { NextFunction, Request, Response } from "express";
import { canEditBookModel } from "../models/bookModel.js";
import { AuthRequest } from "../types/authTypes.js";

export const canEdit = async (req:Request,res:Response,next:NextFunction) => {
	 const authReq = req as AuthRequest
	try {
		const userId = authReq.user.id
		const bookId = parseInt(authReq.params.id)
		const book = await canEditBookModel(bookId, userId)
		if(!book) {
			return res.status(403).json({ message: "You can't edit this book" });
		}
		next()
	}catch(err) {
		res.status(500).json({ message: 'Internal server error' });
	}
	
}