import styles from './ErrorElement.module.css'
const ErrorElement = () => {
    return <section className={styles.errorElement}>
        <h1>Bookshelf</h1>
        <p>Sorry, but something went wrong. Please refresh the page or try to reconnect later.</p>
    </section>
}

export default ErrorElement