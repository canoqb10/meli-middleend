import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'

import { verifyToken, errorHandler } from './src/middleware'
import database from './src/db-config'
import { windowMs, maxRequests, standardHeaders, legacyHeaders } from './src/utils'
import ItemsController from './src/api/items/controllers'
import PurchasesController from './src/api/purchases/controllers'

class App {
  public app: express.Application
  public port: number

  constructor(controllers: Array<ItemsController | PurchasesController>, port: number) {
    this.app = express()
    this.port = port

    // Enable Cross Origin Resource Sharing to all origins by default
    this.app.use(cors())

    // response json middleware
    this.app.use(express.json())

    // Check if token is valid for the requests
    this.app.use(verifyToken)

    // Apply the rate limiting middleware to all requests
    const limiter = rateLimit({
      windowMs, // 15 minutes
      max: maxRequests, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: standardHeaders === 1, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: legacyHeaders === 1, // Disable the `X-RateLimit-*` headers
    })
    this.app.use(limiter)

    // gzip compression
    this.app.use(compression())

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: true }))

    // Enable Cross Origin Resource Sharing to all origins by default
    this.app.use(cors())

    // Use Helmet to secure the app by setting various HTTP headers
    this.app.use(helmet())

    // Middleware that transforms the raw string of req.body into json
    this.app.use(bodyParser.json())

    this.initializeDB()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  private initializeControllers(controllers: Array<ItemsController | PurchasesController>) {
    controllers.forEach((controller: ItemsController | PurchasesController) => {
      this.app.use('/', controller.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(errorHandler)
  }

  private async initializeDB() {
    await database
    // await database.initialize()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`)
    })
  }
}

export default App
