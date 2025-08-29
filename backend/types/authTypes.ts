import { Request } from "express"

export interface AuthRequest extends Request {
    user: {
        id: number,
        is_admin: boolean
    },
    file: Express.Multer.File
}