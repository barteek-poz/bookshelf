import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../server.js";
import { BookDataType } from "../types/bookTypes.js";
import { UserBackendDataType } from "../types/userTypes.js";


export const getAllUsersModel = async ():Promise<UserBackendDataType[]> => {
  const [users] = await pool.query<UserBackendDataType[] & RowDataPacket[]>('SELECT * FROM users')
  return users
}
export const getNumOfUsersModel = async():Promise<number> => {
  const [rows] = await pool.query<number & RowDataPacket[]>('SELECT COUNT(*) AS total FROM users');
  const numOfUsers = rows[0].total;
  return numOfUsers
}
export const getUserDataModel = async(userId:number):Promise<UserBackendDataType>=> {
  const [result] = await pool.query<UserBackendDataType[] & RowDataPacket[]>(`SELECT * FROM users WHERE id = ?`,[userId]);
  const user = result[0]
  return user
}

export const getUserBooksModel = async(userId:number):Promise<BookDataType[]>=> {
  const [result] = await pool.query<BookDataType[] & RowDataPacket[]>(
    `SELECT books.* FROM books 
    JOIN user_books ON books.id = user_books.book_id 
    WHERE user_books.user_id = ?;`, [userId]);  
  return result
}

export const addUserBookModel = async(userId:number,bookId:number):Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>('INSERT INTO user_books VALUES(?,?)',[userId,bookId])
  return result
}

export const deleteUserBookModel = async(userId:number,bookId:number):Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM user_books WHERE user_id = ? AND book_id = ?', [userId, bookId])
  return result
}

export const deleteUserModel = async(userId:number):Promise<boolean> => {
   const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM user_books WHERE user_id = ?', [userId]);
      const [result] = await conn.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [userId]);
      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
}