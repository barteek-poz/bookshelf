import { BookCoverInputTypes } from "../../types/bookTypes";
import styles from "./BookCoverInput.module.css"


const BookCoverInput = ({setCover, coverPreviewHandler} : BookCoverInputTypes) => {

  const bookCoverHandler = (bookCover:File|null) => {
    if(bookCover) {
      setCover(bookCover);
      coverPreviewHandler(bookCover);
    }
  }
  return (
    <>
      <label className={styles.coverInput} htmlFor="bookCover">
        Select book cover
      </label>
      <input
        type="file"
        name="bookCover"
        accept="image/*"
        id="bookCover"
        className={styles.inputFile}
        onChange={(e) => {
          if(e.target.files) {
            console.log(e.target.files[0])
            bookCoverHandler(e.target.files[0])
          }
        }}
      />
    </>
  );
};


export default BookCoverInput