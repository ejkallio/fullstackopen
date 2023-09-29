const Person = (props) => {
    return (
      <div>
        {props.name} {props.number}
        <button onClick={props.deleteName}>delete</button>
      </div>
    )
  }

export default Person