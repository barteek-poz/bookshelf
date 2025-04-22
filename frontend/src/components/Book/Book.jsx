import styles from "./Book.module.css"
import { Link } from "react-router-dom";

const Book = ({id, title, author, cover}) => {    
    return (
        <Link to={`/books/${id}`} className={styles.book} style={{backgroundImage: cover ? `url(${cover})`: '', borderColor: cover !== null ? 'transparent' : '#000'}}>
            {cover === null && <div className={styles.bookInfo}>
                <h4>{title}</h4>
                <p>{author}</p>
            </div>}
            
        </Link>
    )
}

export default Book