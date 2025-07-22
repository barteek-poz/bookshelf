import User from "../models/userModel.js";
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
