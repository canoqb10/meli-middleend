import 'reflect-metadata'
import { DataSource, EntityManager } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { join } from 'path'
import {
  databaseHost,
  databasePort,
  databaseUser,
  databasePassword,
  databaseName,
} from '../utils/constants'

export * from './models'
export * from './dtos'

let entityManager: EntityManager

/**
 * @description creates an datasource connection for database
 */
export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: databaseHost,
  port: Number(databasePort),
  username: databaseUser,
  password: databasePassword,
  database: databaseName,
  namingStrategy: new SnakeNamingStrategy(),
  entityPrefix: 'meli_dev__',
  entities: [
    join(__dirname, '../api/purchases/models.ts'),
    join(__dirname, '../api/users/models.ts'),
  ],
  synchronize: true,
})

const datasource = AppDataSource.initialize()

/**
 * @description Retrieves an instance of entitymanager connection 
 * @returns entityManager Promise<EntityManager>
 */
export const getEntityManager = async (): Promise<EntityManager> => {
  if (entityManager) return entityManager

  const _dataSource = await datasource
  entityManager = _dataSource.manager
  return entityManager
}

export default datasource
