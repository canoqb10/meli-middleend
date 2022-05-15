import { Response } from 'express'
import { getEntityManager } from '../../db-config'
import { PurchaseModel, PurchaseDetailModel } from './models'
import { PurchaseResults, PurchaseResult, PurchaseDTO, PurchaseDetail } from './dtos'
import { getUserByNameAndLastName } from '../users/services'
import { InternalServerError, ItemNotFoundError } from '../../utils'

/**
 * @description Gets all purchases by user
 * @param res 
 * @returns PurchasesResult { author?: Author, purchases: Array<PurchaseModel> }
 */
export const getAll = async (res: Response) => {
  try {
    const userFromToken = res.locals.user
    const em = await getEntityManager()

    const results: PurchaseResults = {
      author: undefined,
      purchases: [],
    }

    const user = await getUserByNameAndLastName(userFromToken.name, userFromToken.lastname)

    const purchases: Array<PurchaseModel> = await em.find(PurchaseModel, {
      select: ['id', 'amount', 'total'],
      relations: ['details'],
      where: {
        userId: user?.id,
      },
    })

    if (user) {
      results.author = { name: user.name, lastname: user.lastname }
    }

    if (purchases) {
      results.purchases = purchases
    }
    return results
  } catch (e) {
    throw e
  }
}

/**
 * @description Creates a record with the purchase info received
 * @param data PurchaseDTO
 * @param res 
 * @returns Object { id: number }
 */
export const createOne = async (data: PurchaseDTO, res: Response) => {
  try {
    const userFromToken = res.locals.user
    const em = await getEntityManager()
    const user = await getUserByNameAndLastName(userFromToken.name, userFromToken.lastname)

    let purchaseId
    await em.transaction(async (ts) => {
      try {
        const purchase = await ts.insert(PurchaseModel, {
          amount: data.amount,
          total: parseFloat(data.item.price.amount.toString()),
          createdBy: user?.id,
          userId: user?.id,
          createdAt: new Date(),
        })

        purchaseId = purchase?.identifiers[0].id

        await ts.insert(PurchaseDetailModel, {
          itemId: data.item.id,
          condition: data.item.condition,
          description: data.item.description,
          free_shipping: data.item.free_shipping,
          picture: data.item.picture,
          price: data.item.price,
          sold_quantity: data.item.sold_quantity,
          title: data.item.title,
          purchaseId,
          createdBy: user?.id,
          createdAt: new Date(),
        })
      } catch (e) {
        console.log('error catch 1')
        throw new InternalServerError()
      }
    })

    return { id: purchaseId }
  } catch (e) {
    console.log('error catch 2')
    throw e
  }
}

/**
 * @description Update a record with the purchase info received
 * @param id number
 * @param body PurchaseDTO 
 * @param res 
 * @returns Object { id: number }
 */
export const updateOne = async (id: number, body: PurchaseDTO, res: Response) => {
  try {
    const userFromToken = res.locals.user
    const em = await getEntityManager()

    const purchaseRepo = await em.getRepository(PurchaseModel)
    const purchase = await purchaseRepo.findOne({
      where: { id },
    })

    if (purchase) {
      const user = await getUserByNameAndLastName(userFromToken.name, userFromToken.lastname)
      purchase.amount += body.amount
      purchase.total =
        parseFloat(purchase.total.toString()) + parseFloat(body.item.price.amount.toString())
      ;(purchase.updatedBy = user?.id), (purchase.updatedAt = new Date())
      await purchaseRepo.save(purchase)
    }

    return { id }
  } catch (e) {
    console.log('error catch 3')
    throw e
  }
}

/**
 * Get one purchase by id for an user
 * @param id number
 * @param res 
 * @returns PurchaseResult { author?: Author, purchase: PurchaseModel }
 */
export const getOneById = async (id: number, res: Response) => {
  try {
    const userFromToken = res.locals.user
    const em = await getEntityManager()

    const results: PurchaseResult = {
      author: undefined,
      purchase: null,
    }

    const user = await getUserByNameAndLastName(userFromToken.name, userFromToken.lastname)

    const purchase = await em.findOne(PurchaseModel, {
      select: ['id'],
      where: {
        id,
        userId: user?.id,
      },
    })
    console.log('purchase', purchase)
    if (!purchase) {
      throw new ItemNotFoundError(undefined, 'purchase does not found')
    }

    if (user) {
      results.author = { name: user.name, lastname: user.lastname }
    }

    const details: PurchaseDetail[] = await em.find(PurchaseDetailModel, {
      select: [
        'id',
        'itemId',
        'condition',
        'description',
        'picture',
        'free_shipping',
        'price',
        'sold_quantity',
        'title',
      ],
      where: {
        purchaseId: purchase.id,
      },
    })

    if (details) {
      purchase.details = details
    }
    if (purchase) {
      results.purchase = purchase
    }
    return results
  } catch (e) {
    throw e
  }
}

/**
 * @description Gets a purchase by item id
 * @param itemId 
 * @returns PurchaseDetailModel
 */
export const getOneByItemId = async (itemId: string) => {
  try {
    const em = await getEntityManager()

    const purchase = await em.findOne(PurchaseDetailModel, {
      select: ['purchaseId'],
      where: {
        itemId,
      },
    })

    return purchase
  } catch (e) {
    throw e
  }
}
