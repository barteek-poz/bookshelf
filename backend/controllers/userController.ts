import { AuthRequest } from './../types/authTypes';
import { Request, Response } from "express";
import { addUserBookModel, deleteUserBookModel, getAllUsersModel, getUserBooksModel, getUserDataModel } from "../models/userModel.js";

export const getAllUsers = async (req:Request, res:Response) => {
  try {
    const users = await getAllUsersModel()
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

export const getUserById = async (req:Request, res:Response) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await getUserDataModel(userId)
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

export const addUserBook = async (req:Request, res:Response) => {
  const authReq = req as AuthRequest
  try {
    const userId = authReq.user.id
    const { bookId } = authReq.body;
    if(!bookId) {
      return res.status(400).json({ status: "Fail", message: "Invalid book ID" });
    }
    const result = await addUserBookModel(userId,bookId)
    if (result.affectedRows === 0) {
      return res.status(400).json({ status: "Fail", message: "Could not add book to user's library" });
    }
    res.status(200).json({status:'Success'})
  } catch (error) {
    console.error("Failed to add book:", error);
    res.status(400).json({ status: "Fail", message: "Failed to add book" });
  }

};

export const deleteUserBook = async (req:Request, res:Response) => {
  const authReq = req as AuthRequest
  try {
    const userId = authReq.user.id
    const { bookId } = authReq.params;
    const bookIdNum = parseInt(bookId)
    if(!bookId) {
        return res.status(400).json({ status: "Fail", message: "Invalid book ID" })
     }
     const result = await deleteUserBookModel(userId, bookIdNum)
     if (result.affectedRows === 0) {
        return res.status(404).json({ status: "Fail", message: "Book not found for this user" });
      }
     res.status(200).json({ status: "sucess" });
    } catch (error) {
    console.error("Failed to delete book:", error);
    res.status(400).json({ status: "Fail", message: "Failed to delete book" });
  }

};

export const getUserBooks = async (req:Request, res:Response) => {
    const userId = parseInt(req.params.id)
    try {
        const userBooks = await getUserBooksModel(userId)
        res.status(200).json({
            status: 'Success', 
            data: userBooks
        })
    } catch (error) {
        res.status(500).json({
            status: 'Fail', 
            message: 'Internal server error'
        }
        )
    }

};

export const updateUser = async (req:Request, res:Response) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined!",
  });
};

export const deleteUser = async (req:Request, res:Response) => {
  // try {
  //   const userId = req.params.id;
  //   await User.findByIdAndDelete(userId);
  //   res.status(200).json({
  //     status: "Success",
  //     message: "User has been removed",
  //   });
  // } catch (err) {
  //   res.status(405).json({
  //     status: "Fail",
  //     message: err,
  //   });
  // }
};
