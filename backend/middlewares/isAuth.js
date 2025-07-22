import jwt from 'jsonwebtoken';
import { pool } from "../server.js";

export const isAuth = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return res
			.status(401)
			.json({ message: 'You are not logged in. Please log in to get access' });
	}
	const verifiedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
	const [result] = await pool.query(`SELECT * FROM users WHERE id = ?  `, [verifiedToken.id]);
    const currentUser = result[0]
	if (!currentUser) {
		return res
			.status(401)
			.json({
				message: 'The user belonging to this token does no longer exist',
			});
	}
	// if (currentUser.changedPasswordAfter(verifiedToken.iat)) {
	// 	return res
	// 		.status(401)
	// 		.json({ message: 'User recently changed password. Please log again.' });
	// }
	req.user = currentUser;
	next();

	// let token;
	// if (
	// 	req.headers.authorization &&
	// 	req.headers.authorization.startsWith('Bearer ')
	// ) {
	// 	token = req.headers.authorization.split(' ')[1];
	// }
	// if (!token) {
	// 	return res
	// 		.status(401)
	// 		.json({ message: 'You are not logged in. Please log in to get access' });
	// }
	// const verifiedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
	// const currentUser = await User.findById(verifiedToken.id);
	// if (!currentUser) {
	// 	return res
	// 		.status(401)
	// 		.json({
	// 			message: 'The user belonging to this token does no longer exist',
	// 		});
	// }
	// if (currentUser.changedPasswordAfter(verifiedToken.iat)) {
	// 	return res
	// 		.status(401)
	// 		.json({ message: 'User recently changed password. Please log again.' });
	// }
	// req.user = currentUser;
	// next();
};