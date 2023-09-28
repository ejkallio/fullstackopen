import Person from './Person'

const Persons = ({ namesToShow }) => (
    <div>  
      {namesToShow.map(person =>
        <Person key={person.id} name={person.name} number={person.number} />
      )}
    </div>
)

export default Persons