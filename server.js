import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
dotenv.config()

import { testConnection, createSchoolTable } from './db/db.js'
import schoolRoute from './routes/school.route.js'

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(morgan('dev'))

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "school api is running on port http://localhost:3000",
        endpoints: {
            addschool: "/api/add",
            listschool: "/api/list"
        }
    })
})

app.use('/api/school', schoolRoute);

const startServer = async() => {
    try{
        const isConnected = await testConnection()
        if(!isConnected){
            console.error(`cannot start server without db connection`)
            process.exit(1)
        }

        await createSchoolTable()
        app.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`)
        })
    }
    catch(error){
        console.error(`failed to start server: ${error.message}`)
        process.exit(1)
    }
}

startServer()
