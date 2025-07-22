import { Outlet } from "react-router";
import Menu from "../../components/Menu/Menu";
import { useAuth } from "../../context/AuthContext";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  return (
    <main className={styles.mainLayout}>
      {isAuthenticated && <Menu />}
      <Outlet />
    </main>
  );
};

export default MainLayout;
