import { Table, TableProps } from 'antd'
import { useNavigate } from 'react-router'
import { BookDataType, BookListProps } from '../../types/bookTypes'


const columns:TableProps<BookDataType>['columns'] = [
{
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>
},
{
    title: 'Title', 
    dataIndex: 'title', 
    key: 'title'
}, 
{
    title: 'Author', 
    dataIndex: 'author',
    key: 'author'
}, 
{
    title: 'Genre', 
    dataIndex: 'genre', 
    key: 'genre', 
}
]


const BooksList = ({booksData}: BookListProps) => {
    const navigate = useNavigate()
    return <Table rowKey='id' columns={columns} dataSource={booksData} onRow={(record) => {
        return {
            onClick: () => {
                navigate(`/books/${record.id}`)
            }
        }
    }}/>
}

export default BooksList