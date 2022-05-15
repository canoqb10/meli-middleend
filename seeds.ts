import datasource, { getEntityManager } from './src/db-config'
import { author } from './package.json'
import { UserModel } from './src/api/users/models'
import { PurchaseModel, PurchaseDetailModel } from './src/api/purchases/models'

const seedUser = async () => {
  try {
    await datasource
    const em = await getEntityManager()
    console.log('cleaning db...')
    await em.delete(PurchaseDetailModel, {})
    await em.delete(PurchaseModel, {})
    await em.delete(UserModel, {})

    console.log('creating user...', author)
    const count = await em.count(UserModel, {
      where: {
        name: author.name,
        lastname: author.lastname,
      },
    })
    if (count > 0) {
      throw 'The user already exist'
    }
    const user = await em.insert(UserModel, {
      ...author,
      createdAt: new Date(),
      createdBy: 1,
    })
    console.log('user created', user?.identifiers[0])
  } catch (e) {
    console.error('¡Ooops! an error has occurred', e)
  }
}

seedUser()
