import {
  http,
  meliSitesURL,
  meliCategoriesURL,
  meliQueryURL,
  meliItemDetailURL,
  meliItemDescriptionURL,
} from '../../utils'

/**
 * @description Request to MeLi API for search items
 * @param q string
 * @param offset number
 * @returns <{data: any, status:string}>
 */
export async function getItems(q: string, offset: number) {
  const { data, status } = await http.get(`${meliSitesURL}${meliQueryURL}`, {
    params: {
      q,
      limit: Number(process.env.API_QUERY_MAX_RESULTS),
      offset,
    },
  })

  return { data, status }
}

/**
 * @description Request to MeLi API for get categories
 * @returns <{data: any, status:string}>
 */
export async function getCategories() {
  const { data, status } = await http.get(`${meliSitesURL}${meliCategoriesURL}`)
  return { data, status }
}

/**
 * @description Request to MeLi API for get a category by id
 * @param id string
 * @returns <{data: any, status:string}>
 */
export async function getCategoryById(id: string) {
  const { data, status } = await http.get(`${meliCategoriesURL}/${id}`)
  return { data, status }
}

/**
 * @description Request to MeLi API for get an item by id
 * @param id string
 * @returns <{data: any, status:string}>
 */
export async function getItemById(id: string) {
  const { data, status } = await http.get(`${meliItemDetailURL}`.replace(':id', id))
  return { data, status }
}

/**
 * @description Request to MeLi API for get item description  by item id
 * @param id string
 * @returns <{data: any, status:string}>
 */
export async function getItemDescriptionById(id: string) {
  console.log('url1', meliItemDetailURL.replace(':id', id))
  console.log('url2', `${meliItemDetailURL.replace(':id', id)}${meliItemDescriptionURL}`)
  const { data, status } = await http.get(
    `${meliItemDetailURL.replace(':id', id)}${meliItemDescriptionURL}`,
  )
  return { data, status }
}
