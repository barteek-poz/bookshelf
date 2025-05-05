import styles from './MainLayout.module.css'
import { useContext } from 'react'
import { Link, Outlet, useNavigate } from "react-router"
import { Button } from "antd";
import { AuthContext } from "../../context/AuthContext";

const MainLayout = () => { 
  const { setIsAuthenticated, user, setUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/auth/logout`, {
        method: "POST",
        credentials: 'include'
      });
      if (response.ok) {
        setUser(null)
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      alert('Could not logout');
      console.log(error);
    }
  };
    return <main className={styles.mainLayout}>
        <Link to='/' className={styles.mainHeader}><h1>Bookshelf</h1></Link>
        {user && <Button className={styles.logoutBtn} onClick={logoutHandler}>Logout</Button>}
        <Outlet/>
    </main>
}

export default MainLayout