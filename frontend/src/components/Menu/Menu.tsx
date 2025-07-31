import { useState } from "react";
import { Link, useNavigate } from "react-router";
import addBookIcon from "../../assets/add-book-icon.svg";
import bookIcon from "../../assets/book-icon.svg";
import burgerIcon from "../../assets/burger-icon.svg";
import closeIcon from "../../assets/close-icon.svg";
import logoutIcon from "../../assets/logout-icon.svg";
import searchIcon from "../../assets/search-icon.svg";
import adminIcon from "../../assets/admin-icon.svg";
import useAuthUser from "../../hooks/useAuthUser";
import styles from "./Menu.module.css";
import { useErrorHandler } from "../../hooks/useErrorHandler";

const Menu = () => {
  const [burgerActive, setBurgerActive] = useState<boolean>(false);
  const { setIsAuthenticated, setUser, user } = useAuthUser();
  const navigate = useNavigate();
  const {errorHandler} = useErrorHandler()

  const logoutHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error()
      } 
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      errorHandler('Sorry, something went wrong and we could not log You out. Please refresh the page or try again later.')
    }
  };
  return (
    <div className={styles.navWrapper}>
      <h1
        className={styles.logo}
        style={{ visibility: burgerActive ? "hidden" : "visible" }}>
        Bookshelf
      </h1>
      <img
        src={burgerIcon}
        alt="burger-icon"
        className={styles.burgerIcon}
        onClick={() => setBurgerActive(!burgerActive)}
      />
      <nav
        className={styles.navigation}
        style={{ left: burgerActive ? "0px" : "-100%" }}>
        <img
          src={closeIcon}
          alt="close-icon"
          className={styles.closeIcon}
          onClick={() => setBurgerActive(!burgerActive)}
        />
        <Link to="/" onClick={() => setBurgerActive(false)}>
          <img src={bookIcon} alt="book-icon" className={styles.menuIcon} />
          Library
        </Link>
        <Link to="/books/search" onClick={() => setBurgerActive(false)}>
          <img src={searchIcon} alt="search-icon" className={styles.menuIcon} />
          Search
        </Link>
        <Link to="/books/add" onClick={() => setBurgerActive(false)}>
          <img
            src={addBookIcon}
            alt="add-book-icon"
            className={styles.menuIcon}
          />
          Add book
        </Link>
        <Link to="" onClick={logoutHandler}>
          <img src={logoutIcon} alt="logout-icon" className={styles.menuIcon} />
          Logout
        </Link>
        {user.is_admin ? <Link to="/admin">
          <img src={adminIcon} alt="admin-icon" className={`${styles.menuIcon} ${styles.adminIcon}`} />
          Admin panel
        </Link> : null}
      </nav>
    </div>
  );
};

export default Menu;
