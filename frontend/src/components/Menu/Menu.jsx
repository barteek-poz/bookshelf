import styles from "./Menu.module.css";
import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { Button } from "antd";
import { AuthContext } from "../../context/AuthContext";
import bookIcon from '../../../public/book-icon.svg'
import searchIcon from '../../../public/search-icon.svg'
import addBookIcon from '../../../public/add-book-icon.svg'
import logoutIcon from '../../../public/logout-icon.svg'

const Menu = () => {
  const { setIsAuthenticated, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      alert("Could not logout");
      console.log(error);
    }
  };
  return (
    <div className={styles.navWrapper}>
      <h1 className={styles.logo}>Bookshelf</h1>
      <nav className={styles.navigation}>
        <Link to="/"><img src={bookIcon} alt="book-icon"/>Library</Link>
        <Link to="/books/search"><img src={searchIcon} alt="search-icon"/>Search</Link>
        <Link to="/books/add"><img src={addBookIcon} alt="add-book-icon"/>Add book</Link>
        <Link onClick={logoutHandler}>
        <img src={logoutIcon} alt="logout-icon"/>Logout
        </Link>
      </nav>
    </div>
  );
};

export default Menu;
