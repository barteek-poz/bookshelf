import { useContext, useEffect, useState } from "react";
import BookRow from "../../components/BookRow/BookRow";
import Loader from "../../components/Loader/Loader";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";
import { useLoaderData } from "react-router";

const Dashboard = () => {
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { user, accessToken } = useContext(AuthContext);

  const userBooksLoader = async () => {
    setIsPending(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}/books`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(response.statusText);
      const jsonData = await response.json();
      setBooks(jsonData.books);
      setError(false);
    } catch (error) {
      console.log("Error loading books:", error);
      setError(true);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    userBooksLoader();
  }, []);

  return (
    <section id="dashboard" className={styles.dashboard}>
      {isPending && <Loader />}
      {books?.length > 0 && <BookRow books={books} />}
      {error && <h2>Failed to load books</h2>}
    </section>
  );
};

export default Dashboard;
