import { BookPropositionsType } from '../../types/bookTypes';
import styles from './BookPropositions.module.css';

const BookPropositions = ({existingBooks, previewExistingBookHandler}:BookPropositionsType) => {
	return (
		<div className={styles.bookPropositions}>
			<p className={styles.bookPropositionsHeader}>
				Here is a list of books we have in our database. You can add them to
				your Bookshelf by clicking on the title. If you want to add a new book,
				continue typing the title.
			</p>
			<ul className={styles.bookPropositionsList}>
                {existingBooks.map(book => {
                    return <li key={book.id} onClick={()=>{previewExistingBookHandler(book)}}><span>{book.title},</span><p>&nbsp;{book.author}</p></li>
                })}
				
			</ul>
		</div>
	);
};

export default BookPropositions;
