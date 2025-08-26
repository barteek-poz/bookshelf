import useFetch from "../../hooks/useFetch";
import styles from "./RecentBooks.module.css";
import Book from "../Book/Book";
import Loader from "../Loader/Loader";
import { BookDataType } from "../../types/bookTypes";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { useEffect } from "react";

const RecentBooks = () => {
  const { data: recentBooks, error, isPending } = useFetch<BookDataType[]>(`http://localhost:3000/api/v1/books/get-recent`);
  const { errorHandler } = useErrorHandler();

  useEffect(() => {
    if (error) {
      errorHandler("Sorry, but something went wrong and we could not load recent books. Please refresh the page or try again later.");
    }
  }, [error]);
  if(!recentBooks || recentBooks.length === 0) {
    return null
  }
  return (
    <div>
      {isPending && <Loader />}
      {recentBooks && (
        <div className={styles.recentBooks}>
          {recentBooks.map((book) => {
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
      )}
    </div>
  );
};

export default RecentBooks;
