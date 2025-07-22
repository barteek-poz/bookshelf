import {addBookCoverModel, addBookModel, addBookToUserModel, getAllBooksModel, getBookCoverModel, getBookDataModel, getRecentBooksModel, searchBookByTitleModel, updateBookCoverModel, updateBookModel} from '../models/bookModel.js'
import supabaseDelete from "../services/supabaseDelete.js";
import supabaseUploadHandler from "../services/supabaseUpload.js";

export const getAllBooks = async (req, res) => {
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

export const getRecentBooks = async (req, res) => {
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

export const searchBookByTitle = async (req, res) => {
  const { bookTitle } = req.body;
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

export const createBook = async (req, res) => {
  try {
    const userId = req.user.id
    const {title, author, genre, publishYear } = req.body
    let newBookData = {title, author, genre, publishYear}
    newBookData.publishYear = newBookData.publishYear === 'null' ? null : parseInt(newBookData.publishYear, 10)
    newBookData.genre = newBookData.genre === 'null' ? null : newBookData.genre

    const result = await addBookModel(newBookData.title, newBookData.author, newBookData.publishYear,newBookData.genre, null, userId)
    if(!result.insertId) {
      return res.status(500).json({ status: "Fail", message: "Could not add new book" });
    }
    const newBookId = result.insertId
    await addBookToUserModel(userId,newBookId)
    if (req.file) {
      const coverUrl = await supabaseUploadHandler(newBookId, req, res);
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
      message: err.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try{
    const bookId = req.params.id
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
    
   const updatedBook = await updateBookModel(newBookData.title, newBookData.author, newBookData.publishYear, newBookData.genre,bookId)
   
    if(req.file){
      const book = await getBookCoverModel(bookId)
      let oldCover = null
      if(book[0].coverUrl !== null) {
        oldCover = book[0].coverUrl.split("/").pop();
        await supabaseDelete(bookId, oldCover);
      }
      const coverUrl = await supabaseUploadHandler(bookId, req, res);
      await updateBookCoverModel(coverUrl.publicUrl,bookId)
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
