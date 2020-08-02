import { LocalStorage } from 'quasar'
import { instance as axios, api } from 'boot/axios'

export async function login ({ commit, state }, { email, password }) {
  await axios.post(api.login, {
    email: email,
    password: password
  }).then(r => {
    commit('setToken', `${r.data.access_token}`)
    LocalStorage.set('grant', `${r.data.access_token}`)
  })
    .catch(e => console.log(e))
}
