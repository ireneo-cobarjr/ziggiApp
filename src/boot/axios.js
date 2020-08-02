import axios from 'axios'

const BASE_ENDPOINT = '//ec2-34-204-196-11.compute-1.amazonaws.com'
const PREFIX_VERSION = 'api/v1'

const instance = axios.create({
  baseURL: `${BASE_ENDPOINT}/${PREFIX_VERSION}`,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

const api = {
  login: '/login',
  products: '/customer/sku/list',
  search: '/customer/sku/search/category:sub/es_es'
}

export { instance, api }
