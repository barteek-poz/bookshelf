import { pool } from "../server.js";


export const getGenresModel = async() => {
    const [genres] = await pool.query('SELECT * FROM genres')
    return genres
}