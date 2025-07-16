import { Button, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { addExistingBookHandler } from "../../api/books";
import defaultBookCover from "../../assets/cover-default.jpg";
import Loader from "../../components/Loader/Loader";
import { AuthContext } from "../../context/AuthContext.tsx";
import upperFirstLetter from "../../helpers/upperFirstLetter";
import useFetch from "../../hooks/useFetch";
import styles from "./BookPage.module.css";

const BookPage = () => {
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const bookId = useParams().id;
  const navigate = useNavigate();
  const { user, accessToken } = useContext(AuthContext);
  const {
    data: bookData,
    error,
    isPending,
  } = useFetch(`http://localhost:3000/api/v1/books/${bookId}`);
  const { data: userBooks } = useFetch(
    `http://localhost:3000/api/v1/users/${user.id}/books`
  );

  const addExistingBook = async () => {
    try {
      await addExistingBookHandler(user.id, accessToken, bookId);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  const deleteBookHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}/books/${bookId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.ok) {
        navigate("/");
      } else {
        throw error;
      }
    } catch (error) {
      alert("Could not delete the book");
      console.log(error);
    }
  };

  useEffect(() => {
    if (bookData?.createdBy === user.id) {
      setCanUserEdit(true);
    }
  }, [bookData, user]);

  useEffect(() => {
    const userBooksArr = userBooks?.map((book) => book.id);
    if (userBooksArr?.includes(+bookId)) {
      console.log("test1");
      setInLibrary(true);
    }
  }, [userBooks, bookId]);

  return (
    <section id="bookPage" className={styles.bookPage}>
      <div className={styles.bookContent}>
        {isPending && <Loader />}
        {bookData && (
          <div className={styles.bookCoverCont}>
            {bookData && (
              <img
                src={bookData.coverUrl ? bookData.coverUrl : defaultBookCover}
                alt="book cover"
                className={styles.bookCover}
                style={{
                  border: bookData.coverUrl ? "none" : "1px solid #11243a",
                }}
              />
            )}
          </div>
        )}
        {bookData && (
          <div className={styles.bookData}>
            <h2>{bookData.title}</h2>
            <h3>{bookData.author}</h3>
            {bookData.genre ? (
              <p>{upperFirstLetter(bookData.genre)}</p>
            ) : (
              <p className={styles.defaultText}>Genre</p>
            )}
            {bookData.publishYear ? (
              <p>{bookData.publishYear}</p>
            ) : (
              <p className={styles.defaultText}>Publish year</p>
            )}
          </div>
        )}
      </div>
      {bookData && (
        <div className={styles.btns}>
          {!inLibrary && (
            <Button className={styles.editBtn} onClick={addExistingBook}>
              Add book to your library
            </Button>
          )}
          {canUserEdit && (
            <Link to={`/books/${bookData.id}/edit`}>
              <Button className={styles.editBtn}>Edit book</Button>
            </Link>
          )}
          {inLibrary && (
            <Button
              danger
              type="primary"
              onClick={() => {
                setDeleteModalOpen(true);
              }}
              className={styles.deleteBtn}>
              Remove book from library
            </Button>
          )}
        </div>
      )}
      {error && (
        <h2 className={styles.errorMsg}>
          Sorry, something went wrong.<br></br>Please check your network
          connection or try later.{" "}
        </h2>
      )}
      <Modal
        title="Confirm delete"
        open={deleteModalOpen}
        onOk={deleteBookHandler}
        onCancel={() => setDeleteModalOpen(false)}>
        <p>Are you sure you want to remove this book from your library?</p>
      </Modal>
    </section>
  );
};

export default BookPage;
