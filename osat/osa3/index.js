require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', req => {
     return JSON.stringify(req.body)
})
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :body'))
app.use(morgan('tiny'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-523523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    },
]
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(note => note.id !== id)

    res.status(204).end()
})



app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    if (persons.filter(person => person.name === body.name).length > 0) {
        return res.status(409).json({
            error: 'name must be unique' 
        })
    }

    const person =  new Person ({
        name: body.name,
        number: body.number,
        /* id: Math.floor(Math.random() * (100 - 1) + 1) */
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    /* persons = persons.concat(person)
    res.json(person) */
    console.log(morgan.token('type', function (req, res) {return stringify(req)}))
})

app.get('/api/info', (req, res) => {
    const n = persons.length
    const date = new Date()
    console.log(n)
    res.send(`<div>
        Phonebook has info for ${n} people </br>
        ${date}
    </div>`)
})
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})