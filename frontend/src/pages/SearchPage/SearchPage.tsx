import { Input } from "antd";
import { useState } from "react";
import RecentBooks from "../../components/RecentBooks/RecentBooks";
import SearchResults from "../../components/SearchResults/SearchResults";
import useAuthUser from "../../hooks/useAuthUser";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { BookDataType } from "../../types/bookTypes";
import styles from "./SearchPage.module.css";

const SearchPage = () => {
  const [inputData, setInputData] = useState<string>("");
  const [existingBooks, setExistingBooks] = useState<BookDataType[] | []>([]);
  const { accessToken, user } = useAuthUser();
  const {errorHandler} = useErrorHandler()

  const searchTitleHandler = async (bookTitle: string): Promise<void> => {
    if (bookTitle.length < 2) {
      setExistingBooks([]);
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/books/search-by-title",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ bookTitle }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error();
      }
      setExistingBooks(data.books);
    } catch (error) {
      errorHandler("Sorry, something went wrong and we could not load books. Please refresh the page or try again later.");
    }
  };
  
  return (
    <section id="searchPage" className={styles.searchPage}>
      <div className={styles.searchBarWrapper}>
        <h2>Search</h2>
        <Input
          placeholder="Enter the title of the book you are looking for..."
          className={styles.searchBar}
          onChange={(e) => {
            setInputData(e.target.value);
            searchTitleHandler(e.target.value);
          }}
        />
      </div>
      <div className={styles.booksWrapper}>
        <div>
          {inputData.length >= 2 ? (
            <h2>Results for "{inputData}"</h2>
          ) : (
            <h2>Recently added books</h2>
          )}
        </div>
        {existingBooks.length < 1 && inputData.length < 2 ? (
          <RecentBooks />
        ) : null}
        {existingBooks && <SearchResults existingBooks={existingBooks} />}
      </div>
    </section>
  );
};

export default SearchPage;
