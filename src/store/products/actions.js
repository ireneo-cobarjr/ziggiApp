import { instance as axios, api } from 'boot/axios'

export async function getProducts ({ commit, rootState }) {
  await axios.get(api.products, {
    params: {
      XDEBUG_SESSION_START: 'PHPSTORM'
    },
    headers: {
      Authorization: `Bearer ${rootState.auth.token}`
    }
  })
    .then(
      r => {
        commit('getProducts', r.data)
        return true
      }
    )
    .catch(
      e => console.log(e)
    )
}
