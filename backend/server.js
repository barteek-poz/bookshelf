import app from "./app.js"
import dotenv from 'dotenv'
import mongoose from "mongoose"
import fs from 'fs'
import http from 'http'

const options = { 
    key: fs.readFileSync('./cert/localhost-key.pem'),
    cert: fs.readFileSync('./cert/localhost.pem')
}

dotenv.config({path:'.env'})

const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {useNewUrlParser: true})
    .then(() => {console.log('DB connection successful')})

const port = process.env.PORT
const server = http.createServer(app);
app.listen(port, () => console.log(`Server running on port ${port}`));
// https.createServer(options, app).listen(port, () => {
//     console.log(`Server running on port ${port}`);
// })


