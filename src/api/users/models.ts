/**
 * @description Users Typeorm Class for DB schema of the Users module
 * */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User, AuditedModel } from '../../db-config'
import { PurchaseModel } from '../purchases/models'

@Entity('user')
export class UserModel extends AuditedModel implements User {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id!: number

  @Column({ type: 'varchar', length: '250' })
  name!: string

  @Column({ type: 'varchar', length: '250' })
  lastname!: string

  @OneToMany(() => PurchaseModel, (purchase: PurchaseModel) => purchase.user)
  purchases?: PurchaseModel[]
}
