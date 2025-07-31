import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { addExistingBookHandler } from "../../api/books";
import defaultBookCover from "../../assets/cover-default.jpg";
import Loader from "../../components/Loader/Loader";
import upperFirstLetter from "../../helpers/upperFirstLetter";
import useAuthUser from "../../hooks/useAuthUser";
import useFetch from "../../hooks/useFetch";
import { BookDataType } from "../../types/bookTypes";
import styles from "./BookPage.module.css";
import { useErrorHandler } from "../../hooks/useErrorHandler";

const BookPage = () => {
  const [canUserEdit, setCanUserEdit] = useState<boolean>(false);
  const [inLibrary, setInLibrary] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteFromDBModal, setDeleteFromDBModal] = useState<boolean>(false);
  const bookId:string | undefined = useParams().id;
  const navigate = useNavigate();
  const { user, accessToken } = useAuthUser();
  const {errorHandler} = useErrorHandler()
  const {
    data: bookData,
    error,
    isPending,
  } = useFetch<BookDataType>(`http://localhost:3000/api/v1/books/${bookId}`);
  const { data: userBooks } = useFetch<BookDataType[]>(
    `http://localhost:3000/api/v1/users/${user.id}/books`
  );

  const addExistingBook = async ():Promise<void>  => {
    try {
      if(accessToken && bookId)
      await addExistingBookHandler(user.id, accessToken, bookId);
      navigate("/");
    } catch (error:unknown) {
      errorHandler('Sorry, but we could not add this book to your library. Please refresh the page or try again later.')
    }
  };

  const deleteBookHandler = async ():Promise<void> => {
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
      if (response.ok) {
        navigate("/");
      } else {
        throw error;
      }
    } catch (error:unknown) {
      errorHandler("Sorry, but someting went wrong and we could not delete this book from your library. Please refresh the page or try again later.")
    }
  };
  const deleteFromDBHandler = async ():Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/books/${bookId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        navigate("/");
      } else {
        throw error;
      }
    } catch (error:unknown) {
      errorHandler("Sorry, but someting went wrong and we could not delete this book from database. Please refresh the page or try again later.")
    }
  };

  useEffect(() => {
    if (bookData?.createdBy === user.id) {
      setCanUserEdit(true);
    }
  }, [bookData, user]);

  useEffect(() => {
    const userBooksArr = userBooks?.map((book) => book.id);
    if (bookId && userBooksArr?.includes(+bookId)) {
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
          {user.is_admin ? (
            <Button
              danger
              type="primary"
              onClick={() => {
                setDeleteFromDBModal(true);
              }}
              className={styles.deleteBtn}>
              Remove book from database
            </Button>
          ): null}
        </div>
      )}
      {error && (
        <h2 className={styles.errorMsg}>
          Sorry, something went wrong.<br></br>Please check your network
          connection or try later.
        </h2>
      )}
      <Modal
        title="Confirm delete"
        open={deleteModalOpen}
        onOk={deleteBookHandler}
        onCancel={() => setDeleteModalOpen(false)}>
        <p>Are you sure you want to remove this book from your library?</p>
      </Modal>
      <Modal
        title="Confirm delete from database"
        open={deleteFromDBModal}
        onOk={deleteFromDBHandler}
        onCancel={() => setDeleteFromDBModal(false)}>
        <p>Are you sure you want to remove this book PERMANENTLY FROM DATABASE?</p>
      </Modal>
    </section>
  );
};

export default BookPage;
