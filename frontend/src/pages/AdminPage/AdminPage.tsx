import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { User, UsersListType } from '../../types/userTypes';
import styles from './AdminPage.module.css';
import { BookDataType } from '../../types/bookTypes';
import UsersList from '../../components/UsersList/UsersList';
import BooksList from '../../components/BooksList/BooksList';

const AdminPage = () => {
    const [users, setUsers] = useState<UsersListType[] | null>(null)
    const [books,setBooks] = useState<BookDataType[] | null>(null)
    const {user, accessToken} = useAuth()
    const {errorHandler} = useErrorHandler()

    // const getUsersHandler = async ():Promise<void> =>  {
    //       try {
    //         const response = await fetch(
    //           `http://localhost:3000/api/v1/users/get-all`,
    //           {
    //             method: "GET",
    //             headers: {
    //               "Content-Type": "application/json",
    //               Authorization: `Bearer ${accessToken}`,
    //             },
    //             credentials: "include",
    //           }
    //         );
    //         if (!response.ok) {
    //             throw new Error()
    //         } 
    //         const dataObj = await response.json();
    //         setBooks(null)
    //         setUsers(dataObj.data)
    //       } catch (error) {
    //         errorHandler("Sorry, something went wrong and we could not get users list from database. Please refresh the page or try again later.");
    //       }
    //   };
    const getUsersHandler = () => {
        
    }
    const getBooksHandler = async ():Promise<void> =>  {
          try {
            const response = await fetch(
              `http://localhost:3000/api/v1/books/get-all`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                credentials: "include",
              }
            );
            if (!response.ok) {
                throw new Error()
            } 
            const dataObj = await response.json();
            setUsers(null)
            setBooks(dataObj.data)
          } catch (error) {
            errorHandler("Sorry, something went wrong and we could not get users list from database. Please refresh the page or try again later.");
          }
      };

    return <section className={styles.adminPage}>
        <h2>Admin panel</h2>
        <p><span className={styles.logo}>Bookshelf</span> summary:</p>
        <p>Number of books in databse: 31</p>
        <p>Number of users: 5</p>
        <div className={styles.btnsWrapper}>
            <Button className={styles.adminBtns} onClick={getUsersHandler}>Show all users</Button>
            <Button className={styles.adminBtns} onClick={getBooksHandler}>Show all books</Button>
        </div>
       {users && <UsersList usersData={users}/>}
       {books && <BooksList booksData={books} />}
    </section>
}

export default AdminPage