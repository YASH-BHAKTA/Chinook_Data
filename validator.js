import Joi from 'joi'

const employeeFields = {
    LastName: Joi.string().max(20),
    FirstName: Joi.string().max(20),
    Title: Joi.string().max(30),
    Email: Joi.string().email(),
    HireDate: Joi.date(),
    BirthDate: Joi.date(),
    City: Joi.string().max(30),
    PostalCode: Joi.string().pattern(new RegExp(/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/)) //Canadian postal code 
}

const employeePostSchema = Joi.object(
    {
        ...employeeFields,
        LastName: Joi.string().max(20).required(),
        FirstName: Joi.string().max(20).required()
    }
)

const employeePatchSchema = Joi.object({
    ...employeeFields
})

export const validateEmployeePost = payload => {
    return employeePostSchema.validate(payload)
}

export const validateEmployeePatch = payload => {
    return employeePatchSchema.validate(payload)
}

//changes made