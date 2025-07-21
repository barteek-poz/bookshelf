import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import supabaseUploadHandler from "../services/supabaseUpload.js";
import supabaseDelete from "../services/supabaseDelete.js";
import { pool } from "../server.js";

export const getAllBooks = async (req, res) => {
  try {
    const [books] = await pool.query(`SELECT * FROM books`);
    res.status(200).json({
      status: "Success",
      data: books,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

export const getRecentBooks = async (req, res) => {
  try {
    const [books] = await pool.query(`SELECT * FROM books ORDER BY id DESC LIMIT 5`);
    res.status(200).json({
        status:'Success', 
        data:books
    })
  } catch (err) {
    res.status(400).json({
        status:'Fail', 
        message:err
    }
    )
  }
  // try {
  //   const books = await Book.find().sort({_id:-1}).limit(5)
  //   res.status(200).json({
  //       status:'Success', 
  //       data:books
  //   })
  // } catch (err) {
  //   res.status(400).json({
  //       status:'Fail', 
  //       message:err
  //   }
  //   )
  // }
};

export const searchBookByTitle = async (req, res) => {
  const { bookTitle } = req.body;
  if (!bookTitle) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid book title" });
  }
  try {
    const [booksByTitle] = await pool.query('SELECT * FROM books WHERE title LIKE ?', [`%${bookTitle}%`])
    res.status(200).json({
      status: "success",
      books: booksByTitle,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  // const { bookTitle } = req.body;
  // if (!bookTitle) {
  //   return res
  //     .status(400)
  //     .json({ status: "Fail", message: "Invalid book title" });
  // }
  // try {
  //   const booksByTitle = await Book.find({
  //     title: { $regex: bookTitle, $options: "i" },
  //   });
  //   res.status(200).json({
  //     status: "success",
  //     books: booksByTitle,
  //   });
  // } catch (error) {
  //   console.error("Error searching books:", error);
  //   res.status(500).json({ message: "Internal server error" });
  // }
};

export const createBook = async (req, res) => {
  try {
    const userId = req.user.id
    const {title, author, genre, publishYear } = req.body
    let newBookData = {title, author, genre, publishYear}
    newBookData.publishYear = newBookData.publishYear === 'null' ? null : parseInt(newBookData.publishYear, 10)
    newBookData.genre = newBookData.genre === 'null' ? null : newBookData.genre
    console.log(newBookData)
    const [result] = await pool.query('INSERT INTO books(title,author,publishYear, genre, coverUrl, createdBy) VALUES(?, ?, ?, ?, ?, ?)',[newBookData.title, newBookData.author, newBookData.publishYear,newBookData.genre, null, userId ])
    if(!result.insertId) {
      return res.status(500).json({ status: "Fail", message: "Could not add new book" });
    }
    const newBookId = result.insertId
    await pool.query('INSERT INTO user_books VALUES(?,?)',[userId,newBookId ])
    if (req.file) {
      const coverUrl = await supabaseUploadHandler(newBookId, req, res);
      await pool.query('UPDATE books SET coverUrl = ? WHERE id=?',[coverUrl.publicUrl, newBookId])
    }
    const newBook = await pool.query('SELECT * FROM books WHERE id=?', [newBookId])
    res.status(201).json({
      status: "Success",
      data: {
        newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
  // try {
  //   let coverUrl = null;
  //   if (req.file) {
  //     const publicUrl = await supabaseUploadHandler(req.body.id, req, res);
  //     coverUrl = publicUrl.publicUrl;
  //   }
  //   const newBook = await Book.create({
  //     _id: req.body.id,
  //     ...req.body,
  //     coverUrl,
  //     createdBy: req.user._id,
  //   });
  //   if (newBook) {
  //     const user = await User.findById(req.user._id);
  //     user.books.push(req.body.id);
  //     await user.save({ validateBeforeSave: false });
  //   }
  //   res.status(201).json({
  //     status: "Success",
  //     data: {
  //       newBook,
  //     },
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     status: "Fail",
  //     message: err.message,
  //   });
  // }
};

export const getBookById = async (req, res) => {
  try{
    const bookId = req.params.id
    if (!Number.isInteger(Number(bookId))) {
      return res.status(400).json({ status: "Fail", message: "Invalid book ID" });
    }
    const [result] = await pool.query(`SELECT * FROM books WHERE id = ?  `, [bookId]);
    const book = result[0]
    if(!book) {
      return res.status(404).json({ status: "Fail", message: "Book not found" });
    }
    console.log(book)
    res.status(200).json({ status: "Success", data: book });
  }catch(error){
    console.error("Error fetching book:", error);
    res.status(500).json({ status: "Fail", message: "Internal server error" });
  }
  // try {
  //   const { id } = req.params;
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     return res
  //       .status(400)
  //       .json({ status: "Fail", message: "Invalid book ID" });
  //   }

  //   const book = await Book.findById(id);
  //   if (!book) {
  //     return res
  //       .status(404)
  //       .json({ status: "Fail", message: "Book not found" });
  //   }

  //   res.status(200).json({ status: "Success", data: book });
  // } catch (err) {
  //   console.error("Error fetching book:", err);
  //   res.status(500).json({ status: "Fail", message: "Internal server error" });
  // }
};

export const updateBook = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    if (!Number.isInteger(Number(bookId))) {
      return res.status(400).json({ status: "Fail", message: "Invalid book ID" });
    }
    const {title, author, genre, publishYear } = req.body
    let newBookData = {title, author, genre, publishYear}
    newBookData.publishYear = newBookData.publishYear === 'null' ? null : parseInt(newBookData.publishYear, 10)
    newBookData.genre = newBookData.genre === 'null' ? null : newBookData.genre
    
   const [updatedBook] = await pool.query('UPDATE books SET title=?, author=?, publishYear=?, genre=? WHERE id=?',[newBookData.title, newBookData.author, newBookData.publishYear, newBookData.genre,bookId])
   
    if(req.file){
      const [book] = await pool.query('SELECT coverUrl FROM books WHERE id=?', [bookId])
      let oldCover = null
      if(book[0].coverUrl !== null) {
        oldCover = book[0].coverUrl.split("/").pop();
        await supabaseDelete(bookId, oldCover);
      }
      const coverUrl = await supabaseUploadHandler(bookId, req, res);
      await pool.query('UPDATE books SET coverUrl=? WHERE id=?',[coverUrl.publicUrl,bookId])
    }
    res.status(200).json({
      status: "Success",
      updatedBook
    });
  } catch (error) {
    console.error("Could not update book data:", error);
    res.status(500).json({ error: "Could not update book data" });
  }
  // try {
  //   const { id: bookId } = req.params;
  //   const { title, author, genre, publishYear } = req.body;
  //   let updateFields = { title, author, genre, publishYear };
  //   if (req.file) {
  //     const bookData = await Book.findById(bookId);
  //     let oldCover = null;
  //     if (bookData.coverUrl !== null) {
  //       oldCover = bookData.coverUrl.split("/").pop();
  //     }
  //     console.log(oldCover);
  //     const publicUrl = await supabaseUploadHandler(bookId, req, res);
  //     updateFields.coverUrl = publicUrl.publicUrl;
  //     if (oldCover !== null) {
  //       await supabaseDelete(bookId, oldCover);
  //     }
  //   }
  //   const book = await Book.findByIdAndUpdate(bookId, updateFields, {
  //     new: true,
  //     runValidators: true,
  //   });
  //   if (!book) {
  //     return res.status(404).json({ error: "Book not found" });
  //   }
  //   res.status(200).json({
  //     status: "Success",
  //     data: {
  //       updatedBook: book,
  //     },
  //   });
  // } catch (error) {
  //   console.error("Could not update book data:", error);
  //   res.status(500).json({ error: "Could not update book data" });
  // }
};

export const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (book.coverId) {
      const coverId = book.coverUrl.split("/").pop();
      await supabaseDelete(bookId, coverId);
    }
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({
      status: "Success",
      message: "Book has been removed",
    });
  } catch (err) {
    res.status(405).json({
      status: "Fail",
      message: err,
    });
  }
};
