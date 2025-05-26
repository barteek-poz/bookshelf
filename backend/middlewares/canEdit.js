import Book from '../models/bookModel.js';

export const canEdit = async (req,res,next) => {
	try {
		const user = req.user
		const bookId = req.params.id
		const book = await Book.findById(bookId)
		if(book.createdBy.toString() !== user._id.toString()) {
			return res.status(403).json({ message: "You can't edit this book" });
		}
		next()
	}catch(err) {
		res.status(500).json({ message: 'Internal server error' });
	}
	
}