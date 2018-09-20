export const API_ROOT = (process.env.NODE_ENV === 'production') ? 'https://api.gullin.io' : 'http://localhost:8000'

export const VeeValidateConfig = {
  errorBagName: 'errors',
  fieldsBagName: 'fields',
  locale: 'en',
  dictionary: null,
  strict: true,
  delay: 700,
  classes: true,
  classNames: {
    valid: 'form-control-success', // model is valid
    invalid: 'form-control-danger', // model is invalid
  },
  events: 'input|blur',
  inject: true,
  validity: true,
  aria: true,
}
