export interface PlatformErrorType {
  statusCode: number
  errorCode: number
  message: string
  reason: string
  path: string
}
/**
 * @description Error Abstraction layer
 *
 * @export
 * @class PlatformError
 * @extends {Error}
 *
 * */
export class PlatformError extends Error {
  /**
   * @description Instantiates a object platform error type
   *
   * @param statusCode
   * @param errorCode
   * @param message
   * @param reason
   * @param path
   */
  constructor(
    readonly statusCode: number,
    readonly errorCode: string,
    message: string,
    readonly reason?: string | undefined,
  ) {
    super(message)
  }
}
/**
 * @description Bad request error class
 */
export class BadRequestError extends PlatformError {
  /**
   *
   * @param message
   * @param reason
   */
  constructor(message = 'Invalid request', readonly reason: string | undefined = '') {
    super(400, message, reason)
  }
}
/**
 * @description Item not found error class
 */
export class ItemNotFoundError extends PlatformError {
  /**
   *
   * @param message
   * @param reason
   */
  constructor(message = 'item not found', readonly reason?: string | undefined) {
    super(404, 'item-not-found', message)
  }
}

/**
 * @description Unauthorized error class
 */
export class UnauthorizedError extends PlatformError {
  /**
   *
   * @param message
   * @param reason
   */
  constructor(message = 'not authorized', readonly reason?: string | undefined) {
    super(401, 'unauthorized', message, reason)
  }
}

/**
 * @description Forbidden error class
 */
export class ForbiddenError extends PlatformError {
  /**
   *
   * @param message
   * @param reason
   */
  constructor(
    message = 'You are not allowed to perform this action',
    readonly reason?: string | undefined,
  ) {
    super(403, 'forbidden', message, reason)
  }
}

/**
 * @description Conflict error class
 */
export class ConflictError extends PlatformError {
  /**
   *
   * @param errorCode
   * @param message
   * @param reason
   */
  constructor(
    errorCode = 'conflict',
    message = 'the request does not fullfill the requirements',
    readonly reason?: string | undefined,
  ) {
    super(409, errorCode.replace(/ /g, '-').trim(), message, reason)
  }
}

/**
 * @description Internal server error class
 */
export class InternalServerError extends PlatformError {
  /**
   *
   * @param type
   * @param message
   * @param reason
   */
  constructor(
    type = 'internal-server-error',
    message = 'Oops, server error',
    readonly reason?: string | undefined,
  ) {
    super(500, type, message, reason)
  }
}
