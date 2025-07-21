import { Button, Input, InputNumber } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import defaultBookCover from "../../assets/cover-default.jpg";
import BookCoverInput from "../../components/BookCoverInput/BookCoverInput";
import BookPropositions from "../../components/BookPropositions/BookPropositions";
import GenreSelect from "../../components/GenreSelect/GenreSelect";
import useAuthUser from "../../hooks/useAuthUser";
import { BookDataType, BookInputType } from "../../types/bookTypes";
import styles from "./AddBook.module.css";

const AddBook = () => {
  const [existingBooks, setExistingBooks] = useState<BookDataType[]>([]);
  const [searchedTitle, setSearchedTitle] = useState<BookDataType | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { accessToken, user } = useAuthUser();
  const navigate = useNavigate();
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookInputType>({
    defaultValues: {
      title: "",
      author: "",
      publishYear: null,
      genre: null,
      coverUrl: "",
    },
  });

  const addExistingBookHandler = async ():Promise<void> =>  {
    if(!searchedTitle) { 
      alert(`Could not add the book because of book title error`);
      return
    }
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/${user.id}/add-book`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
            body: JSON.stringify({ bookId: searchedTitle.id }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          navigate(`/`);
        } else {
          alert(`Could not add book: ${data.message}`);
        }
      } catch (error:unknown) {
        alert(error);
      }
  };

  const addBookHandler = async (data:BookInputType):Promise<void> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value !== null ? String(value) : 'null');
    });
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
        navigate(`/`);
      } else {
        alert(`Could not add book: ${data.message}`);
      }
    } catch (error:unknown) {
      alert(error);
    }
  };

  const coverPreviewHandler = (coverFile:File) => {
    if (coverFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string
        setCoverPreview(result);
      };
      reader.readAsDataURL(coverFile);
    }
  };

  const searchTitleHandler = async (bookTitle:string):Promise<void> => {
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
      } catch (error:unknown) {
        alert(error);
      }
    } else if (bookTitle.length < 3) {
      setExistingBooks([]);
    }
  };
  const previewExistingBookHandler = (book:BookDataType) => {
    console.log(book)
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
            src={coverPreview ? coverPreview : defaultBookCover}
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
