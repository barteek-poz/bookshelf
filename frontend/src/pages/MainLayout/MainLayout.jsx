import { Outlet } from "react-router";
import Menu from '../../components/Menu/Menu';
import styles from './MainLayout.module.css';

const MainLayout = () => { 
  
    return <main className={styles.mainLayout}>
        <Menu/>
        <Outlet/>
    </main>
}

export default MainLayout