import { BookDataType, BookPropositionsType } from '../../types/bookTypes';
import Book from '../Book/Book';
import styles from './SearchResults.module.css'
const SearchResults = ({existingBooks}:Omit<BookPropositionsType,'previewExistingBookHandler'>) => {
  return (
    <div className={styles.existingBooks}>
      {existingBooks &&
        existingBooks.map((book) => {
          return (
            <Book
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              inLibrary={book.inLibrary}
              canEdit={book.canEdit}
            />
          );
        })}
    </div>
  );
};

export default SearchResults;
