import Vue from 'vue'
import axios from 'axios'

const BASE_ENDPOINT = '//ec2-34-204-196-11.compute-1.amazonaws.com'
const PREFIX_VERSION = 'api/v1'

Vue.prototype.$axios = axios.create({
  baseURL: `${BASE_ENDPOINT}/${PREFIX_VERSION}`,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

Vue.prototype.$API = {
  products: '/customer/sku/list'
}
