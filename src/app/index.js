import React from 'react'
import ReactDOM from 'react-dom'
import Rx from 'rxjs'

import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

import App from './components/App'

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const initialState = {
  counter: 1
}

const render = (state=initialState) => {
  console.log('rendering app with state = ', state)
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App {...state} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}


export const actions = {
  INC_COUNTER_TIMER: [
    () => ({ type: 'INC_COUNTER_TIMER' }),
    (state, payload) => {
      return { ...state, counter: state.counter + 1 }
    }
  ],

  NOOP: [
    () => ({ type: 'NOOP' }),
    (state, payload) => state
  ]
}

const reducer = (state, action) => {
  const { type, payload } = action
  if (!actions[type]) {
    return state
  }
  return actions[type][1](state, payload)
}

function mirrorKeys (obj) {
  return Object.keys(obj).reduce((accum, key) => {
    accum[key] = key
    return accum
  }, {})
}
export const actionKeys = mirrorKeys(actions)


function getAction (key) {
  if (!actions[key]) {
    throw new Error(`Attempting to get an action that does not exist (${key}).`)
  }
  return actions[key][0]
}

const tickFn = () => rootSubject.next(getAction(actionKeys.INC_COUNTER_TIMER)())

const rootSubject = new Rx.Subject()

const subscriber = {
  next: (state) => {
    store.dispatch({ type: 'SET_STREAM_STATE', payload: { state } })
    render(state)
  }
}

rootSubject
  .startWith(initialState)
  .scan(reducer)
  .subscribe(subscriber)

setInterval(tickFn, 1000)

render(initialState)

if (module.hot) {
  module.hot.accept('./components/App', render)
  rootSubject.next(getAction(actionKeys.NOOP)())
}
