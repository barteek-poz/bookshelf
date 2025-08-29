
import { Request } from "express";

export interface AuthRequest<ReqBody = any, ReqParams = any, ReqQuery = any> extends Request<ReqParams, any, ReqBody, ReqQuery> {
  user: {
    id: number;
    is_admin: boolean;
  };
  file?: Express.Multer.File;
}
