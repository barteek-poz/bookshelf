import { pool } from "../server.js";

export const getUserByEmailModel = async(userEmail)=>{
    const [result] = await pool.query(`SELECT * FROM users WHERE email = ?`, [userEmail]);
    const user = result[0]
    return user
}

export const getUserByIdModel = async(userId)=>{
    const [result] = await pool.query(`SELECT * FROM users WHERE id = ?  `, [userId]);
    const user = result[0]
    return user
}

export const addNewUserModel = async(userName,userEmail,userPassword)=> {
    const [newUser] = await pool.query('INSERT INTO users(user_name, email, password) VALUES(?,?,?)',[userName,userEmail,userPassword])
    return newUser
}

export const updateUserTokensModel = async(refreshToken,userId)=>{
    await pool.query('UPDATE users SET refreshToken=? WHERE id=?',[refreshToken,userId])
}

export const clearUserTokensModel = async(userId)=>{
    await pool.query(`UPDATE users SET refreshToken = NULL WHERE id = ?  `, [userId]);
}