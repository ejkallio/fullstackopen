import { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
 
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1231244' },
    { name: 'Mikki Hiiri', number: '123-9780009' },
    { name: 'Aku Ankka', number: '869-7857683' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  persons.forEach(value => {
    console.log(value)
  })

  const addName = (event) => {
    event.preventDefault()

    if (persons.filter(person => person.name == newName).length > 0) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber
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