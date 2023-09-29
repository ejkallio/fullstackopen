import Person from './Person'

const Persons = ({ namesToShow, deleteName }) => (
    <div>  
      {namesToShow.map(person =>
        <Person key={person.id} name={person.name} number={person.number} deleteName={() => deleteName(person.id)} />
      )}
    </div>
)

export default Persons