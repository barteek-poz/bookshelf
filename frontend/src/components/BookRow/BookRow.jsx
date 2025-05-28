
import styles from "./BookRow.module.css";
import Book from "../Book/Book";
import shelfImg from "../../../public/shelf.png";
import { useBooksRow } from "../../hooks/useBooksRow";

const BookRow = ({ books }) => {
  const { booksPerShelf} = useBooksRow();
  const shelves = [];
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf));
  }
  return (
    <div className={styles.shelfWrapper}>
      {shelves.map((shelf, idx) => (
        <div key={idx} className={styles.shelfRow}>
          {shelf.map((book) => (
            <Book
              key={book._id}
              id={book._id}
              title={book.title}
              author={book.author}
              cover={book.coverUrl}
            />
          ))}

          <img src={shelfImg} alt="shelf-img" className={styles.shelfImg} />
        </div>
      ))}
    </div>
  );
};

export default BookRow;
