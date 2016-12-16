import { combineReducers } from 'redux'

// EXAMPLE REDUCER
const NOOP = 'NOOP'
const initialState = {}
function exampleReducer (state=initialState, action) {
  const { payload } = action

  switch (action.type) {
    case NOOP:
      return state

    default:
      return state
  }
}
// END EXAMPLE REDUCER

const combinedReducers = combineReducers({
  exampleReducer
})

function rootReducer (state, action) {
  // Do any custom reducing that won't fit neatly
  // into a sub-reducer.
  if (action.type === 'SET_STREAM_STATE') {
    return { ...state, state$: action.payload.state }
  }
  return combinedReducers(state, action)
}

export default rootReducer
