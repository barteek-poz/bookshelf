import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from "../server.js";

const signAccessToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
		expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
	});
};

const signRefreshToken = (userId) => {
	return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
	});
};

export const signup = async (req, res) => {
	try {
		const newUserData = req.body
		if(newUserData.password !== newUserData.passwordConfirm) {
			return res.status(400).json({ message: 'Passwords do not match' });
		}
		const [result] = await pool.query(`SELECT * FROM users WHERE email = ?`, [newUserData.email]);
		const existingUser = result[0]
		if(existingUser) {
			return res.status(400).json({ message: 'User with this email is already signed up' });
		}
		newUserData.password = await bcrypt.hash(newUserData.password, 12);
		const [newUser] = await pool.query('INSERT INTO users(user_name, email, password) VALUES(?,?,?)',[newUserData.name, newUserData.email, newUserData.password])
		const newUserId = newUser.insertId
		const accessToken = signAccessToken(newUserId);
		const refreshToken = signRefreshToken(newUserId);
		await pool.query('UPDATE users SET refreshToken=? WHERE id=?',[refreshToken, newUserId])
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'Strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'Strict',
			path: '/',
			maxAge: 15 * 60 * 1000,
		});
		res.status(200).json({
			status:'success',
			accessToken,
			user: {
				id: newUser.id,
				email: newUser.email
			}
		})
	} catch (error) {
		console.error('Signup error:', error);
		res.status(400).json({ message: 'Signup failed', error: error.message });
	}
};

export const login = async (req, res) => {
try {
	const {email, password} = req.body
	if (!email || !password) {
			return res
				.status(400)
				.json({ message: 'Please provide email and password' });
		}
	const [result] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
	const user = result[0]
	if(!user) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}
	const isPasswordCorrect = await bcrypt.compare(password, user.password)
	if(!isPasswordCorrect) {
		return res.status(401).json({ message: 'Invalid password' });
	}
	const accessToken = signAccessToken(user.id);
	const refreshToken = signRefreshToken(user.id);
	await pool.query(`UPDATE users SET refreshToken = ? WHERE id = ?;`, [refreshToken, user.id])
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: 'Strict',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	res.status(200).json({
		status: 'success',
		accessToken,
		user : {
			id:user.id, 
			username: user.user_name
		}
	});
	}catch(error) {
		console.error('Login error', error)
		res.status(500).json({
			status: 'Error',
			message: 'Failed to login',
		});
	}
};

export const refreshAccessToken = async (req, res) => {
	const token = req.cookies.refreshToken;
	if (!token) {
		return res.status(401).json({ message: 'No refresh token provided' });
	}
	try {
		const decodedRefreshToken = jwt.verify(
			token,
			process.env.JWT_REFRESH_SECRET
		);
		const userId = decodedRefreshToken.id
		const [result] = await pool.query(`SELECT * FROM users WHERE id = ?  `, [userId]);
		const currentUser = result[0]
		if (!currentUser || currentUser.refreshToken !== token) {
			return res.status(403).json({ message: 'Invalid refresh token' });
		}
		const accessToken = signAccessToken(currentUser.id);
		res.status(200).json({
			accessToken,
			user: {
			  id: currentUser.id,	
			  name: currentUser.name
			},
		  });
	} catch (error) {
		return res
			.status(403)
			.json({ message: 'Invalid or expired refresh token' });
	}
};

export const logout = async (req, res) => {
	const token = req.cookies.refreshToken;
	if (token) {
		try {
			const decodedToken = jwt.decode(token);
			const userID = decodedToken.id;

			await pool.query(`UPDATE users SET refreshToken = NULL WHERE id = ?  `, [userID]);
			res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'Strict' });

			return res.status(200).json({ message: 'Logged out successfully' });
		} catch (error) {
			console.error('Error logging out:', error);
			return res
				.status(500)
				.json({ message: 'Something went wrong during logout' });
		}
	} else {
		return res.status(400).json({ message: 'No refresh token found' });
	}

};
