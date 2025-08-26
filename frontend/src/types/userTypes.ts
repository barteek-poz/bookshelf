export type User = {
    id: number,
    is_admin: boolean
  }

export type  UserLoginType = { 
    name: string,
    email: string, 
    password: string,
    passwordConfirm: string,

}

export type UsersListType = {
    id: number,
    user_name: string, 
    email: string
}

export type UserListProps = { 
  usersData: UsersListType[]
}