import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import reducer from './reducers';
import * as moment from 'moment';
const middleware = [ thunk ]

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
  middleware.push(promiseMiddleware);
  middleware.push(localStorageMiddleware)
}

const initialState = {
  input: {
    family_deductible: 5000,
    amount_fam_met: 1800,
    individual_deductible: 1000,
    amount_ind_met: 200,
    oop_max_family: 6000,
    amount_fam_opm_met: 2000,
    oop_max_individual: 1500,
    amount_ind_opm_met: 500,
    does_deductible_aply_to_oop: 'Yes',
    does_copay_apply_to_oop: 'Yes',
    coverage: 90,
    co_pay_amount: 0,
    co_pay_per_day_or_session: 'Per Session',
    max_visits: 52,
    type_of_max: 'Hard',
    insurance_provider: 'BCBS',
    data: [
    ],
    days_per_week: 1,
    anticipated_first_date_of_therapy: moment(),
    last_day_of_calendar_year: moment().endOf('year'),
    assumed_cancel_rate: 15,
    secondary_family_deductible: 3000,
    secondary_amount_fam_met: 400,
    secondary_individual_deductible: 1000,
    secondary_amount_ind_met: 600,
    secondary_oop_max_family: 6500,
    secondary_amount_fam_opm_met: 2500,
    secondary_oop_max_individual: 2000,
    secondary_amount_ind_opm_met: 600,
    secondary_does_deductible_aply_to_oop: true,
    secondary_does_copay_apply_to_oop: true,
    secondary_coverage: 80,
    secondary_co_pay_amount: 0,
    secondary_co_pay_per_day_or_session: 1,
    secondary_max_visits: 52,
    secondary_type_of_max: 'Hard',
    secondary_insurance_provider: 'BCBS'
  },
  service: [
  ],
  tab: 2
}

const store = createStore(reducer, initialState,  applyMiddleware(...middleware))

ReactDOM.render(<Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
