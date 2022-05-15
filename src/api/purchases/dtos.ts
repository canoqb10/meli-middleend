/**
 * @description Purchases data definition module
 * */
import 'reflect-metadata'
import { IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

import { User, Author } from '../../db-config'
import { Item, ItemDTO, Price } from '../items/dtos'
import { PurchaseModel } from './models'

export class PurchaseDTO {
  @IsOptional()
  @IsNumber()
  readonly id?: number

  @Type(() => ItemDTO)
  item!: Item

  @IsNumber()
  amount!: number
}

export interface Purchase {
  id: number
  userId: number
  user: User
  amount: number
  total: number
}

export interface PurchaseDetail {
  id: number
  itemId: string
  condition: string
  description: string
  free_shipping: boolean
  picture: string
  sold_quantity: number
  title: string
  price: Price
  purchaseId?: number
  purchase?: Purchase
}

export interface PurchaseResults {
  author?: Author
  purchases: Array<PurchaseModel>
}

export interface PurchaseResult {
  author?: Author
  purchase: PurchaseModel | null
}
