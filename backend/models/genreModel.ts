import { RowDataPacket } from "mysql2";
import { pool } from "../server.js";
import { BookGenreType } from "../types/bookTypes.js";


export const getGenresModel = async():Promise<BookGenreType[]> => {
    const [genres] = await pool.query<BookGenreType[] & RowDataPacket[]>('SELECT * FROM genres')
    return genres
}