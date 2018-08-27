import { combineReducers } from 'redux'
import {
  CALCULATION_RESULT, SERVICE_RESULT, INPUT_RESULT
} from '../actions'
import auth from './auth';

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
      return action.service;
    default:
      return state
  }
}

const input = (state = '', action) => {
  switch (action.type) {
    case INPUT_RESULT:
      return action.input;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  input,
  calculation,
  auth,
  service
})

export default rootReducer
