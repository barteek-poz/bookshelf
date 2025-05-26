import { useContext, useState } from "react";
import Book from "../../components/Book/Book";
import useFetch from "../../hooks/useFetch";
import styles from "./SearchPage.module.css";
import { Button, Input } from "antd";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import BookPropositions from "../../components/BookPropositions/BookPropositions";

const SearchPage = () => {
    const [inputData, setInputData] = useState({
		title: '',
		author: '',
		publishYear: null,
		genre: '',
		coverUrl: '',
	});
	const [existingBooks, setExistingBooks] = useState([]);
	const [searchedTitle, setSearchedTitle] = useState(null);
	const [cover, setCover] = useState(null);
	const [coverPreview, setCoverPreview] = useState(null);
	const { accessToken, user } = useContext(AuthContext);
	const navigate = useNavigate();
  const {
    data: books,
    error,
    isPending,
  } = useFetch(`http://localhost:3000/api/v1/books/get-all`);
 
  const searchTitleHandler = async (bookTitle) => {
    if (bookTitle.length >= 3) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/books/search-by-title`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ bookTitle: bookTitle }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setExistingBooks(data.books);
                console.log(data.books);
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
console.log(existingBooks)
const previewExistingBookHandler = (book) => {
    setSearchedTitle(book);
    setInputData({
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
    <section id="searchPage" className={styles.searchPage}>
      <div className={styles.searchBarWrapper}>
        <h2>Search</h2>
        <Input
          placeholder="Enter the title of the book you are looking for..."
          className={styles.searchBar}
          onChange={(e) => {
            setInputData((prev) => ({ ...prev, title: e.target.value }));
            searchTitleHandler(e.target.value);
        }}
        />
        {existingBooks.length >= 1 && (
							<BookPropositions
								existingBooks={existingBooks}
								previewExistingBookHandler={previewExistingBookHandler}
							/>
						)}
      </div>
      <div className={styles.recentBooksWrapper}>
      <h2>Recently added books</h2>
      <div className={styles.recentBooks}>
        {books &&
          books.map((book) => {
            return (
              <Book
                key={book._id}
                id={book._id}
                title={book.title}
                author={book.author}
                cover={book.coverUrl}
              />
            );
          })}
      </div>
      </div>
      
    </section>
  );
};

export default SearchPage;
