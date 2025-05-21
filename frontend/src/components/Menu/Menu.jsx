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
        <Link to="/"><img src={bookIcon}/>Library</Link>
        <Link to="/"><img src={searchIcon}/>Search</Link>
        <Link to="/books/add"><img src={addBookIcon}/>Add book</Link>
        <Link onClick={logoutHandler}>
        <img src={logoutIcon}/>Logout
        </Link>
      </nav>
    </div>
  );
};

export default Menu;
