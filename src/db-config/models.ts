/**
 * @description Typeorm class for audit purposes
 */
import { CreateDateColumn, UpdateDateColumn, Column, DeleteDateColumn } from 'typeorm'
import { Audited } from './dtos'

export class AuditedModel implements Audited {
  @CreateDateColumn()
  createdAt!: Date

  @Column({ type: 'int' })
  createdBy!: number

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date

  @Column({ type: 'int', nullable: true })
  updatedBy?: number

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | undefined
}
