import { Request } from "express";


export interface AuthRequest<
  ReqBody = any,
  ReqParams = Record<string, any>,
  ReqQuery = Record<string, any>,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<ReqParams, any, ReqBody, ReqQuery, Locals> {
  user: {
    id: number;
    is_admin: boolean;
  };
  file?: Express.Multer.File;
}