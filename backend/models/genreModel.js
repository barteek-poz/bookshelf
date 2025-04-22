import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    value: {
        type: String, 
        trim: true, 
        required: true,
        unique: true
    },
    label: {
        type: String, 
        trim: true, 
        required: true,
        unique: true
    }
})

const Genre = mongoose.model('Genre', genreSchema,)
export default Genre