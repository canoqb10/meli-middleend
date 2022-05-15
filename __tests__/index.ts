import request from 'supertest'
import { Response, Express } from 'express'
// import { Response, Express } from 'express-serve-static-core'
import App from '../server'
import ItemsController from '../src/api/items/controllers'
import { apiPort } from '../src/utils'

const URL = '/api/items'
const author = 'Jose Alberto'
const searchParam = 'bolsas'
const itemNotFoundParam = 'animagolito'
const category = 'Bolsas'
const itemId = 'MLA928290473'

let server: any

beforeAll(() => {
  server = new App([new ItemsController()], apiPort)
})

describe(`GET ${URL}?search`, () => {
  it('should return 500 and Internal Error if ID search param is receiving but does not exist in MeLi API', (done) => {
    request(server.app)
      .get(`${URL}/:id`)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.statusCode).toBe(500)
        expect(res.body.errorCode).toBe('internal-server-error')
        done()
      })
  })

  it('should return 400 and BadRequest Error if request param is not defined', (done) => {
    request(server.app)
      .get(`${URL}?search=`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.statusCode).toBe(400)
        expect(res.body.errorCode).toBe('search param is required')
        done()
      })
  })

  it('should return 200 and items void array when request param is defined but do not exist items in the MeLi API', (done) => {
    request(server.app)
      .get(`${URL}?search=${itemNotFoundParam}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.author.name).toBe(author)
        expect(res.body.items.length).toBe(0)
        expect(res.body.categories.length).toBe(0)
        done()
      })
  })

  it('should return 200 and valid response if request param list is defined', (done) => {
    request(server.app)
      .get(`${URL}?search=${searchParam}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.items.length).toBe(4)
        expect(res.body.author.name).toBe(author)
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
        done()
      })
  })
})

describe(`GET ${URL}/:id`, () => {
  it('should return 500 and BadRequest Error if ID param is not existing in MeLi API', (done) => {
    request(server.app)
      .get(`${URL}/${null}`)
      .expect('Content-Type', /json/)
      .expect(500)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.statusCode).toBe(500)
        expect(res.body.errorCode).toBe('internal-server-error')
        done()
      })
  })

  it('should return 200 and item data if ID is receiving', (done) => {
    request(server.app)
      .get(`${URL}/${itemId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.author.name).toBe(author)
        expect(res.body.item).toBeDefined()
        expect(res.body.item.id).toBe(itemId)
        expect(res.body.item.price).toBeDefined()
        expect(res.body.item.picture).toBeDefined()
        expect(res.body.item.condition).toBeDefined()
        expect(res.body.item.free_shipping).toBeDefined()
        expect(res.body.item.sold_quantity).toBeDefined()
        expect(res.body.item.description).toBeDefined()
        expect(res.body.categories.length).toBeGreaterThanOrEqual(0)
        done()
      })
  })

  it('should return 400 and BadRequest Error if ID param is not receiving', (done) => {
    request(server.app)
      .get(`${URL}/` + undefined)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: Error, res: any) => {
        if (err) return done(err)
        expect(res.body.statusCode).toBe(400)
        expect(res.body.errorCode).toBe('item ID is required')
        done()
      })
  })
})
