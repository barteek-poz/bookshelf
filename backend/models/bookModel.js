import { pool } from "../server.js";


export const searchBookByTitleModel = async (bookTitle) => {
  const [booksByTitle] = await pool.query('SELECT * FROM books WHERE title LIKE ?', [`%${bookTitle}%`])
  return booksByTitle
}

export const getRecentBooksModel = async () => {
  const [books] = await pool.query(`SELECT * FROM books ORDER BY id DESC LIMIT 5`);
  return books
}

export const getAllBooksModel = async () => {
  const [books] = await pool.query(`SELECT * FROM books`);
  return books
}

export const addBookModel = async (title, author, publishYear, genre, coverUrl, userId) => {
  const [result] = await pool.query('INSERT INTO books(title,author,publishYear, genre, coverUrl, createdBy) VALUES(?, ?, ?, ?, ?, ?)',[title, author, publishYear,genre, coverUrl, userId ])
  return result
}

export const addBookToUserModel = async(userId, newBookId)=> {
  const [result] = await pool.query('INSERT INTO user_books VALUES(?,?)',[userId,newBookId ])
  return result
}



export const getBookDataModel = async (newBookId) => {
  const [result] = await pool.query('SELECT * FROM books WHERE id=?', [newBookId])
  const bookData = result[0]
  return bookData
}


export const updateBookModel = async(title, author, publishYear, genre,bookId) => {
  const [updatedBook] = await pool.query('UPDATE books SET title=?, author=?, publishYear=?, genre=? WHERE id=?',[title, author, publishYear, genre,bookId])
  return updatedBook
}

export const addBookCoverModel = async(coverUrl, newBookId) => {
  const [result] = await pool.query('UPDATE books SET coverUrl = ? WHERE id=?',[coverUrl, newBookId])
  return result
}

export const getBookCoverModel = async(bookId) => {
  const [book] = await pool.query('SELECT coverUrl FROM books WHERE id=?', [bookId])
  return book
}

export const updateBookCoverModel = async(coverUrl, bookId) => {
  const result = await pool.query('UPDATE books SET coverUrl=? WHERE id=?',[coverUrl,bookId])
  return result
}