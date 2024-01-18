const log = (action, message, ...optionalParams) => {
  if (process.env.NODE_ENV === 'development') {
    console[action](message, ...optionalParams)
  }
}

const debug = (message, ...optionalParams) => log('log', message, ...optionalParams)
const warn = (message, ...optionalParams) => log('warn', message, ...optionalParams)
const error = (message, ...optionalParams) => log('error', message, ...optionalParams)

export { debug, warn, error }
