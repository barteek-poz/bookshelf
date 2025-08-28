import app from "./app"
import dotenv from 'dotenv'
import fs from 'fs'
import http from 'http'
import mysql from 'mysql2'
import type { Pool } from "mysql2/promise"

// const options = { 
//     key: fs.readFileSync('./cert/localhost-key.pem'),
//     cert: fs.readFileSync('./cert/localhost.pem')
// }

dotenv.config({path:'.env'})

export const pool:Pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 8000,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: {
        rejectUnauthorized: true
    }
}).promise()



if(!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
    throw new Error('Missing database credentials in enviromental variables')
}
const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD)

const port = process.env.PORT
const server = http.createServer(app);
app.listen(port, () => console.log(`Server running on port ${port}`));



