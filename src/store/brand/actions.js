import { instance as axios, api } from 'boot/axios'
import { LocalStorage } from 'quasar'

export async function getProducts ({ commit, dispatch, rootState }) {
  if (Date.now() >= LocalStorage.getItem('exp')) {
    dispatch('auth/relogin', null, { root: true })
  }

  await axios.get(api.brand.sku, {
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

export async function getCategories ({ commit, dispatch, rootState }) {
  if (Date.now() >= LocalStorage.getItem('exp')) {
    dispatch('auth/relogin', null, { root: true })
  }

  await axios.get(api.brand.categories, {
    headers: {
      Authorization: `Bearer ${rootState.auth.token}`
    }
  })
    .then(
      r => { commit('getCategories', r.data) }
    )
    .catch(
      e => console.log(e)
    )
}
