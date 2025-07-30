import { Request } from "express"
import { Multer } from "multer"

export interface AuthRequest extends Request {
    user: {
        id: number,
        is_admin: boolean
    },
    file: Express.Multer.File
}