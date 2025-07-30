import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getUserDataModel } from '../models/userModel.js';
import { AuthRequest } from '../types/authTypes.js';

export const isAuth = async (req:Request, res:Response, next:NextFunction) => {
	const authReq = req as AuthRequest
	let token: string | undefined;
	if (
		authReq.headers.authorization &&
		authReq.headers.authorization.startsWith('Bearer ')
	) {
		token = authReq.headers.authorization.split(' ')[1];
	}
	if (!token || !process.env.JWT_ACCESS_SECRET) {
		return res
			.status(401)
			.json({ message: 'You are not logged in. Please log in to get access' });
	}
	const verifiedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
	const currentUser = await getUserDataModel(verifiedToken.id);
	if (!currentUser) {
		return res
			.status(401)
			.json({
				message: 'The user belonging to this token does no longer exist',
			});
	}
	authReq.user = currentUser;
	next();
};