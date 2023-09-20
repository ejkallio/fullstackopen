import { useState } from 'react'

const Button = (props) => {
  console.log(props)
  const { handleClick, text } = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Average = allClicks => {
  console.log(allClicks)
  let sum = 0;

  allClicks.forEach( i => {
    sum += i;
  })
  
  return sum / allClicks.length
}

const Positive = allClicks => {
  let sum = 0;

  allClicks.forEach( i => {
    if (i == 1) sum += 1
  })

  return sum / allClicks.length
}

const Statistics = (props) => {
    if (props.all == 0) return (<div>No feedback given</div>)
    const average = Average(props.allClicks)
    const positive = Positive(props.allClicks)
    const all = props.allClicks.length

    return (
    <table>
      <StatisticsLine text="good" value={props.good} />
      <StatisticsLine text="neutral" value={props.neutral} />
      <StatisticsLine text="bad" value={props.bad} />
      <StatisticsLine text="all" value={all} />
      <StatisticsLine text="average" value={average} />
      <StatisticsLine text="positive" value={positive} />
    </table>
    )
}

const StatisticsLine = (props) => (
  <tbody>
    <tr>
      <td>{props.text}</td><td>{props.value}</td>
    </tr>
  </tbody>
)


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAllClicks] = useState([])

  const handleGood = () => {
    setAllClicks(allClicks.concat(1))
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutral = () => {
    setAllClicks(allClicks.concat(0))
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBad = () => {
    setAllClicks(allClicks.concat(-1))
    const updatedBad = bad + 1
    setBad(updatedBad)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} allClicks={allClicks} />
    </div>
  )
}

export default App
