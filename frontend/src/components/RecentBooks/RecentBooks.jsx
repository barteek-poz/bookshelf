import useFetch from "../../hooks/useFetch";
import styles from "./RecentBooks.module.css";
import Book from "../Book/Book";
import Loader from "../Loader/Loader";

const RecentBooks = () => {
  const {data: recentBooks, error,isPending} = useFetch(`http://localhost:3000/api/v1/books/get-recent`);

  return (
    <div>
      {isPending && <Loader />}
      {recentBooks && 
        <div className={styles.recentBooks}>
          {recentBooks &&
            recentBooks.map((book) => {
              return (
                <Book
                  key={book._id}
                  id={book._id}
                  title={book.title}
                  author={book.author}
                  cover={book.coverUrl}
                />
              );
            })}
        </div>}
      {error && <h3>Error</h3>}
    </div>
  );
};

export default RecentBooks;
