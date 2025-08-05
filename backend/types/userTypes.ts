import { RowDataPacket } from "mysql2"


export type UserBackendDataType = {
    id: number,
    user_name:string,
    name: string,
    email:string,
    password:string,
    refreshToken:string | null,
    is_admin: boolean
}

export interface UserBooks extends RowDataPacket {
    user_id:number, 
    book_id:number
}