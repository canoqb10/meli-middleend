import { Request, Response, NextFunction, Router } from 'express'

import { getItems, getCategoryById, getItemById, getItemDescriptionById } from './services'

import { meliItemNotFoundImgURL, ItemNotFoundError, BadRequestError } from '../../utils'

import { MeliCategories, MeliItem, MiddleEndResult, MiddleEndResults } from './dtos'
import { getUser } from '../users/services'

/**
 * @description Items controller Class
 */
class ItemsController {
  public path = '/api/items'
  public router = Router()

  constructor() {
    this.intializeRoutes()
  }

/**
 * @description Definition of endpoints
 */
  public intializeRoutes() {
    this.router.get(this.path, this.searchItems)

    this.router.get(`${this.path}/:id`, this.searchItem)
  }

  
/**
 * @description Search Items
 * @param req 
 * @param res 
 * @param next 
 * @returns MiddleEndResults { author: Author | null, categories: Array<string>, items: Array<MidleEndItem>, paging: MiddleEndPaging }
 */
  searchItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, offset } = req.query
      console.log('search items by query=', search)
      if (!search) {
        throw new BadRequestError('search param is required')
      }

      const resResults = await getItems(<string>search, Number(offset))
      console.log('items found...')
      if (!resResults.status || resResults.status !== 200) {
        throw new ItemNotFoundError('MeLi data API does not found')
      }

      let categories: string[] = []
      for await (const item of resResults.data.results) {
        const _res = await getCategoryById(item.category_id)
        if (!_res.status || _res.status !== 200) {
          return
        }

        categories = [
          ...new Set<string>(_res.data.path_from_root.map(({ name }: MeliCategories) => name)),
        ]
      }
      const author = await getUser()
      const results: MiddleEndResults = {
        author,
        categories: categories,
        items: resResults.data.results.map((item: MeliItem) => ({
          id: item.id,
          title: item.title,
          price: {
            currency: item.currency_id,
            amount: item.price,
            decimals: 0,
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
          location: item.address.state_name,
          categories: item.categories,
        })),
        paging: resResults.data.paging,
      }
      console.log('sending items...')
      res.status(200).send(results)
    } catch (error) {
      console.log('error', error)
      return next(error)
    }
  }

  /**
   * @description Retrieve an item by id
   * @param req 
   * @param res 
   * @param next 
   * @returns  MiddleEndResult {  author: Author | null, categories: Array<string>, item: MidleEndItem }
   */
  searchItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      let idMeli: string | undefined = id

      console.log('find item by id=', id)

      if (id === 'undefined') {
        idMeli = undefined
      }

      if (!idMeli) {
        throw new BadRequestError('item ID is required')
      }

      const { data, status } = await getItemById(id)

      const resDes = await getItemDescriptionById(id)
      const resCat = await getCategoryById(data.category_id)
      if (
        (!status || status !== 200) &&
        (!resDes.status || resDes.status !== 200) &&
        (!resCat.status || resCat.status !== 200)
      ) {
        throw new ItemNotFoundError('MeLi item data does not found')
      }
      const author = await getUser()
      const result: MiddleEndResult = {
        author,
        categories: resCat.data.path_from_root.map(({ name }: MeliCategories) => name),
        item: {
          id: data.id,
          title: data.title,
          price: {
            currency: data.currency_id,
            amount: data.price,
            decimals: 0,
          },
          picture:
            Array.isArray(data.pictures) && data.pictures.length > 0
              ? data.pictures[0].url
              : meliItemNotFoundImgURL,
          condition: data.condition,
          free_shipping: data.shipping.free_shipping,
          sold_quantity: data.sold_quantity,
          description: resDes.data.plain_text,
        },
      }
      console.log('sending item')
      res.status(200).send(result)
    } catch (error) {
      console.log('error', error)
      return next(error)
    }
  }
}

export default ItemsController
