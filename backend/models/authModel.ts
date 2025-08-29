import { ResultSetHeader, RowDataPacket } from "../node_modules/mysql2/index.js";
import { pool } from "../server.js";
import { UserBackendDataType } from "../types/userTypes.js";

export const getUserByEmailModel = async (userEmail: string): Promise<UserBackendDataType | null> => {
  const [result] = await pool.query<UserBackendDataType[] & RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [userEmail]);
  return result.length > 0 ? result[0] : null;
};

export const getUserByIdModel = async (userId: number): Promise<UserBackendDataType> => {
  const [result] = await pool.query<UserBackendDataType[] & RowDataPacket[]>(`SELECT * FROM users WHERE id = ?  `, [userId]);
  const user = result[0];
  return user;
};

export const addNewUserModel = async (userName: string, userEmail: string, userPassword: string): Promise<ResultSetHeader> => {
  const [newUser] = await pool.query<ResultSetHeader>("INSERT INTO users(user_name, email, password) VALUES(?,?,?)", [userName, userEmail, userPassword]);
  return newUser;
};

export const updateUserTokensModel = async (refreshToken: string, userId: number) => {
  await pool.query("UPDATE users SET refreshToken=? WHERE id=?", [refreshToken, userId]);
};

export const clearUserTokensModel = async (userId: number) => {
  await pool.query(`UPDATE users SET refreshToken = NULL WHERE id = ?  `, [userId]);
};
