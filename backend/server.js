import app from "./app.js"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import fs from 'fs'
import http from 'http'
import mysql from 'mysql2'

const options = { 
    key: fs.readFileSync('./cert/localhost-key.pem'),
    cert: fs.readFileSync('./cert/localhost.pem')
}

dotenv.config({path:'.env'})

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {useNewUrlParser: true})
    .then(() => {console.log('DB connection successful')})

const port = process.env.PORT
const server = http.createServer(app);
app.listen(port, () => console.log(`Server running on port ${port}`));
// https.createServer(options, app).listen(port, () => {
//     console.log(`Server running on port ${port}`);
// })


