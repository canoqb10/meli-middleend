import App from './server'
import ItemsController from './src/api/items/controllers'
import PurchasesController from './src/api/purchases/controllers'
import { apiPort } from './src/utils'
/**
 * Creates a server instance and create a listener
 */
const app = new App([new ItemsController(), new PurchasesController()], apiPort)

app.listen()
