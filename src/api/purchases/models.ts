/**
 * @description Definition of Typeorm Class for DB schema of the Purchases module
 */

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'
import { AuditedModel } from '../../db-config'
import { UserModel } from '../../api/users/models'
import { Purchase, PurchaseDetail } from './dtos'
import { Price } from '../items/dtos'

@Entity('purchase')
export class PurchaseModel extends AuditedModel implements Purchase {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id!: number

  @Column({ type: 'int' })
  userId!: number

  @Column({ type: 'int' })
  amount!: number

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  total!: number
  // @Column({ type: 'int' })
  // total!: number

  @ManyToOne(() => UserModel, (user: UserModel) => user.purchases)
  user!: UserModel

  @OneToMany(() => PurchaseDetailModel, (detail: PurchaseDetailModel) => detail.purchase)
  details!: PurchaseDetail[]
}

@Entity('purchase_detail')
export class PurchaseDetailModel extends AuditedModel implements PurchaseDetail {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id!: number

  @Column({ type: 'varchar' })
  itemId!: string

  @Column({ type: 'varchar', length: 10 })
  condition!: string

  @Column({ type: 'text' })
  description!: string

  @Column()
  free_shipping!: boolean

  @Column({ type: 'text' })
  picture!: string

  @Column({ type: 'int' })
  sold_quantity!: number

  @Column({ type: 'varchar', length: 256 })
  title!: string

  @Column({ type: 'jsonb' })
  price!: Price

  @Column({ type: 'int' })
  purchaseId!: number

  @ManyToOne(() => PurchaseModel, (purchase: PurchaseModel) => purchase.details)
  purchase?: Purchase
}
