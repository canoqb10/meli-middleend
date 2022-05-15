/**
 * @description Exports all constants for the application
 */
import 'dotenv/config'

export const apiPort = Number(process.env.API_PORT) || 3001
export const queryMaxResults = Number(process.env.API_QUERY_MAX_RESULTS) || 4
export const meliBaseURL = process.env.MELI_BASE_URL || 'https://api.mercadolibre.com/'
export const meliSitesURL = process.env.MELI_SITES_URL || 'sites/MLA/'
export const meliQueryURL = process.env.MELI_QUERY_URL || 'search'
export const meliCategoriesURL = process.env.MELI_CATEGORIES_URL || 'categories'
export const meliItemDetailURL = process.env.MELI_ITEM_DETAIL_URL || 'items/:id'
export const meliItemDescriptionURL = process.env.MELI_ITEM_DESCRIPTION_URL || '/description'
export const meliItemNotFoundImgURL = process.env.MELI_ITEM_NOT_FOUND_IMG || ''
export const prefix = process.env.PREFIX || 'items'
export const databaseHost = process.env.DB_HOST
export const databasePort = process.env.DB_PORT
export const databaseUser = process.env.DB_USER
export const databasePassword = process.env.DB_PASSWORD
export const databaseName = process.env.DB_NAME
export const plataformNamespace = process.env.PLATFORM_NAMESPACE
export const windowMs = Number(process.env.WINDOWMS)
export const maxRequests = Number(process.env.MAX_REQUESTS)
export const standardHeaders = Number(process.env.STANDARD_HEADERS)
export const legacyHeaders = Number(process.env.LEGACY_HEADERS)
