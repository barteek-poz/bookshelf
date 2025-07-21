import { BookDataType } from "../../types/bookTypes";
import styles from "./Book.module.css"
import { Link } from "react-router-dom";

const Book = ({id, title, author, coverUrl}:BookDataType) => {    
    return (
        <Link to={`/books/${id}`} className={styles.book} style={{backgroundImage: coverUrl ? `url(${coverUrl})`: '', border: coverUrl !== null ? 'none' : '1px solid #000'}}>
            {coverUrl === null && <div className={styles.bookInfo}>
                <h4>{title}</h4>
                <p>{author}</p>
            </div>}
            
        </Link>
    )
}

export default Book