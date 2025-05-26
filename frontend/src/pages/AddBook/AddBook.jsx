import styles from './AddBook.module.css';
import { Button, Input } from 'antd';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LeftSquareOutlined } from '@ant-design/icons';
import mongoObjectIdGenerator from '../../helpers/mongoObjectIdGenerator';
import BookCoverInput from '../../components/BookCoverInput/BookCoverInput';
import GenreSelect from '../../components/GenreSelect/GenreSelect';
import { AuthContext } from '../../context/AuthContext';
import BookPropositions from '../../components/BookPropositions/BookPropositions';

const AddBook = () => {
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

	const addExistingBookHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				`http://localhost:3000/api/v1/users/${user._id}/add-book`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: 'include',
					body: JSON.stringify({bookId:searchedTitle._id}),
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
	const addBookHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const newBookId = mongoObjectIdGenerator();
		formData.append('id', newBookId);
		formData.append('genre', inputData.genre);
		if (cover) {
			formData.append('bookCover', cover);
		}
		try {
			const response = await fetch(`http://localhost:3000/api/v1/books/add`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				credentials: 'include',
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
		<section id='addBook' className={styles.addBookSection}>
			<Link to='/' className={styles.backBtn}>
				<LeftSquareOutlined />
				Back
			</Link>
			<div className={styles.bookContent}>
				<div className={styles.bookCoverCont}>
					<img
						src={coverPreview ? coverPreview : '/cover-default.jpg'}
						alt='cover preview'
						className={styles.bookCover}
						style={{ border: coverPreview ? 'none' : '1px solid #11243a ' }}
					/>
					<BookCoverInput
						setCover={setCover}
						coverPreviewHandler={coverPreviewHandler}
					/>
				</div>
				<form
					className={styles.bookForm}
					onSubmit={(e) => {
						if (searchedTitle) {
							addExistingBookHandler(e);
						} else {
							addBookHandler(e);
						}
					}}
					encType='multipart/form-data'>
					<div className={styles.bookTitleBar}>
						<Input
							placeholder='Book title'
							type='text'
							name='title'
							id='title'
							className={styles.bookInput}
							value={inputData.title}
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
					<Input
						placeholder='Author'
						type='text'
						name='author'
						id='author'
						className={styles.bookInput}
						value={inputData.author}
						onChange={(e) => {
							setInputData((prev) => ({ ...prev, author: e.target.value }));
						}}
					/>
					<Input
						placeholder='Publish year'
						type='number'
						name='publishYear'
						id='publishYear'
						min={1}
						max={new Date().getFullYear()}
						className={styles.bookInput}
						value={inputData.publishYear}
						onChange={(e) => {
							setInputData((prev) => ({
								...prev,
								publishYear: e.target.value,
							}));
						}}
					/>
					<GenreSelect setInputData={setInputData} value={inputData.genre} defaultValue="Select genre" />
					<div className={styles.formButtons}>
						<Button className={styles.formBtn} htmlType='submit'>
							Save
						</Button>
						<Link to='/'>
							<Button className={styles.formBtn}>Cancel</Button>
						</Link>
					</div>
				</form>
			</div>
		</section>
	);
};

export default AddBook;
