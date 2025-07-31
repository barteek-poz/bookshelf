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