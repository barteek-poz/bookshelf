import { useEffect } from "react";
import BookRow from "../../components/BookRow/BookRow";
import Loader from "../../components/Loader/Loader";
import useAuthUser from "../../hooks/useAuthUser";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import useFetch from "../../hooks/useFetch";
import { BookDataType } from "../../types/bookTypes";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useAuthUser();
  const { errorHandler } = useErrorHandler();
  const {
    data: books,
    error,
    isPending,
  } = useFetch<BookDataType[]>(
    `http://localhost:3000/api/v1/users/${user.id}/books`
  );
  useEffect(() => {
    if (error) {
      errorHandler(
        "Sorry, but something went wrong and we could not load your books. Please refresh the page or try to reconnect later."
      );
    }
  }, [error]);
  return (
    <section id="dashboard" className={styles.dashboard}>
      {isPending && <Loader />}
      {books && books?.length > 0 && <BookRow books={books} />}
      {books && books?.length === 0 && (
        <h2>You don't have any book in your library.</h2>
      )}
    </section>
  );
};

export default Dashboard;
