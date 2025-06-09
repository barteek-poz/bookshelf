import styles from "./Menu.module.css";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import bookIcon from '../../../public/book-icon.svg'
import searchIcon from '../../../public/search-icon.svg'
import addBookIcon from '../../../public/add-book-icon.svg'
import logoutIcon from '../../../public/logout-icon.svg'
import burgerIcon from '../../../public/burger-icon.svg'
import closeIcon from '../../../public/close-icon.svg'

const Menu = () => {
  const [burgerActive, setBurgerActive] = useState(false)
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
      <h1 className={styles.logo} style={{visibility: burgerActive? "hidden" : "visible"}}>Bookshelf</h1>
      <img src={burgerIcon} alt="burger-icon" className={styles.burgerIcon} onClick={()=>setBurgerActive(!burgerActive)} />
      <nav className={styles.navigation} style={{left: burgerActive? "0px" : "-100%"}}>
        <img src={closeIcon} alt="close-icon" className={styles.closeIcon} onClick={()=>setBurgerActive(!burgerActive)} />
        <Link to="/" onClick={()=>setBurgerActive(false)}><img src={bookIcon} alt="book-icon" className={styles.menuIcon} />Library</Link>
        <Link to="/books/search" onClick={()=>setBurgerActive(false)}><img src={searchIcon} alt="search-icon" className={styles.menuIcon}/>Search</Link>
        <Link to="/books/add" onClick={()=>setBurgerActive(false)}><img src={addBookIcon} alt="add-book-icon" className={styles.menuIcon}/>Add book</Link>
        <Link onClick={logoutHandler}>
        <img src={logoutIcon} alt="logout-icon" className={styles.menuIcon}/>Logout
        </Link>
      </nav>
    </div>
  );
};

export default Menu;
