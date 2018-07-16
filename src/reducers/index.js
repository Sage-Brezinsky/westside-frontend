import { combineReducers } from 'redux'
import {
  CALCULATION_RESULT, SERVICE_RESULT
} from '../actions'
import auth from './auth';
const input = (state = 'reactjs', action) => {
  switch (action.type) {

    default:
      return state
  }
}

const calculation = (state = 'reactjs', action) => {
  switch (action.type) {
    case CALCULATION_RESULT:
      return action.calculation;
    default:
      return state
  }
}

const service = (state = '', action) => {
  switch (action.type) {
    case SERVICE_RESULT:
      return action.payload;
    default:
      return state
  }
}

const rootReducer = combineReducers({
  input,
  calculation,
  auth,
  service
})

export default rootReducer
