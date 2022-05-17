import request from 'supertest'
import App from '../server'
import ItemsController from '../src/api/items/controllers'
import PurchasesController from '../src/api/purchases/controllers'
import { apiPort } from '../src/utils'

const URL = '/api/items'
const searchParam = 'bolsas'
const itemNotFoundParam = 'animagolito'
const category = 'Bolsas'
const itemId = 'MLA928290473'

let server: any
const author = 'Jose Alberto Cano Govea'
const authorName = 'Jose Alberto'

beforeAll(() => {
  server = new App([new ItemsController(), new PurchasesController()], apiPort)
})

describe(`GET ${URL}?search`, () => {
  it('should return 404 if ID search param is receiving but does not exist in MeLi API', async() => {
    await request(server.app)
      .get(`${URL}/:id`)
      .set('authorization', `Bearer ${author}`)
      .expect(500)
  })

  it('should return 400 and BadRequest Error if request param is not defined', async () => {
    await request(server.app)
      .get(`${URL}?search=&offset=0`)
      .set('authorization', `Bearer ${author}`)
      .expect(400)
  })

  it('should return 200 and items void array when request param is defined but do not exist items in the MeLi API', async () => {
    const res = await  request(server.app)
      .get(`${URL}?search=${itemNotFoundParam}&offset=0`)
      .set('authorization', `Bearer ${author}`)
      .expect('Content-Type', /json/)
      .expect(200)
      
      expect(res.body.author.name).toBe(authorName)
      expect(res.body.items.length).toBe(0)
      expect(res.body.categories.length).toBe(0)
  })

  it('should return 200 and valid response if request param list is defined', async () => {
    const res = await  request(server.app)
      .get(`${URL}?search=${searchParam}&offset=0`)
      .set('authorization', `Bearer ${author}`)
      .expect('Content-Type', /json/)
      .expect(200)
      
      expect(res.body.items.length).toBe(4)
      expect(res.body.author.name).toBe(authorName)
      expect(res.body.categories.length).toBeGreaterThanOrEqual(0)
      expect(res.body.categories).toContain(category)
      expect(res.body.items[0].id).toBeDefined()
      expect(res.body.items[0].condition).toBeDefined()
      expect(res.body.items[0].free_shipping).toBeDefined()
      expect(res.body.items[0].location).toBeDefined()
      expect(res.body.items[0].picture).toBeDefined()
      expect(res.body.items[0].title).toBeDefined()
      expect(res.body.items[0].price).toBeDefined()
      expect(res.body.items[0].price.amount).toBeDefined()
      expect(res.body.items[0].price.currency).toBeDefined()
      expect(res.body.items[0].price.decimals).toBeDefined()
  })
})

describe(`GET ${URL}/:id`, () => {
  it('should return 500 and BadRequest Error if ID param is not existing in MeLi API', async () => {
    await request(server.app)
      .get(`${URL}/${null}`)
      .set('authorization', `Bearer ${author}`)
      .expect(500)
      
  })

  it('should return 400 and BadRequest Error if ID param is not receiving', async () => {
    await request(server.app)
      .get(`${URL}/` + undefined)
      .set('authorization', `Bearer ${author}`)
      .expect(400)

  })

  it('should return 200 and item data if ID is receiving', async () => {
    const res = await request(server.app)
      .get(`${URL}/${itemId}`)
      .set('authorization', `Bearer ${author}`)
      .expect('Content-Type', /json/)
      .expect(200)
      
      expect(res.body.author.name).toBe(authorName)
      expect(res.body.item).toBeDefined()
      expect(res.body.item.id).toBe(itemId)
      expect(res.body.item.price).toBeDefined()
      expect(res.body.item.picture).toBeDefined()
      expect(res.body.item.condition).toBeDefined()
      expect(res.body.item.free_shipping).toBeDefined()
      expect(res.body.item.sold_quantity).toBeDefined()
      expect(res.body.item.description).toBeDefined()
      expect(res.body.categories.length).toBeGreaterThanOrEqual(0)

  })
})
