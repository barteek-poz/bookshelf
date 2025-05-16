import { useState } from 'react';
import styles from './BookRow.module.css';
import Book from '../Book/Book';
import shelfImg from './shelf.png'

const BookRow = ({books}) => {
    const [booksPerShelf, setBooksPerShelf] = useState(3)
    const shelves = [];
    for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf));
    }
	return (
        <div>
          {shelves.map((shelf, idx) => (
            <div id={idx} className={styles.shelfRow}>
              
                {shelf.map((book) => (
                 <Book
                 key={book._id}
                 id={book._id}
                 title={book.title}
                 author={book.author}
                 cover={book.coverUrl}
               />
              ))}
              
              <img src={shelfImg} className={styles.shelfImg}/>
            </div>
          ))}
        </div>
      );
};

export default BookRow;
