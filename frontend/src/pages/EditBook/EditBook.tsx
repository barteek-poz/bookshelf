import { Button, Input, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import defaultBookCover from "../../assets/cover-default.jpg";
import BookCoverInput from "../../components/BookCoverInput/BookCoverInput";
import GenreSelect from "../../components/GenreSelect/GenreSelect";
import Loader from "../../components/Loader/Loader";
import useAuthUser from "../../hooks/useAuthUser";
import useFetch from "../../hooks/useFetch";
import styles from "./EditBook.module.css";
import { BookDataType, BookInputType } from "../../types/bookTypes";

const EditBook = () => {
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { accessToken } = useAuthUser();
  const navigate = useNavigate();
  const bookId: string | undefined = useParams().id;
  const { data: bookData, error, isPending } = useFetch<BookDataType>(`https://bookshelf-nou0.onrender.com/api/v1/books/${bookId}`);
  const {handleSubmit,control,formState: { errors }} = useForm<BookInputType>();

  const updateBookHandler = async (data: BookInputType): Promise<void> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value !== null ? String(value) : "null");
    });
    if (cover) {
      formData.append("bookCover", cover);
    }
    try {
      const response = await fetch(`https://bookshelf-nou0.onrender.com/api/v1/books/${bookId}/edit`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/books/${bookId}`);
      } else {
        alert(`Could not update the book cover: ${data.error}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  const coverPreviewHandler = (coverFile: File) => {
    if (coverFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverPreview(result);
      };
      reader.readAsDataURL(coverFile);
    }
  };

  useEffect(() => {
    if (error?.code === 401 || error?.code === 403) {
      navigate(`/books/${bookId}`);
    }
  }, [error, bookId, navigate]);

  return (
    <section id="editBook" className={styles.editBookSection}>
      <div className={styles.bookContent}>
        {isPending && <Loader />}
        {bookData && (
          <div className={styles.bookCoverCont}>
            {!coverPreview && (
              <img
                src={bookData.coverUrl ? bookData.coverUrl : defaultBookCover}
                alt="book cover"
                className={styles.bookCover}
                style={{
                  border: bookData.coverUrl ? "none" : "1px solid #11243a",
                }}
              />
            )}
            {coverPreview && <img src={coverPreview} alt="book cover" className={styles.bookCover} />}
            <BookCoverInput setCover={setCover} coverPreviewHandler={coverPreviewHandler} />
          </div>
        )}
        {bookData && (
          <form className={styles.bookForm} onSubmit={handleSubmit(updateBookHandler)} encType="multipart/form-data">
            <div className={styles.bookInputWrapper}>
              <Controller
                name="title"
                control={control}
                defaultValue={bookData.title}
                rules={{ required: "Please provide book title" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Book title"
                    className={styles.bookInput}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                )}
              />
              <p style={{ display: errors?.title ? "block" : "none" }} className={styles.errorMsg}>
                {" "}
                {errors?.title?.message}
              </p>
            </div>
            <div className={styles.bookInputWrapper}>
              <Controller
                name="author"
                control={control}
                defaultValue={bookData.author}
                rules={{ required: "Please provide book author" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Author title"
                    className={styles.bookInput}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                )}
              />
              <p style={{ display: errors?.author ? "block" : "none" }} className={styles.errorMsg}>
                {" "}
                {errors?.author?.message}
              </p>
            </div>
            <Controller
              name="publishYear"
              control={control}
              defaultValue={bookData.publishYear}
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
            <GenreSelect control={control} defaultValue={bookData.genre} />
            <div className={styles.formButtons}>
              <Button className={styles.formBtn} htmlType="submit">
                Save
              </Button>
              <Link to={`/books/${bookId}`}>
                <Button className={styles.formBtn}>Cancel</Button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default EditBook;
