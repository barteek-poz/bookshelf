import { ResultSetHeader } from "../node_modules/mysql2/index.js";
import { pool } from "../server.js";
import { BookDataType } from "../types/bookTypes.js";
import { UserBackendDataType } from "../types/userTypes.js";


export const getAllUsersModel = async ():Promise<UserBackendDataType[]> => {
  const [users] = await pool.query('SELECT * FROM users')
  return users
}

export const getUserDataModel = async(userId:number):Promise<UserBackendDataType>=> {
  const [result] = await pool.query(`SELECT * FROM users WHERE id = ?`,[userId]);
  const user = result[0]
  return user
}

export const getUserBooksModel = async(userId:number):Promise<BookDataType[]>=> {
  const [result] = await pool.query(
    `SELECT books.* FROM books 
    JOIN user_books ON books.id = user_books.book_id 
    WHERE user_books.user_id = ?;`, [userId]);  
  return result
}

export const addUserBookModel = async(userId:number,bookId:number):Promise<ResultSetHeader> => {
  const result = await pool.query('INSERT INTO user_books VALUES(?,?)',[userId,bookId])
  return result
}

export const deleteUserBookModel = async(userId:number,bookId:number):Promise<ResultSetHeader> => {
  const result = await pool.query('DELETE FROM user_books WHERE user_id = ? AND book_id = ?', [userId, bookId])
  return result
}
