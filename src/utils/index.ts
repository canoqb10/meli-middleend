export * from './constants'
export * from './http'
export * from './errors'

/**
 * @description checks it an array is valid
 * @param value unknown
 * @returns boolean
 */
export const isValidArray = (value: Array<unknown>) => {
  if (Array.isArray(value) && value.length > 0) {
    return true
  }
  return false
}
