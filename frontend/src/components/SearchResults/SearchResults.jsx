import Book from '../Book/Book';
import styles from './SearchResults.module.css'
const SearchResults = ({existingBooks}) => {
  return (
    <div className={styles.existingBooks}>
      {existingBooks &&
        existingBooks.map((book) => {
          return (
            <Book
              key={book._id}
              id={book._id}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
            />
          );
        })}
    </div>
  );
};

export default SearchResults;
