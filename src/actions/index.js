export const CALCULATION_RESULT = 'CALCULATION_RESULT'
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const LOGIN_PAGE_UNLOADED = 'LOGIN_PAGE_UNLOADED';
export const REGISTER_PAGE_UNLOADED = 'REGISTER_PAGE_UNLOADED';
export const ASYNC_START = 'ASYNC_START';
export const ASYNC_END = 'ASYNC_END';
export const EDITOR_PAGE_LOADED = 'EDITOR_PAGE_LOADED';
export const EDITOR_PAGE_UNLOADED = 'EDITOR_PAGE_UNLOADED';
export const UPDATE_FIELD_AUTH = 'UPDATE_FIELD_AUTH';
export const APP_LOAD='APP_LOAD';
export const SERVICE_RESULT='SERVICE_RESULT';
export const SERVICE_REGISTER='SERVICE_REGISTER';

export const setCalculationResult = calculation => ({
  type: CALCULATION_RESULT,
  calculation
})

export const setServiceResult = service => ({
  type: SERVICE_RESULT,
  service
})
