import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Error from './components/Error'
import personService from './services/persons'
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null) 

  useEffect(() => {
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

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
            changeMessage(`Changed number of ${newName} to ${newNumber}`)
            return
          })
          .catch(error => {
            changeErrorMessage(
              `Information of ${newName} has already been removed from server`
            )
            setPersons(persons.filter(person => person.id !== id ))
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
        changeMessage(`Added ${returnedPerson.name} to phonebook`)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        changeErrorMessage(
          Object.values(error.response.data) + '.'
        )
        console.log(error.response.data)
      })
  }

  const deleteName = id => {
    const name = persons.find(person => person.id === id).name
    if (window.confirm(`Delete ${name} ?`)) { 
      personService
        .remove(id)
        .then(() => {
          changeMessage(`Deleted ${name}`)
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${name} has already been removed from server`
          )
          setPersons(persons.filter(person => person.id !== id ))
        })
    }
  }

  const changeMessage = newMessage => {
    setMessage(newMessage)
    setTimeout(() => {
      setMessage(null)
    }, 4000)
  }

  const changeErrorMessage = newMessage => {
    setErrorMessage(newMessage)
    setTimeout(() => {
      setErrorMessage(null)
    }, 4000)
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
      <Notification message={message} />
      <Error message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new person</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons namesToShow={namesToShow} deleteName={deleteName} />
    </div>
  )
}

export default App