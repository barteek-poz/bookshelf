import { Request } from "express"
import { Multer } from "multer"

export interface AuthRequest extends Request {
    user: {
        id: number,
    },
    file: Express.Multer.File
}