const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Require dotenv
require('dotenv').config()

// Initialize App
const app = express()

// Parse incoming JSON requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Use Cors
app.use(cors())

// Use Static Files
app.use('/uploads', express.static('uploads'))
app.use('/uploads/images', express.static('uploads/images'))

// Routes
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')

// Use Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Listen Port
const port = process.env.PORT || 3000
const env = process.env.ENV || 'development'
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
  console.log(`App listening on env ${env}`)
  console.log(`Press Ctrl+C to quit.`)
})