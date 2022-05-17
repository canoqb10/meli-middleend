import { Request, Response } from 'express'
import { ValidationError } from 'class-validator'
import { QueryFailedError } from 'typeorm'
import { PlatformError } from '../utils/errors'
import { plataformNamespace } from '../utils/constants'
/**
 * @description Implements of Problem Details (RFC 7807)
 */
export interface ProblemDetails {
  type: string
  title: string
  detail: string
  instance: string
  status: number
  stack?: unknown
}
/**
 * @description Error handler for the app
 * @param err: PlatformError
 * @param req Request
 * @param res Response
 * @returns void
 */
export const errorHandler = (err: PlatformError, req: Request, res: Response) => {
  let body: ProblemDetails

  /**
   * Checks QueryFailed Error
   */
  if (err instanceof QueryFailedError) {
    body = {
      status: 500,
      type: `${plataformNamespace}/errors/db-error`,
      title: 'db-error',
      detail: err.message || 'query error',
      instance: req.url,
      stack: err?.stack,
    }

    return res.status(500).send(body)
  }

  /**
   * Checks Validation Error
   */
  if (err instanceof Array && err[0] instanceof ValidationError) {
    const messageArr: Array<string> = []
    let e: ValidationError
    for (e of err) {
      if (e.constraints) {
        Object.values(e.constraints).forEach((value: unknown): void => {
          messageArr.push(<string>value)
        })
      }
    }

    body = {
      status: 500,
      type: `${plataformNamespace}/errors/db-validation-error`,
      title: 'db-validation-error',
      detail: messageArr.join(','),
      instance: req.url,
      stack: req.url,
    }

    return res.status(500).send(body)
  }

  
  // Checks PlatformError
  const error = err as PlatformError
  if (error.statusCode && typeof error.statusCode === 'number') {
    body = {
      status: error.statusCode,
      type: `${plataformNamespace}/errors/${error.errorCode}`,
      title: error.errorCode?.replace(/-/g, ' '),
      detail: error?.message || error.reason || 'Platform error',
      instance: req.url,
      stack: error?.stack,
    }

    return res.status(error.statusCode).send(body)
    // return res.status(error.statusCode).json(body).end()
  }

  const _error = err as Error
  body = {
    status: 500,
    type: `${plataformNamespace}/errors/internal-server-error`,
    title: 'internal-server-error',
    detail: _error?.message || 'error',
    instance: req.url,
    stack: _error?.stack,
  }

  return res.status(500).send(body)
}
