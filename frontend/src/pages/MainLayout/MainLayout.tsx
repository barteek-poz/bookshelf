import { Outlet } from "react-router";
import Menu from "../../components/Menu/Menu";
import useAuthUser from "../../hooks/useAuthUser";
import styles from "./MainLayout.module.css";

const MainLayout = () => {
  const { isAuthenticated } = useAuthUser();
  return (
    <main className={styles.mainLayout}>
      {isAuthenticated && <Menu />}
      <Outlet />
    </main>
  );
};

export default MainLayout;
