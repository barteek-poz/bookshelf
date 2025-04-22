import styles from './MainLayout.module.css'
import { Link, Outlet } from "react-router"

const MainLayout = () => {
    return <main className={styles.mainLayout}>
        <Link to='/' className={styles.mainHeader}><h1>Bookshelf</h1></Link>
        <Outlet/>
    </main>
}

export default MainLayout