import styles from "./Dashboard.module.css";
import Loader from "../../components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import BookRow from "../../components/BookRow/BookRow";

const Dashboard = () => {
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { setIsAuthenticated, user, accessToken} = useContext(AuthContext);
  const navigate = useNavigate();

  const userBooksLoader = async () => {
    setIsPending(true);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/${user._id}/books`, {
        method: "GET",
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(response.statusText);
      const jsonData = await response.json();
      setBooks(jsonData.data);
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
    <section id='dashboard' className={styles.dashboard}>
      {isPending && <Loader />}
      {!isPending && <Link to='/books/add'><Button className={styles.addBtn}>Add book</Button></Link>}
      
          {books?.length > 0 && <BookRow books={books}/>}
          {error && <h2>Failed to load books</h2>}


    </section>
  );
};

export default Dashboard;
