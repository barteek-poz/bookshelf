import { Button, Popconfirm, Table, TableProps } from 'antd'
import { useAuth } from '../../context/AuthContext'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { UserListProps, UsersListType } from '../../types/userTypes'


const UsersList = ({usersData}: UserListProps) => {
    const {accessToken} = useAuth()
    const {errorHandler} = useErrorHandler()
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
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
              <Popconfirm
                title="Are you sure you want to delete this user?"
                onConfirm={() => deleteUserHandler(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
            ),
          },
        ]
    const deleteUserHandler = async (userId:number):Promise<void> => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/users/${userId}/delete`,
            {
              method: "DELETE",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (response.ok) {
            alert(`User was successfully deleted.`)
            location.reload()
          } else {
            throw new Error();
          }
        } catch (error:unknown) {
          errorHandler("Sorry, but someting went wrong and we could not delete this user. Please refresh the page or try again later.")
        }
      };
    return <Table rowKey='id' columns={columns} dataSource={usersData}/>
}

export default UsersList