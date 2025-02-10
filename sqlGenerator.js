export function generateInsertStatement(tableName, payload){
    //Dynamically build portions of our insert statement
        // console.log(req.body)

        const columns = []
        const values = []

        for(const property in payload){
            // console.log(`${property}: ${req.body[property]}`)
            columns.push(property)
            values.push(payload[property])
        }

        // const placeHolders = []
        // columns.forEach(() => {
        //     placeHolders.push('?')
        // })
        // const placeHolders = columns.map(() => '?')

        const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES(${Array(columns.length).fill('?').join(', ')});`

        return {
            sql,
            values
        }
}

export function generateUpdateStatement(tableName, payload, primaryKeyColumn, primaryKeyValue){
    const columns = []
    const values = []

    for(const property in payload){
        // console.log(`${property}: ${req.body[property]}`)
        columns.push(`${property} = ?`)
        values.push(payload[property])
    }

    // const columnsModified = columns.map(column => {
    //     return `${column} = ?`
    // })

    const sql = `UPDATE ${tableName} SET ${columns.join(', ')} WHERE ${primaryKeyColumn} = ${primaryKeyValue}`;


    return {
        sql,
        values
    }
}