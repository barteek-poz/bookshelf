import BookRow from "../../components/BookRow/BookRow";
import Loader from "../../components/Loader/Loader";
import {  useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import styles from "./Dashboard.module.css";

type BookDataType = {
  id: number ,
  title: string, 
  author: string, 
  createdBy: number, 
  coverUrl: string, 
  genre: string, 
  publishYear: string
}

const Dashboard = () => {
  const { user} = useAuth()
  const {
    data: books,
    error,
    isPending,
  } = useFetch<BookDataType[]>(`http://localhost:3000/api/v1/users/${user.id}/books`);
  console.log(books)
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
