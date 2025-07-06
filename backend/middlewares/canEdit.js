import { pool } from "../server.js";

export const canEdit = async (req,res,next) => {
	try {
		const userId = req.user.id
		const bookId = req.params.id
		const [book] = await pool.query('SELECT * FROM books WHERE id = ? AND createdBy = ?', [bookId, userId])
		if(!book[0]) {
			return res.status(403).json({ message: "You can't edit this book" });
		}
		next()
	}catch(err) {
		res.status(500).json({ message: 'Internal server error' });
	}
	// try {
	// 	const user = req.user
	// 	const bookId = req.params.id
	// 	const book = await Book.findById(bookId)
	// 	if(book.createdBy.toString() !== user._id.toString()) {
	// 		return res.status(403).json({ message: "You can't edit this book" });
	// 	}
	// 	next()
	// }catch(err) {
	// 	res.status(500).json({ message: 'Internal server error' });
	// }
	
}