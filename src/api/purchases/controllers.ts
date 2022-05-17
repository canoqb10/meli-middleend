import { Request, Response, NextFunction, Router } from 'express'
import { plainToClass } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import { getAll, createOne, getOneById, getOneByItemId, updateOne } from './services'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PlatformError, BadRequestError } from '../../utils'

import { PurchaseDTO } from './dtos'

/**
 * @description Purchases controller Class 
 */
class PurchasesController {
  public path = '/api/purchases'
  public router = Router()

  constructor() {
    this.intializeRoutes()
  }

/**
 * @description Definition fo endpoints
 */
  public intializeRoutes() {
    this.router.get(this.path, this.getPurchases)

    this.router.post(`${this.path}`, this.createPurchase)

    this.router.get(`${this.path}/:id`, this.getPurchaseById)
  }

  /**
   * @description Gets all purchases for an user
   * @param _req 
   * @param res 
   * @param next 
   * @returns PurchaseResults
   */
  getPurchases = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await getAll(res)
      console.log('purchases found...')
      res.status(200).send(results)
    } catch (error: PlatformError | unknown) {
      console.log('error', error)
      return next(error)
    }
  }

  /**
   * @description Get a purchase by id 
   * @param req 
   * @param res 
   * @param next 
   * @returns PurchaseResult
   */
  getPurchaseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.id) {
        throw new BadRequestError('param ID is required')
      }

      if (isNaN(+req.params.id)) {
        throw new BadRequestError('param ID is required')
      }

      const id = +req.params.id
      const results = await getOneById(id, res)
      console.log('purchase found...')
      res.status(200).send(results)
    } catch (error: PlatformError | unknown) {
      console.log('error', error)
      return next(error)
    }
  }

  /**
   * @description Creates a purchase of an item
   * @param req 
   * @param res 
   * @param next 
   * @returns JSON { id: number }
   */
  createPurchase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('validating purchase')
      const body = req.body
      const purchaseDTO = plainToClass(PurchaseDTO, body)
      await validateOrReject(purchaseDTO, {
        validationError: { target: false, value: false },
        forbidUnknownValues: false,
        stopAtFirstError: true,
      }).catch((e: unknown) => {
        throw new BadRequestError('some attributes of purchase does not valid', 'error')
      })
      console.log('creating purchase...')
      let result
      const _purchase = await getOneByItemId(body.item.id)
      console.log('_purchase', _purchase)
      if (_purchase) {
        result = await updateOne(_purchase.purchaseId, body, res)
      } else {
        result = await createOne(body, res)
      }
      res.status(201).send(result)
    } catch (error: PlatformError | unknown) {
      console.log('error', error)
      return next(error)
    }
  }
}

export default PurchasesController
