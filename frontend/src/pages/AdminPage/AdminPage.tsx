import { Button } from 'antd'
import styles from './AdminPage.module.css'

const AdminPage = () => {
    return <section className={styles.adminPage}>
        <h2>Admin panel</h2>
        <p><span className={styles.logo}>Bookshelf</span> summary:</p>
        <p>Number of books in databse: 31</p>
        <p>Number of users: 5</p>
        <div className={styles.btnsWrapper}>
            <Button className={styles.adminBtns}>Show all users</Button>
            <Button className={styles.adminBtns}>Show all books</Button>
        </div>
    </section>
}

export default AdminPage