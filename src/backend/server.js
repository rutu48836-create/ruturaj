import express from 'express'
import cors from 'cors'
import dbRouter from './routes/db.js'
import llmRouter from './routes/llm.js'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 5000

app.use('/llm', llmRouter);
app.use('/db', dbRouter);

app.listen(PORT, () => {
  console.log('port is running on', PORT)
})