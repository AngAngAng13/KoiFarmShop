import express from 'express'
import { config } from 'dotenv'
import usersRouter from './routes/users.routes.js'
import databaseService from './services/database.service.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import managerRouter from './routes/manager.routes.js'

config()
const app = express()
app.use(cors(
  {
    origin: 'http://localhost:3000'
  }
))
const PORT = process.env.PORT || 4000
app.use(express.json())
databaseService.connect().then(() => {
  databaseService.indexUsers()
})

app.get('/', (req, res) => {
  res.send('hello world nguyen')
})
app.use('/users', usersRouter)

app.use('/manager', managerRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Project này đang chạy trên port ${PORT}`)
})
