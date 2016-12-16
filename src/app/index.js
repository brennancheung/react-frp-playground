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

let globalSubjectState // eslint-disable-line

const render = (state=initialState) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App {...state} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}


// additionalReducers allow you to specify additional reduce operations
const additionalReducers = {
  INC_COUNTER_TIMER: [
    (state, payload) => {
      // do additional stuff for INC_COUNTER_TIMER
      return { ...state, additional: 'here I am' }
    }
  ],
  FROM_THUNK: [
    (state, payload) => {
      return { ...state, from_thunk: 'success' }
    }
  ]
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
    (state, payload) => ({ ...state })
  ]
}

const reducer = (state, action) => {
  if (typeof action === 'function') {
    action(rootSubject.next.bind(rootSubject), _getState)
    return { ...state }
  }

  const { type, payload } = action

  let reducers = []
  if (actions[type]) {
    reducers.push(actions[type][1])
  }

  const additional = additionalReducers[type] || []

  return reducers.concat(additional).reduce((_state, _reducer) => _reducer(_state, payload), state)
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
  const action = actions[key][0]
  return action
}

function asyncAction (dispatch, getState) {
  function doSomething () {
    console.log('state from asyncAction = ', getState())
    dispatch({ type: 'FROM_THUNK' })
  }
  setTimeout(doSomething, 5000)
}

const tickFn = () => rootSubject.next(getAction(actionKeys.INC_COUNTER_TIMER)())
const asyncFn = () => rootSubject.next(asyncAction)

const rootSubject = new Rx.Subject()

const subscriber = {
  next: (state) => {
    store.dispatch({ type: 'SET_STREAM_STATE', payload: { state } })
    render(state)
  }
}

function setGlobalSubjectState (state) {
  globalSubjectState = state
}

function _getState () {
  return globalSubjectState
}

rootSubject
  .startWith(initialState)
  .scan(reducer)
  .do(setGlobalSubjectState)
  .subscribe(subscriber)

setInterval(tickFn, 1000)
setTimeout(asyncFn, 500)

render(initialState)

if (module.hot) {
  module.hot.accept('./components/App', render)
  rootSubject.next(getAction(actionKeys.NOOP)())
}
