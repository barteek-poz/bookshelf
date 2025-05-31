import { useContext, useEffect, useState } from 'react';
 import { LeftSquareOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { Link, useLoaderData, useNavigate, useParams } from "react-router";
import Loader from "../../components/Loader/Loader";
import useFetch from "../../hooks/useFetch";
import styles from "./BookPage.module.css";
import upperFirstLetter from '../../helpers/upperFirstLetter';
import { AuthContext } from '../../context/AuthContext';

const BookPage = () => {
  const [canUserEdit, setCanUserEdit] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const bookId = useParams().id;
  const navigate = useNavigate()
  const {user, accessToken} = useContext(AuthContext)
  const {data: bookData, error, isPending} = useFetch(`http://localhost:3000/api/v1/books/${bookId}`,"GET");
  const loaderData = useLoaderData()
  console.log(loaderData)

  const deleteBookHandler = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/users/books/${bookId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (response.ok) {       
        navigate('/')
      } else {
        throw error
      }
    } catch(error) {
      alert('Could not delete the book')
      console.log(error)
    }
  }
  useEffect(()=>{
  if(bookData?.createdBy.toString() === user._id) {
    setCanUserEdit(true)
  }
  },[bookData, user])
  return (
    <section id="bookPage" className={styles.bookPage}>
      <div className={styles.bookContent}> 
        {isPending && <Loader />}
        {bookData && (
          <div className={styles.bookCoverCont}>
            {bookData && <img src={bookData.coverUrl ? bookData.coverUrl : "/cover-default.jpg"} alt="book cover" className={styles.bookCover} style={{border: bookData.coverUrl ? 'none' : '1px solid #11243a'}}/>}
          </div>
        )}
        {bookData && (
          <div className={styles.bookData}>
            <h2>{bookData.title}</h2>
            <h3>{bookData.author}</h3>
            {bookData.genre ? <p>{upperFirstLetter(bookData.genre)}</p> : <p className={styles.defaultText}>Genre</p>}
            {bookData.publishYear ? <p>{bookData.publishYear}</p> : <p className={styles.defaultText}>Publish year</p>}
          </div>
        )}
        </div>
        <div className={styles.btns}>
          {canUserEdit && <Link to={`/books/${bookData._id}/edit`}><Button className={styles.editBtn}>Edit book</Button></Link>}
          {bookData && <Button danger type='primary' onClick={()=>{setDeleteModalOpen(true)}} className={styles.deleteBtn}>Remove book from library</Button>}
        </div>
        {error && <h2 className={styles.errorMsg}>Sorry, something went wrong.<br></br>Please check your network connection or try later. </h2>}
        <Modal title='Confirm delete' open={deleteModalOpen} onOk={deleteBookHandler} onCancel={() => setDeleteModalOpen(false)}>
        <p>Are you sure you want to remove this book from your library?</p>
        </Modal>
    </section>
  );
};

export default BookPage;
