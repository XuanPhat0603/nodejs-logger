import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import actorRoute from './routes/actor.route'
import path from 'path'
const swaggerJson = require('./lib/swagger.json')

dotenv.config()

const app = express()
app.use(cors())
// app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (_, res) => {
  // render .html file
  res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})
app.use('/actors', actorRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson))

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`)
})