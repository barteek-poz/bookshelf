import BookRow from "../../components/BookRow/BookRow";
import Loader from "../../components/Loader/Loader";
import useAuthUser from "../../hooks/useAuthUser";
import useFetch from "../../hooks/useFetch";
import { BookDataType } from "../../types/bookTypes";
import styles from "./Dashboard.module.css";


const Dashboard = () => {
  const { user} = useAuthUser()
  const {data: books, error, isPending} = useFetch<BookDataType[]>(`http://localhost:3000/api/v1/users/${user.id}/books`);
  return (
    <section id="dashboard" className={styles.dashboard}>
      {isPending && <Loader />}
      {books && books?.length > 0 ? (
        <BookRow books={books} />
      ) : (
        <h2>You don't have any book in your library.</h2>
      )}
      {error && <h2>Failed to load books</h2>}
    </section>
  );
};

export default Dashboard;
