import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  })

  const addName = (event) => {
    event.preventDefault()

    if (persons.filter(person => person.name == newName).length > 0) {
      if (window.confirm(`${newName} is already added to your phonebook, replace the old number with a new one?`)) {
        const id = persons.find(person => person.name === newName).id

        const nameObject = {
          name: newName,
          number: newNumber
        }

        personService
          .update(id, nameObject)
          .then(() => {
            return
        })
      }
      setNewName('')
      setNewNumber('')
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deleteName = id => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      personService
        .remove(id)
    }
  }

  const handleNameChange = (event => {
    console.log(event.target.value)
    setNewName(event.target.value)
  })

  const handleNumberChange = (event => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  })

  const handleFilterChange = (event => {
    console.log(event.target.value)
    setFilter(event.target.value)
  })

  const namesToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new person</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons namesToShow={namesToShow} deleteName={deleteName} />
    </div>
  )
}

export default App