const connectToMongo = require('./db')
const express = require('express')

connectToMongo()
const app = express()
const port = 5000

// it is a middleware which is require to fetch dat from request body
app.use(express.json())

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

