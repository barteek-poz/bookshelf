import { ResultSetHeader } from "../node_modules/mysql2/promise.js";
import { pool } from "../server.js";
import { BookDataType } from "../types/bookTypes.js";


export const searchBookByTitleModel = async (bookTitle:string):Promise<BookDataType[]> => {
  const [booksByTitle] = await pool.query('SELECT * FROM books WHERE title LIKE ?', [`%${bookTitle}%`])
  return booksByTitle
}

export const getRecentBooksModel = async ():Promise<BookDataType[]> => {
  const [books] = await pool.query(`SELECT * FROM books ORDER BY id DESC LIMIT 5`);
  return books
}

export const getAllBooksModel = async ():Promise<BookDataType[]> => {
  const [books] = await pool.query(`SELECT * FROM books`);
  return books
}

export const addBookModel = async (title:string, author:string, publishYear:number, genre:string, coverUrl:string | null, userId:number):Promise<ResultSetHeader> => {
  const [result] = await pool.query('INSERT INTO books(title,author,publishYear, genre, coverUrl, createdBy) VALUES(?, ?, ?, ?, ?, ?)',[title, author, publishYear,genre, coverUrl, userId ])
  return result
}

export const addBookToUserModel = async(userId:number, newBookId:number):Promise<ResultSetHeader>=> {
  const [result] = await pool.query('INSERT INTO user_books VALUES(?,?)',[userId,newBookId ])
  return result
}



export const getBookDataModel = async (newBookId:number):Promise<BookDataType> => {
  const [result] = await pool.query('SELECT * FROM books WHERE id=?', [newBookId])
  const bookData = result[0]
  return bookData
}


export const updateBookModel = async(title:string, author:string, publishYear:number, genre:string,bookId:number) => {
  const [updatedBook] = await pool.query('UPDATE books SET title=?, author=?, publishYear=?, genre=? WHERE id=?',[title, author, publishYear, genre,bookId])
  return updatedBook
}

export const addBookCoverModel = async(coverUrl:string, newBookId:number) => {
  const [result] = await pool.query('UPDATE books SET coverUrl = ? WHERE id=?',[coverUrl, newBookId])
  return result
}

export const getBookCoverModel = async(bookId:number) => {
  const [book] = await pool.query('SELECT coverUrl FROM books WHERE id=?', [bookId])
  return book
}

export const updateBookCoverModel = async(coverUrl:string, bookId:number) => {
  const result = await pool.query('UPDATE books SET coverUrl=? WHERE id=?',[coverUrl,bookId])
  return result
}