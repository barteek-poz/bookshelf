import { Button } from 'antd';
import { useEffect, useState } from 'react';
import BooksList from '../../components/BooksList/BooksList';
import UsersList from '../../components/UsersList/UsersList';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import useFetch from '../../hooks/useFetch';
import { BookDataType } from '../../types/bookTypes';
import { UsersListType } from '../../types/userTypes';
import styles from './AdminPage.module.css';
import { AdminSummary } from '../../types/adminTypes';

const AdminPage = () => {
    const [books, setBooks] = useState<BookDataType[] | null>(null)
    const [users, setUsers] = useState<UsersListType[] | null>(null)
    const {errorHandler} = useErrorHandler()
    const {fetchData:fetchUsers, error:usersError} = useFetch<UsersListType[]>()
    const {fetchData:fetchBooks, error:booksError} = useFetch<BookDataType[]>()
    const {data:summary, error:summaryError} = useFetch<AdminSummary>('http://localhost:3000/api/v1/admin/get-summary')

    const getUsersHandler = async () => {
       const fetchedUsers = await fetchUsers('http://localhost:3000/api/v1/users/get-all')
       if(fetchedUsers) {
        setUsers(fetchedUsers)
        setBooks(null)
       }
    }
    const getBooksHandler = async () => {
        const fetchedBooks = await fetchBooks('http://localhost:3000/api/v1/books/get-all')
        if(fetchedBooks) {
            setBooks(fetchedBooks)
            setUsers(null)
        }
    }
    
    useEffect(()=>{
        if(usersError) {
            errorHandler('Sorry, something went wrong and we could not fetch users from our database. Please refresh the page or try again later.')
        } else if (booksError) {
            errorHandler('Sorry, something went wrong and we could not fetch books from our database. Please refresh the page or try again later.')

        }
        else if (summaryError) {
            errorHandler('Sorry, something went wrong and we could not fetch summary information from database. Please refresh the page or try again later.')

        }
    },[usersError, booksError, errorHandler])

    return <section className={styles.adminPage}>
        <h2>Admin panel</h2>
        <p><span className={styles.logo}>Bookshelf</span> summary:</p>
        <p>Number of books in database: {summary?.numOfBooks}</p>
        <p>Number of users: {summary?.numOfUsers}</p>
        <div className={styles.btnsWrapper}>
            <Button className={styles.adminBtns} onClick={getUsersHandler}>Show all users</Button>
            <Button className={styles.adminBtns} onClick={getBooksHandler}>Show all books</Button>
        </div>
       {users && <UsersList usersData={users}/>}
       {books && <BooksList booksData={books} />}
    </section>
}

export default AdminPage