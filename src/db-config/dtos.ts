
/**
 * @description General Data definition for Application
 */
import { Purchase } from '../api/purchases/dtos'

export interface Audited {
  createdAt: Date
  createdBy: number
  updatedAt?: Date | null
  updatedBy?: number | null
  deletedAt?: Date | null
}

export interface User {
  id: number
  name: string
  lastname: string
  purchases?: Array<Purchase>
}

export interface Author {
  name: string
  lastname: string
}
