import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducers';
const middleware = [ thunk ]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
  middleware.push(promiseMiddleware);
  middleware.push(localStorageMiddleware)
}

const initialState = {
  input: {
    family_deductible: 3000,
    amount_fam_met: 380,
    individual_deductible: 1500,
    amount_ind_met: 33,
    oop_max_family: 3000,
    amount_fam_opm_met: 50,
    oop_max_individual: 1500,
    amount_ind_opm_met: 30,
    does_deductible_aply_to_oop: true,
    does_copay_apply_to_oop: true,
    coverage: 90,
    co_pay_amount: 20,
    co_pay_per_day_or_session: 0,
    max_visits: 52,
    type_of_max: 'Soft',
    insurance_provider: 'BCBS',
    data: [
      {
        services: "Physical",
        'requesting' : false,
        'visit_limit_applies': false,
        'session_per_week': 0,
        'length_of_session': 1,
        'week': 0
      },
      {
        services: "Speech",
        'requesting' : false,
        'visit_limit_applies': false,
        'session_per_week': 0,
        'length_of_session': 1,
        'week': 0
      },
      {
        services: "ABA",
        'requesting' : false,
        'visit_limit_applies': false,
        'session_per_week': 0,
        'length_of_session': 4,
        'week': 0
      },
      {
        services: "Feeding",
        'requesting' : true,
        'visit_limit_applies': true,
        'session_per_week': 1,
        'length_of_session': 1,
        'week': 145
      },
      {
        services: "Occupation",
        'requesting' : false,
        'visit_limit_applies': false,
        'session_per_week': 0,
        'length_of_session': 1,
        'week': 0
      }
    ],
    days_per_week: 1,
    anticipated_first_date_of_therapy: '',
    last_day_of_calendar_year: '',
    assumed_cancel_rate: 15
  },
  service: [
  ]
}

const store = createStore(reducer, initialState,  applyMiddleware(...middleware))

ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
