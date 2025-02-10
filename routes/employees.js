import express from 'express'
import { db } from '../app.js'
import { validateEmployeePatch, validateEmployeePost } from '../validator.js'
import { generateInsertStatement, generateUpdateStatement } from '../sqlGenerator.js'

const router = express.Router() //Creates a router that express can route request to

//Endpoints for all employee data
router.get('/', (req, res) => {
    try {
        const statement = db.prepare('SELECT * FROM employees');
        const data = statement.all()
        // console.log(data)
        res.send(data)
    }
    catch {
        //Log the error somewhere
        //Notify that an error occured

        res.status(500).send({ message: "Try again later" })
    }

})

//Endpoint for specific employee data
router.get('/:id', (req, res) => {
    try {
        const statement = db.prepare('SELECT * FROM employees WHERE EmployeeId = ?')
        const specificData = statement.get(req.params.id)
        if (!specificData) {
            res.status(404).send()
        }
        res.send(specificData)
    }
    catch {
        //Log the error somewhere
        //Notify that an error occured

        res.status(500).send({ message: "Try again later" })
    }

})


router.post('/', (req, res) => {
    //INSERT INTO employee(LastName, FirstName) VALUES('Arora', 'Aman')
    try {
        //Validate our incoming data
        const validationResult = validateEmployeePost(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }

        //Build the dynamic parts of our sql query
        const { sql, values } = generateInsertStatement('employees', req.body)

        //Validation passed , continue with saving to the database
        const statement = db.prepare(sql);
        const result = statement.run(values)
        res.status(201).send(result) //Temporary
    } catch (err) {

        //Log the error somewhere
        //Notify that an error occured

        res.status(500).send({ message: "Try again later" })
    }

})

router.patch('/:id', (req, res) => {
    // 'UPDATE employees SET column = value, column = value, column = value WHERE EmployeeId = [some_id];'

    try {
        const validationResult = validateEmployeePatch(req.body)
        if (validationResult.error) {
            return res.status(422).send(validationResult.error)
        }
        const { sql, values } = generateUpdateStatement('employees', req.body, 'EmployeeId', req.params.id)

        const statement = db.prepare(sql);
        const { changes } = statement.run(values)
        if (!changes) {
            res.status(404).send()
        } else {
            res.status(204).send()
        }
    } catch (err) {
        //Log the error
        res.status(500).send({ message: "Try again later" })
    }


})

//Endpoint to delete specific employee
router.delete('/:id', (req, res) => {
    // 'DELETE FROM [table_name] WHERE EmployeeId = ?'
    const statement = db.prepare('DELETE FROM employees WHERE EmployeeId = ?;');
    const { changes } = statement.run([req.params.id]);

    // if(changes === 0)
    if (!changes) {
        res.status(404).send()
    } else {
        res.status(204).send()
    }

})


export default router
