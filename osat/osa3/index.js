require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')


morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :body'))
app.use(morgan('tiny'))

/* let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-523523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
] */

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findOneAndUpdate(
    { name: req.body.name },
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    const date = new Date()
    console.log(count)
    res.send(`<div>
            Phonebook has info for ${count} people <br>
            ${date}
        </div>`)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id ' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: 'malformatted data' })
  }

  next(error)
}

app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})