import request from 'supertest'
import { EntityManager } from 'typeorm'

import App from '../server'
import ItemsController from '../src/api/items/controllers'
import PurchasesController from '../src/api/purchases/controllers'
import {PurchaseDetailModel, PurchaseModel} from '../src/api/purchases/models'
import { apiPort } from '../src/utils'
import { getEntityManager } from '../src/db-config'
import { UserModel } from '../src/api/users/models'


let user: any
const URL = '/api/purchases'
const purchase = {
  amount: 1,
  item: {
    id: 'ML89234',
    condition: 'new',
    description: 'My product',
    free_shipping: true,
    picture: 'imagen.png',
    price: {
      currency: 'MXN',
      amount: 100,
      decimals: 0
    },
    sold_quantity: 10,
    title: 'My product',
  }
}

const _purchase = {
  amount: 1,
  total: 100,
  userId: 0,
  createdBy: 1,
  createdAt: new Date(),
}
const purchaseDetail = {
  itemId: 'ML89234',
  condition: 'new',
    description: 'My product',
    free_shipping: true,
    picture: 'imagen.png',
    price: {
      currency: 'MXN',
      amount: 100,
      decimals: 0
    },
    sold_quantity: 10,
    title: 'My product',
  purchaseId: 0,
  createdBy: 1,
  createdAt: new Date(),
}
let server: any
const author = 'Jose Alberto Cano Govea'
const authorName = 'Jose Alberto'
let em: EntityManager

beforeAll(async () => {
  server = new App([new ItemsController(), new PurchasesController()], apiPort)
  em = await getEntityManager()
  user = await em.findOne(UserModel, { where: { name: authorName }})
  console.log('USER', user)
})

beforeEach(async () => {
  await em.delete(PurchaseDetailModel, {  })
  em.delete(PurchaseModel, {  })
})

afterEach(async () => {
  await em.delete(PurchaseDetailModel, {  })
  em.delete(PurchaseModel, {  })
})


describe(`GET ${URL}`, () => {
  it('Show all purchases when user does not have any', async() => {
    const res = await request(server.app)
      .get(`${URL}`)
      .set('authorization', `Bearer ${author}`)
      .expect(200)

      expect(res.body.purchases.length).toBe(0)
      // expect(res.body.purchases.length).toBeGreaterThanOrEqual(0)
      expect(res.body.author.name).toBe(authorName)
  })

  it('Show all purchases when user have some it', async() => {
    _purchase.userId = user.id
    const result = await em.insert(PurchaseModel, _purchase)
    purchaseDetail.purchaseId = result.raw[0].id
    await em.insert(PurchaseDetailModel, purchaseDetail)

    const res = await request(server.app)
      .get(`${URL}`)
      .set('authorization', `Bearer ${author}`)
      .expect(200)

      expect(res.body.author.name).toBe(authorName)
      expect(res.body.purchases.length).toBeGreaterThanOrEqual(0)
      expect(res.body.purchases[0].amount).toBe(1)
      expect(res.body.purchases[0].total).toBe('100.00')
  })
})

describe(`POST ${URL}`, () => {
  it('Create a new purchase when does not receiving the amount', async() => {
    await request(server.app)
      .post(`${URL}`)
      .set('authorization', `Bearer ${author}`)
      .send({...purchase, amount: null})
      .expect(400)
  })

  it('Create a new purchase when does not receiving an item', async() => {
    await request(server.app)
      .post(`${URL}`)
      .set('authorization', `Bearer ${author}`)
      .send({...purchase, item: null})
      .expect(500)
  })

  it('Create a new purchase', async() => {
    const res = await request(server.app)
      .post(`${URL}`)
      .set('authorization', `Bearer ${author}`)
      .send(purchase)
      .expect(201)
      expect(res.body.id).toBeDefined()
      expect(res.body.id).toBeGreaterThan(0)
  })
})

describe(`GET ${URL}/:id`, () => {
  it('Should return 400 when purchase is not valid ', async () => {
    await request(server.app)
      .get(`${URL}/param`)
      .set('authorization', `Bearer ${author}`)
      .expect(400)  
  })

  it('Should return 404 when purchase does not exists', async () => {
    await request(server.app)
      .get(`${URL}/1000`)
      .set('authorization', `Bearer ${author}`)
      .expect(404)  
  })

  it('Should return 400 when purchase is does not receiving', async () => {
    await request(server.app)
      .get(`${URL}/` + undefined)
      .set('authorization', `Bearer ${author}`)
      .expect(400)

  })

  it('should return 200 and item data if ID is receiving', async () => {
    _purchase.userId = user.id
    const result = await em.insert(PurchaseModel, _purchase)
    purchaseDetail.purchaseId = result.raw[0].id
    await em.insert(PurchaseDetailModel, purchaseDetail)
    const res = await request(server.app)
      .get(`${URL}/${result.raw[0].id}`)
      .set('authorization', `Bearer ${author}`)
      .expect('Content-Type', /json/)
      .expect(200)
      console.log('BO', res.body)
      expect(res.body.author.name).toBe(authorName)
      expect(res.body.purchase).toBeDefined()
      expect(res.body.purchase.id).toBe(result.raw[0].id)
      expect(res.body.purchase.details).toBeDefined()
      expect(res.body.purchase.details.length).toBeGreaterThan(0)
      expect(res.body.purchase.details[0].id).toBeDefined()
      expect(res.body.purchase.details[0].price).toBeDefined()
      expect(res.body.purchase.details[0].picture).toBeDefined()
      expect(res.body.purchase.details[0].condition).toBeDefined()
      expect(res.body.purchase.details[0].free_shipping).toBeDefined()
      expect(res.body.purchase.details[0].sold_quantity).toBeDefined()
      expect(res.body.purchase.details[0].description).toBeDefined()

  })
})
