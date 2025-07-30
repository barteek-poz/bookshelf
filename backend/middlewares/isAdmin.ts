import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/authTypes";

export const isAdmin = async(req:Request, res:Response, next:NextFunction) => {
    const authReq = req as AuthRequest
    if(!authReq.user || !authReq.user.is_admin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next()
}