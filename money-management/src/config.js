export const API_ROOT = (process.env.NODE_ENV === 'production') ? 'http://ec2-18-191-1-125.us-east-2.compute.amazonaws.com' : 'http://localhost:8000'

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
