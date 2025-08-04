import { Table, TableProps } from 'antd'
import styles from './UsersList.module.css'
import { UserListProps, UsersListType } from '../../types/userTypes'
import { useNavigate } from 'react-router'


const columns:TableProps<UsersListType>['columns'] = [
{
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>
},
{
    title: 'Username',
    dataIndex: 'user_name',
    key: 'user_name'
},
{
    title: 'Email',
    dataIndex: 'email', 
    key: 'email'
}
]


const UsersList = ({usersData}: UserListProps) => {
    const navigate = useNavigate()
    return <Table rowKey='id' columns={columns} dataSource={usersData} onRow={(record) => {
        return {
            onClick: () => {
                navigate(`/users/${record.id}`)
            }
        }
    }}/>
}

export default UsersList