import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  useEffect(hook, [])
  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()

    if (persons.filter(person => person.name == newName).length > 0) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length+1
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
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
      <Persons namesToShow={namesToShow} />
    </div>
  )
}

export default App