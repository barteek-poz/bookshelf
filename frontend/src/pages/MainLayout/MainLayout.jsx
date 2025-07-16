import { Outlet } from "react-router";
import Menu from "../../components/Menu/Menu";
import styles from "./MainLayout.module.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";

const MainLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <main className={styles.mainLayout}>
      {isAuthenticated && <Menu />}
      <Outlet />
    </main>
  );
};

export default MainLayout;
