import { Request, Response } from 'express';
import { addBookCoverModel, addBookModel, addBookToUserModel, checkUserBooksModel, deleteBookFromDB, getAllBooksModel, getBookCoverModel, getBookDataModel, getNumOfBooksModel, getRecentBooksModel, searchBookByTitleModel, updateBookCoverModel, updateBookModel } from '../models/bookModel.js';
import supabaseDelete from "../services/supabaseDelete.js";
import supabaseUploadHandler from "../services/supabaseUpload.js";
import { AuthRequest } from '../types/authTypes.js';

export const getAllBooks = async (req:Request, res:Response) => {
  try {
    const books = await getAllBooksModel()
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

export const getNumOfBooks = async(req:Request, res:Response) => {
  try {
    const numOfBooks = await getNumOfBooksModel()
    res.status(200).json({
        status:'Success', 
        data:numOfBooks
    })
  } catch (err) {
    res.status(400).json({
        status:'Fail', 
        message:err
    }
    )
  }
}

export const getRecentBooks = async (req:Request, res:Response) => {
  try {
    const books = await getRecentBooksModel()
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
  
};

export const checkUserBooksByTitle = async (req:Request, res:Response) => {
  const authReq = req as AuthRequest
  const { bookTitle } = authReq.body;
  if (!bookTitle) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid book title" });
  }
  try {
    let booksList;
    const booksByTitle = await searchBookByTitleModel(bookTitle)
    if(booksByTitle.length > 0) {
      const booksIdsArr = booksByTitle.map(book => book.id)
      const userBooks = await checkUserBooksModel(authReq.user.id, booksIdsArr)
      const filteredBooks = booksIdsArr.filter(book => {
        if(!userBooks.includes(book)) {
          return book
        }
      })
      booksList = booksByTitle.filter(book => {
        if(filteredBooks.includes(book.id)){
          return book
        }
      })
    }
    else {
      booksList = booksByTitle
    }
    res.status(200).json({
      status: "success",
      books: booksList,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const searchBookByTitle = async (req:Request, res:Response) => {
  const authReq = req as AuthRequest
  const { bookTitle } = authReq.body;
  if (!bookTitle) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid book title" });
  }
  try {
    const booksByTitle = await searchBookByTitleModel(bookTitle)
    res.status(200).json({
      status: "success",
      books: booksByTitle,
    });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBook = async (req:Request, res:Response) => {
  const authReq = req as AuthRequest
  try {
    const userId = authReq.user.id
    const {title, author, genre, publishYear } = authReq.body
    let newBookData = {title, author, genre, publishYear}
    newBookData.publishYear = newBookData.publishYear === 'null' ? null : parseInt(newBookData.publishYear, 10)
    newBookData.genre = newBookData.genre === 'null' ? null : newBookData.genre

    const result = await addBookModel(newBookData.title, newBookData.author, newBookData.publishYear,newBookData.genre, null, userId)
    if(!result.insertId) {
      return res.status(500).json({ status: "Fail", message: "Could not add new book" });
    }
    const newBookId = result.insertId
    await addBookToUserModel(userId,newBookId)
    if (authReq.file) {
      const coverUrl = await supabaseUploadHandler(newBookId, authReq, res);
      await addBookCoverModel(coverUrl.publicUrl, newBookId)
    }
    const newBook = await getBookDataModel(newBookId)
    res.status(201).json({
      status: "Success",
      data: {
        newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

export const getBookById = async (req:Request, res:Response) => {
  try{
    const bookId = parseInt(req.params.id)
    if (!Number.isInteger(Number(bookId))) {
      return res.status(400).json({ status: "Fail", message: "Invalid book ID" });
    }
    const book = await getBookDataModel(bookId)
    if(!book) {
      return res.status(404).json({ status: "Fail", message: "Book not found" });
    }
    res.status(200).json({ status: "Success", data: book });
  }catch(error){
    console.error("Error fetching book:", error);
    res.status(500).json({ status: "Fail", message: "Internal server error" });
  }
};

export const updateBook = async (req:Request, res:Response) => {
  try {
    let { id: bookId } = (req.params);
    const bookIdNum = parseInt(bookId)
    if (!Number.isInteger(Number(bookId))) {
      return res.status(400).json({ status: "Fail", message: "Invalid book ID" });
    }
    const {title, author, genre, publishYear } = req.body
    let newBookData = {title, author, genre, publishYear}
    newBookData.publishYear = newBookData.publishYear === 'null' ? null : parseInt(newBookData.publishYear, 10)
    newBookData.genre = newBookData.genre === 'null' ? null : newBookData.genre
    
   const updatedBook = await updateBookModel(newBookData.title, newBookData.author, newBookData.publishYear, newBookData.genre,bookIdNum)
   
    if(req.file){
      const book = await getBookCoverModel(bookIdNum)
      let oldCover = null
      if(book[0].coverUrl !== null) {
        oldCover = book[0].coverUrl.split("/").pop();
        await supabaseDelete(bookId, oldCover);
      }
      const coverUrl = await supabaseUploadHandler(bookId, req, res);
      await updateBookCoverModel(coverUrl.publicUrl,bookIdNum)
    }
    res.status(200).json({
      status: "Success",
      updatedBook
    });
  } catch (error) {
    console.error("Could not update book data:", error);
    res.status(500).json({ error: "Could not update book data" });
  }
};

export const deleteBook = async (req:Request, res:Response) => {
  try {
    const { id:bookId } = req.params;
    const bookIdNum = parseInt(bookId)
    if(!bookId) {
        return res.status(400).json({ status: "Fail", message: "Invalid book ID" })
     }
     const result = await deleteBookFromDB(bookIdNum)
     if (result.affectedRows === 0) {
        return res.status(404).json({ status: "Fail", message: "Book not found in DB" });
      }
     res.status(200).json({ status: "sucess" });
    } catch (error) {
    console.error("Failed to delete book:", error);
    res.status(400).json({ status: "Fail", message: "Failed to delete book" });
  }
};
