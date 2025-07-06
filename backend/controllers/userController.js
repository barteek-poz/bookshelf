import mongoose from "mongoose";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import { pool } from "../server.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

export const getUserById = async (req, res) => {
  const userID = req.params;
  try {
    const [result] = await pool.query(`SELECT * FROM users WHERE id = ?  `, [userID]);
    const user = result[0]
    if (!user) {
        return res.status(404).json({ status: "Fail", message: "User not found" });
    }
    res.status(200).json({
        status: 'Success', 
        user
    })
  } catch (error) {
    res.status(500).json({
        status: 'Fail', 
        message: 'Internal server error'
    }
    )
  }
  // try {
  //     const { id } = req.params;
  //     if (!mongoose.Types.ObjectId.isValid(id)) {
  //         return res.status(400).json({ status: "Fail", message: "Invalid user ID" });
  //     }
  //     const user = await User.findById(id);
  //     if (!user) {
  //         return res.status(404).json({ status: "Fail", message: "User not found" });
  //     }
  //     res.status(200).json({ status: "Success", data: user });
  // } catch (err) {
  //     console.error("Failed to search user:", err);
  //     res.status(500).json({ status: "Fail", message: "Internal server error" });
  // }
};

export const addUserBook = async (req, res) => {
  try {
    const userId = req.user.id
    const { bookId } = req.body;
    if(!bookId) {
      return res.status(400).json({ status: "Fail", message: "Invalid book ID" });
    }
    const result = await pool.query('INSERT INTO user_books VALUES(?,?)',[userId,bookId])
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: "Fail", message: "Could not add book to user's library" });
    }
    res.status(200).json({status:'Success'})
  } catch (error) {
    console.error("Failed to add book:", error);
    res.status(400).json({ status: "Fail", message: "Failed to add book" });
  }
//   try {
//     const { bookId } = req.body;
//     const { id: userId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res
//         .status(400)
//         .json({ status: "Fail", message: "Invalid user ID" });
//     } else if (!mongoose.Types.ObjectId.isValid(bookId)) {
//       return res
//         .status(400)
//         .json({ status: "Fail", message: "Invalid book ID" });
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ status: "Fail", message: "User not found" });
//     }
//     if (user.books.includes(bookId)) {
//       return res
//         .status(400)
//         .json({
//           status: "Fail",
//           message: "You already have this book in your Bookshelf.",
//         });
//     }
//     user.books.push(bookId);
//     await user.save({ validateBeforeSave: false });
//     res.status(200).json({ status: "success" });
//   } catch (error) {
//     console.error("Failed to add book:", error);
//     res.status(400).json({ status: "Fail", message: "Failed to add book" });
//   }
};

export const deleteUserBook = async (req, res) => {
  try {
    const userId = req.user.id
    const { bookId } = req.params;
    if(!bookId) {
        return res.status(400).json({ status: "Fail", message: "Invalid book ID" })
     }
     const result = await pool.query('DELETE FROM user_books WHERE user_id = ? AND book_id = ?', [userId, bookId])
     if (result.affectedRows === 0) {
        return res.status(404).json({ status: "Fail", message: "Book not found for this user" });
      }
     res.status(200).json({ status: "sucess" });
    } catch (error) {
    console.error("Failed to delete book:", error);
    res.status(400).json({ status: "Fail", message: "Failed to delete book" });
  }
//   try {
//     const user = req.user;
//     const { bookId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(bookId)) {
//       return res
//         .status(400)
//         .json({ status: "Fail", message: "Invalid book ID" });
//     }
//     const updatedBooksArr = user.books.filter(
//       (arrBookId) => arrBookId.toString() !== bookId
//     );
//     user.books = updatedBooksArr;
//     await user.save({ validateBeforeSave: false });
//     res.status(200).json({ status: "sucess" });
//   } catch (error) {
//     console.error("Failed to delete book:", error);
//     res.status(400).json({ status: "Fail", message: "Failed to delete book" });
//   }
};

export const getUserBooks = async (req, res) => {
    const userID = req.params.id
    try {
        const [result] = await pool.query(
        `SELECT books.* FROM books 
        JOIN user_books ON books.id = user_books.book_id 
        WHERE user_books.user_id = ?;`, [userID]);
        res.status(200).json({
            status: 'Success', 
            data: result
        })
    } catch (error) {
        res.status(500).json({
            status: 'Fail', 
            message: 'Internal server error'
        }
        )
    }
//   try {
//     const user = await User.findById(req.params.id).populate("books");
//     res.status(200).json({
//       stauts: "success",
//       data: user.books,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "Fail",
//       message: err,
//     });
//   }
};

export const updateUser = async (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined!",
  });
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      status: "Success",
      message: "User has been removed",
    });
  } catch (err) {
    res.status(405).json({
      status: "Fail",
      message: err,
    });
  }
};
