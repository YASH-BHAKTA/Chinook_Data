import express from 'express'
import Database from 'better-sqlite3'
import multer from 'multer'
import employeesRouter from './routes/employees.js'

const app = express()

//Configure how multer behaves
const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, callback) {
        const newName = `upload_${file.originalname}`
        callback(null, newName);
    }
})

const upload = multer({ storage: storage })

//Establish a connection to our database
export const db = new Database('./database/chinook.sqlite', { fileMustExist: true })
// app.set('db', db);

//Middleware
app.use(express.json()) //Capture any payload in json format and assign to req.body
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })) //Capture any payload in x-www-form-urlencoded and assign to req.body
app.use('/employees', employeesRouter) //Send all employees requests to the employees router

//Endpoint!!!
app.get('/', (req, res) => {
    res.send(`Hello from Chinook ICA`)
})


app.post('/', (req, res) => {
    // console.log(req.body);
    res.send(`Payload: ${JSON.stringify(req.body)}`);
})

app.post('/api/employees/upload', upload.single('image'), (req, res) => {
    // console.log(req)
    res.json({ message: 'Done' })
})

//app.put => Replace the entire record's data with a new record
//app.patch => Modifying pieces of our record

//Listening on port 3000
app.listen(3000, () => {
    console.log(`Listening on port 3000`)
})

//some changes made for testing