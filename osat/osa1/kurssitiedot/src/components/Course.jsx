const Header = (props) => {
    console.log(props)
    return <h2>{props.course}</h2>
  }
  
  
  const Part = (props) => {
    console.log(props)
    return (
      <p>{props.part} {props.exercises} </p>
    )
  }
  
  const Content = ({parts}) => {
    console.log(parts)
    return (
      <div>
        {parts.map(part =>
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        )} 
      </div>
    )
  }
  
  const Course = (props) => {
    return (
      <div>
        <Header course={props.name} />
        <Content parts={props.parts} />
        <Total parts={props.parts} />
      </div>
    )
  }
  
  const Total = ({parts}) => {
    console.log(parts)
  
    const sum = parts.reduce((t, n) => {
      console.log('Arvot:', t, n)
      if (Number.isInteger(t) == false) return t.exercises + n.exercises
      return t + n.exercises
    })
    
    console.log(sum)
  
    return <div><b>Number of exercises {sum}</b></div>
  }

  export default Course