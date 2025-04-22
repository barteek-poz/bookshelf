import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'A book needs a title'],
        unique: true, 
        trim: true
    }, 
    author: {
        type: String, 
        required: [true, 'A book should have an author'],
        trim: true
    }, 
    publishYear: {
        type: Number, 
    },
    genre: {
        type: String, 
        trim: true
    },
    coverUrl: {
        type: String,
        default: null
    }
})

const Book = mongoose.model('Book', bookSchema,)
export default Book