
/**
 * @description Data definition from items module
 */
import 'reflect-metadata'
import { IsBoolean, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'

import { Author } from '../../db-config'

export interface MeliCategories {
  name: string
}

export interface MeliPrice {
  currency_id: string
  amount: number
}

export interface MeliShipping {
  free_shipping: boolean
}

export interface MeliAddress {
  state_name: string
}

export interface MeliItem {
  id: string
  title: string
  price: MeliPrice
  currency_id: string
  thumbnail: string
  condition: string
  shipping: MeliShipping
  address: MeliAddress
  categories: Array<string>
}

export interface MiddleEndPrice {
  currency: string
  amount: number
  decimals: number
}

export interface MidleEndItem {
  id: string
  title: string
  price: MiddleEndPrice
  picture: string
  condition: string
  free_shipping: boolean
  sold_quantity: number
  description: string
  location?: string
  categories?: Array<string>
}

export interface MiddleEndResult {
  author: Author | null
  categories: Array<string>
  item: MidleEndItem
}

export interface MiddleEndPaging {
  total: number
  primary_results: number
  offset: number
  limit: number
}

export interface MiddleEndResults {
  author: Author | null
  categories: Array<string>
  items: Array<MidleEndItem>
  paging: MiddleEndPaging
}

export interface Item {
  id: string
  condition: string
  description: string
  free_shipping: boolean
  picture: string
  price: Price
  sold_quantity: number
  title: string
}

export interface Price {
  currency: string
  amount: number
  decimals: number
}

export class ItemDTO {
  @IsString()
  readonly id!: string

  @IsString()
  condition!: string

  @IsString()
  description!: string

  @IsBoolean()
  free_shipping!: boolean

  @IsString()
  picture!: string

  @Type(() => PriceDTO)
  price!: Price

  @IsNumber()
  sold_quantity!: number

  @IsString()
  title!: string
}

export class PriceDTO {
  @IsString()
  currency!: string

  @IsNumber()
  amount!: number

  @IsNumber()
  decimals!: number
}
