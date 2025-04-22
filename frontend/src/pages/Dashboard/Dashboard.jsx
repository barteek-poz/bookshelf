import styles from "./Dashboard.module.css"
import Book from '../../components/Book/Book';
import useFetch from '../../hooks/useFetch';
import Loader from "../../components/Loader/Loader";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "antd";
import { useContext, useState, useEffect} from "react";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const [books, setBooks] = useState(null)
  const [error, setError] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()
  const {setIsAuthenticated, user, accessToken} = useContext(AuthContext)
  
 
  const userBooksLoader = async () => {
    setIsPending(true)
    try {
        const response = await fetch(`http://localhost:3000/api/v1/books`, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify({books: user.books}),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const jsonData = await response.json();
      console.log(jsonData)
      setIsPending(false);
      setBooks(jsonData.data);
      setError(null);
    } catch(error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    userBooksLoader()
  },[])

  const logoutHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/logout`, {
        method: "POST",
        credentials: 'include'
      });
      if (response.ok) {    
        sessionStorage.removeItem('accessToken')   
        setIsAuthenticated(false)
        navigate('/login')
      } else {
        throw error
      }
    } catch(error) {
      alert('Could not logout')
      console.log(error)
    }
  }
  return (
    <section id='dashboard' className={styles.dashboard}>
        {isPending && <Loader/>}
        {!isPending && <Button className={styles.addBtn} onClick={logoutHandler}>Logout</Button>}
        {!isPending && <Link to='/books/add'><Button className={styles.addBtn}>Add book</Button></Link>}
        <div className={styles.booksGrid}>
          {books ? books.map(book => {
              return <Book key={book._id} id={book._id} title={book.title} author={book.author} cover={book.coverUrl}/>
          }): <h2>No books found</h2>}
        </div>
        {error && <h2>No books found</h2>}
    </section>
      )
    }

export default Dashboard