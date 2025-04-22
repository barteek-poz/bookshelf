import styles from "./BookCoverInput.module.css"
const BookCoverInput = ({setCover, coverPreviewHandler}) => {
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
          setCover(e.target.files[0]);
          coverPreviewHandler(e);
        }}
      />
    </>
  );
};


export default BookCoverInput