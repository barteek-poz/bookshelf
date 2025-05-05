import mongoose from 'mongoose';
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";

export const updateUserBooks = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: "Fail", message: "Invalid user ID" });
    }
    const user = await User.findById(req.params.id);
    const allBooks = await Book.find();
    const userBooksArr = user.books.map(book => book.toString())
    const allBooksArr = allBooks.map(book => book._id.toString());
    const updatedUserBooks = userBooksArr.filter(book => allBooksArr.includes(book));
    user.books = updatedUserBooks;
    await user.save({ validateBeforeSave: false });
    next();
  } catch (err) {
    console.error("Failed to update user books:", err);
    res.status(500).json({ status: "Fail", message: "Internal server error" });
  }
};
