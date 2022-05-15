import { getEntityManager } from '../../db-config'
import { isValidArray } from '../../utils'
import { UserModel } from './models'

/**
 * @description Gets an user: For purpose of demo, find last user inserted into db
 * @returns user UserModel
 */
export const getUser = async (): Promise<UserModel | null> => {
  try {
    const em = await getEntityManager()
    const user = await em.find(UserModel, {
      select: ['name', 'lastname'],
      order: {
        createdAt: 'DESC',
      },
    })

    if (!isValidArray(user)) {
      return null
    }

    return user[0]
  } catch (e) {
    console.log('retrieve user error', e)
    return null
  }
}
/**
 * @description Gets an user from name and lastname
 * @param name: string
 * @param lastname: string
 * @returns user UserModel
 */
export const getUserByNameAndLastName = async (
  name: string,
  lastname: string,
): Promise<UserModel | null> => {
  try {
    const em = await getEntityManager()
    const user = await em.findOne(UserModel, {
      select: ['id', 'name', 'lastname'],
      where: {
        name,
        lastname,
      },
    })

    if (!user) {
      return null
    }

    return user
  } catch (e) {
    console.log('retrieve user error', e)
    return null
  }
}
