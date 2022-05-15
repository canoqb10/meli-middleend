import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError } from '../utils/errors'
import { author } from '../../package.json'

const TOKEN = `Bearer ${author.name} ${author.lastname}`

/**
 * @description Checks if the token received is an valid token for interacting with the api
 * @param req 
 * @param res 
 * @param next 
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if (
    (req &&
      req.headers &&
      req.headers['authorization'] &&
      req.headers['authorization'] !== TOKEN) ||
    (req && req.headers && !req.headers['authorization'])
  ) {
    throw new UnauthorizedError()
  }

  res.locals.user = getUserToken(req)
  next()
}

/**
 * @description Retrieves a user token from the request headers
 * @param req 
 * @returns object { name: string, lastname: string }
 */
const getUserToken = (req: Request) => {
  const token = req.headers['authorization']
  const tokenSplit = token?.split(' ')
  const name = `${tokenSplit?.[1]} ${tokenSplit?.[2]}`
  const lastname = `${tokenSplit?.[3]} ${tokenSplit?.[4]}`
  return { name, lastname }
}

export default verifyToken
