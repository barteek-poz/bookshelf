import styles from "./AddBook.module.css";
import { Button, Input, InputNumber } from "antd";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mongoObjectIdGenerator from "../../helpers/mongoObjectIdGenerator";
import BookCoverInput from "../../components/BookCoverInput/BookCoverInput";
import GenreSelect from "../../components/GenreSelect/GenreSelect";
import { AuthContext } from "../../context/AuthContext";
import BookPropositions from "../../components/BookPropositions/BookPropositions";
import { useForm, Controller } from "react-hook-form";

const AddBook = () => {
  const [existingBooks, setExistingBooks] = useState([]);
  const [searchedTitle, setSearchedTitle] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const { accessToken, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      publishYear: null,
      genre: null,
      coverUrl: "",
    },
  });

  const addExistingBookHandler = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user._id}/add-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ bookId: searchedTitle._id }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        navigate(`/`);
      } else {
        alert(`Could not add book: ${data.message}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  const addBookHandler = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const newBookId = mongoObjectIdGenerator();
    formData.append("id", newBookId);
    if (cover) {
      formData.append("bookCover", cover);
    }
    try {
      const response = await fetch(`http://localhost:3000/api/v1/books/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/books/${newBookId}`);
      } else {
        alert(`Could not add book: ${data.message}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  const coverPreviewHandler = (e) => {
    const coverFile = e.target.files[0];
    if (coverFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(coverFile);
    }
  };
  const searchTitleHandler = async (bookTitle) => {
    if (bookTitle.length >= 3) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/books/search-by-title`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify({ bookTitle: bookTitle }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setExistingBooks(data.books);
        } else {
          alert(`Could not get books: ${data.message}`);
        }
      } catch (error) {
        alert(error);
      }
    } else if (bookTitle.length < 3) {
      setExistingBooks([]);
    }
  };
  const previewExistingBookHandler = (book) => {
    setSearchedTitle(book);
    reset({
      title: book.title,
      author: book.author,
      publishYear: book.publishYear,
      genre: book.genre,
      coverUrl: book.coverUrl,
    });
    setCoverPreview(book.coverUrl);
    setExistingBooks([]);
  };
  return (
    <section id="addBook" className={styles.addBookSection}>
      <div className={styles.bookContent}>
        <div className={styles.bookCoverCont}>
          <img
            src={coverPreview ? coverPreview : "/cover-default.jpg"}
            alt="cover preview"
            className={styles.bookCover}
            style={{ border: coverPreview ? "none" : "1px solid #11243a " }}
          />
          <BookCoverInput
            setCover={setCover}
            coverPreviewHandler={coverPreviewHandler}
          />
        </div>
        <form
          className={styles.bookForm}
          onSubmit={handleSubmit((data) => {
            if (searchedTitle) {
              addExistingBookHandler();
            } else {
              addBookHandler(data);
            }
          })}
          encType="multipart/form-data">
          <div className={styles.bookInputWrapper}>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{ required: "Please provide book title" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Book title"
                  className={styles.bookInput}
                  onChange={(e) => {
                    field.onChange(e);
                    searchTitleHandler(e.target.value);
                  }}
                />
              )}
            />
            {existingBooks.length >= 1 && (
              <BookPropositions
                existingBooks={existingBooks}
                previewExistingBookHandler={previewExistingBookHandler}
              />
            )}
            <p
              style={{ display: errors?.title ? "block" : "none" }}
              className={styles.errorMsg}>
              {errors?.title?.message}
            </p>
          </div>
          <div className={styles.bookInputWrapper}>
            <Controller
              name="author"
              control={control}
              defaultValue=""
              rules={{ required: "Please provide book author" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Author"
                  className={styles.bookInput}
                  onChange={(e) => field.onChange(e)}
                />
              )}
            />
            <p
              style={{ display: errors?.author ? "block" : "none" }}
              className={styles.errorMsg}>
              {errors?.author?.message}
            </p>
          </div>
          <Controller
            name="publishYear"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <InputNumber
                {...field}
                placeholder="Publish year"
                min={1}
                max={new Date().getFullYear()}
                className={styles.bookInput}
                onChange={(e) => field.onChange(e)}
              />
            )}
          />
          <GenreSelect control={control} defaultValue={null} />
          <div className={styles.formButtons}>
            <Button className={styles.formBtn} htmlType="submit">
              Save
            </Button>
            <Link to="/">
              <Button className={styles.formBtn}>Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddBook;
