import { ResultSetHeader, RowDataPacket, } from "mysql2";
import { pool } from "../server.js";
import { BookDataType } from "../types/bookTypes.js";


export const searchBookByTitleModel = async (bookTitle:string):Promise<BookDataType[]> => {
  const [booksByTitle] = await pool.query<BookDataType[] & RowDataPacket[]>('SELECT * FROM books WHERE title LIKE ?', [`%${bookTitle}%`])
  return booksByTitle
}

export const getRecentBooksModel = async ():Promise<BookDataType[]> => {
  const [books] = await pool.query<BookDataType[] & RowDataPacket[]>(`SELECT * FROM books ORDER BY id DESC LIMIT 5`);
  return books
}

export const getNumOfBooksModel = async():Promise<number> => {
  const [rows] = await pool.query<number & RowDataPacket[]>('SELECT COUNT(*) AS total FROM books');
  const numOfBooks = rows[0].total;
  return numOfBooks
}

export const getAllBooksModel = async ():Promise<BookDataType[]> => {
  const [books] = await pool.query<BookDataType[] & RowDataPacket[3]>(`SELECT * FROM books`);
  return books
}


export const addBookModel = async (title:string, author:string, publishYear:number, genre:string, coverUrl:string | null, userId:number):Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>('INSERT INTO books(title,author,publishYear, genre, coverUrl, createdBy) VALUES(?, ?, ?, ?, ?, ?)',[title, author, publishYear,genre, coverUrl, userId ])
  return result
}

export const addBookToUserModel = async(userId:number, newBookId:number):Promise<ResultSetHeader>=> {
  const [result] = await pool.query<ResultSetHeader>('INSERT INTO user_books VALUES(?,?)',[userId,newBookId ])
  return result
}



export const getBookDataModel = async (newBookId:number):Promise<BookDataType> => {
  const [result] = await pool.query<BookDataType[] & RowDataPacket[]>('SELECT * FROM books WHERE id=?', [newBookId])
  const bookData = result[0]
  return bookData
}


export const updateBookModel = async(title:string, author:string, publishYear:number, genre:string,bookId:number):Promise<ResultSetHeader> => {
  const [updatedBook] = await pool.query<ResultSetHeader>('UPDATE books SET title=?, author=?, publishYear=?, genre=? WHERE id=?',[title, author, publishYear, genre,bookId])
  return updatedBook
}

export const addBookCoverModel = async(coverUrl:string, newBookId:number):Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>('UPDATE books SET coverUrl = ? WHERE id=?',[coverUrl, newBookId])
  return result
}

export const getBookCoverModel = async(bookId:number):Promise<RowDataPacket[]> => {
  const [book] = await pool.query<RowDataPacket[]>('SELECT coverUrl FROM books WHERE id=?', [bookId])
  return book
}

export const updateBookCoverModel = async(coverUrl:string, bookId:number):Promise<ResultSetHeader> => {
  const [result] = await pool.query<ResultSetHeader>('UPDATE books SET coverUrl=? WHERE id=?',[coverUrl,bookId])
  return result
}

export const canEditBookModel = async(bookId:number, userId:number):Promise<BookDataType> => {
  const [result] = await pool.query<BookDataType[] & RowDataPacket[]>('SELECT * FROM books WHERE id = ? AND createdBy = ?', [bookId, userId])
  const book = result[0]
  return book
}

export const inUsersLibraryModel = async(userId:number, bookId:number):Promise<BookDataType[]> => {
  const result = await pool.query<BookDataType[] & RowDataPacket[]>('SELECT * FROM user_books WHERE user_id = ? AND book_id = ?', [userId, bookId])
  return result[0]
}

export const deleteBookFromDB = async (bookId: number): Promise<ResultSetHeader> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM user_books WHERE book_id = ?', [bookId]);
    const [result] = await conn.query<ResultSetHeader>('DELETE FROM books WHERE id = ?', [bookId]);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};