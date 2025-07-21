
import styles from "./BookRow.module.css";
import Book from "../Book/Book";
import shelfImg from "../../assets/shelf.png";
import { useBooksRow } from "../../hooks/useBooksRow";
import { BookRowType } from "../../types/bookTypes";

const BookRow = ({ books }:BookRowType) => {
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
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              createdBy={book.createdBy}
              genre={book.genre}
              publishYear={book.publishYear}
            />
          ))}

          <img src={shelfImg} alt="shelf-img" className={styles.shelfImg} />
        </div>
      ))}
    </div>
  );
};

export default BookRow;
