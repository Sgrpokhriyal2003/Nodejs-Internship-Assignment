import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

//create mysql connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0  
})

//convert pool to use promise
export const promisePool = pool.promise()

//test db connection
export const testConnection = async() => {
    try{
        const [rows] = await promisePool.query('SELECT 1')
        console.log(`database connected successfully!`)
        return true
    }
    catch(error){
        console.log(`error while db connection, ${error.message}`)
    }
}

export const createSchoolTable = async() => {
    try{
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS schools(
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                address VARCHAR(255) NOT NULL,
                latitude DOUBLE NOT NULL,
                longitude DOUBLE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) 
        `
        
        await promisePool.query(createTableQuery)
        console.log(`school table created successfully!`)

    }
    catch(error){
        console.error(`error while creating school table ${error.message}`)
    }
}