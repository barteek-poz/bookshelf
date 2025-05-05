import mongoose from 'mongoose';
import User from "../models/userModel.js"
import Book from "../models/bookModel.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
        status:'Success',
        data: users
    })
  } catch(err) {
    res.status(400).json({
        status: 'Fail',
        message: err
    })
  }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "Fail", message: "Invalid user ID" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: "Fail", message: "User not found" });
        }

        res.status(200).json({ status: "Success", data: user });
    } catch (err) {
        console.error("Failed to search user:", err);
        res.status(500).json({ status: "Fail", message: "Internal server error" });
    }
};


export const getUserBooks = async(req,res) => {
try {
    const user = await User.findById(req.params.id).populate("books");
    res.status(200).json({
        stauts: 'success',
        data: user.books });
    
} catch(err) {
    res.status(400).json({
        status: 'Fail',
        message: err
    })
}
}

export const updateUser = async (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined!'
      });
};


export const deleteUser = async (req,res) => {
    try { 
        const userId = req.params.id
        await User.findByIdAndDelete(userId)
        res.status(200).json({
            status:'Success',
           message: 'User has been removed',
        })
      } catch(err) {
        res.status(405).json({
            status: 'Fail',
            message: err
        })
      }
}