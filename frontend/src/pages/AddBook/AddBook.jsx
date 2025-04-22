import { Button, Input } from 'antd';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LeftSquareOutlined } from '@ant-design/icons';
import mongoObjectIdGenerator from '../../helpers/mongoObjectIdGenerator';
import styles from './AddBook.module.css';
import BookCoverInput from '../../components/BookCoverInput/BookCoverInput';
import GenreSelect from '../../components/GenreSelect/GenreSelect';
import { AuthContext } from '../../context/AuthContext';

const AddBook = () => {
	const [cover, setCover] = useState(null);
	const [coverPreview, setCoverPreview] = useState(null);
	const [bookGenre, setBookGenre] = useState('');
	const { accessToken, user } = useContext(AuthContext);
	const navigate = useNavigate();

	const addBookHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const newBookId = mongoObjectIdGenerator();
		formData.append('id', newBookId);
		formData.append('genre', bookGenre);
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
					onSubmit={addBookHandler}
					encType='multipart/form-data'>
					<Input
						placeholder='Book title'
						type='text'
						name='title'
						id='title'
						className={styles.bookInput}
					/>
					<Input
						placeholder='Author'
						type='text'
						name='author'
						id='author'
						className={styles.bookInput}
					/>
					<Input
						placeholder='Publish year'
						type='number'
						name='publishYear'
						id='publishYear'
						className={styles.bookInput}
					/>
					<GenreSelect setBookGenre={setBookGenre} />
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
