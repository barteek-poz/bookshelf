import { LeftSquareOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber } from 'antd';
import { useContext, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BookCoverInput from '../../components/BookCoverInput/BookCoverInput';
import GenreSelect from '../../components/GenreSelect/GenreSelect';
import Loader from '../../components/Loader/Loader';
import useFetch from '../../hooks/useFetch';
import styles from './EditBook.module.css';
import { AuthContext } from '../../context/AuthContext';


const EditBook = () => {
    const [cover, setCover] = useState(null)
    const [coverPreview, setCoverPreview] = useState(null)
    const [bookGenre, setBookGenre] = useState("")
    const {accessToken} = useContext(AuthContext)
    const navigate = useNavigate()
    const bookId = useParams().id
    const {data: bookData, error, isPending} = useFetch(`http://localhost:3000/api/v1/books/${bookId}`);

    const updateBookHandler = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);  
      const appendData = {
        bookCover: cover,
        genre: bookGenre.genre
      };
      for (const [key, value] of Object.entries(appendData)) {
        if (value) {
          formData.append(key, value);
        }
      }
        try {
            const response = await fetch(`http://localhost:3000/api/v1/books/${bookId}`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              credentials: 'include',
              body: formData,
            });
            const data = await response.json();
            if (response.ok) {
              navigate(`/books/${bookId}`)
            } else {
              alert("Could not update the book cover", data.error);
            }
        } catch (error) {
          alert(error);
        }
      };

    const coverPreviewHandler = (e) => {
        const coverFile = e.target.files[0]
        if(coverFile) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setCoverPreview(reader.result)
            }
            reader.readAsDataURL(coverFile)
        }
    }    
    return (
        <section id='addBook' className={styles.addBookSection}>
        <Link to={`/books/${bookId}`} className={styles.backBtn}><LeftSquareOutlined />Back</Link>
            <div className={styles.bookContent}>
                {isPending && <Loader />}
                {bookData && <div className={styles.bookCoverCont}>
                     {!coverPreview && <img src={bookData.coverUrl ? bookData.coverUrl : "/cover-default.jpg"} alt="book cover" className={styles.bookCover} style={{border: bookData.coverUrl ? 'none' : '1px solid #11243a'}}/>}
                     {coverPreview && <img src={coverPreview} alt="book cover" className={styles.bookCover}/>}
                    <BookCoverInput setCover={setCover} coverPreviewHandler={coverPreviewHandler} />
                </div>}
                {bookData && <form className={styles.bookForm} onSubmit={updateBookHandler} encType="multipart/form-data">
                    <Input defaultValue={bookData.title} placeholder='Book title' type='text' name='title' id='title' className={styles.bookInput}/>
                    <Input defaultValue={bookData.author} placeholder='Author' type='text' name='author' id='author' className={styles.bookInput}/>
                    <InputNumber defaultValue={bookData.publishYear} placeholder='Publish year' type='number' name='publishYear' id='publishYear' className={styles.bookInput} min={1} max={new Date().getFullYear()} controls={false}/>
                    <GenreSelect defaultValue={bookData.genre} setInputData={setBookGenre}/>
                    <div className={styles.formButtons}>
                    <Button className={styles.formBtn} htmlType='submit'>Save</Button>
                    <Link to={`/books/${bookId}`}><Button className={styles.formBtn}>Cancel</Button></Link>
                    </div>
                </form>}
            </div>
            
       </section>
    )
}

export default EditBook