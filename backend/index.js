const connectToMongo = require('./db')
const express = require('express')
const cors = require('cors')

connectToMongo()
const app = express()
const port = 5000

// it is a middleware which is require to fetch dat from request body
app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))


app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})

