import React from 'react'

// const JSONInspector = ({children}) => <pre>{JSON.stringify(children, null, 4)}</pre>

const App = (props) => {
  const { counter } = props

  return (
    <div className="app">
      <h1>Change to see hot reloading of rxjs stream state {counter}</h1>
    </div>
  )
}

export default App
