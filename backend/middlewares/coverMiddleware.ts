import { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp"
import { AuthRequest } from "../types/authTypes";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const coverMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.file) {
        return next();
    }
    try {
        const resizedCover = await sharp(authReq.file.buffer)
            .resize(380, 620)
            .toFormat("jpeg")
            .toBuffer();

        authReq.file.buffer = resizedCover
        authReq.file.mimetype = 'image/jpeg'
        next();
    } catch (err) {
        res.status(500).json({ error: "Cannot resize cover"});
    }
};
