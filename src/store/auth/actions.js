import { LocalStorage } from 'quasar'
import { instance as axios, api } from 'boot/axios'

export async function login ({ commit }, { email, password }) {
  await axios.post(api.login, {
    email: email,
    password: password
  }).then(r => {
    commit('setAuthData', { token: `${r.data.access_token}`, email: `${email}`, password: `${password}` })
    LocalStorage.set('grant', `${r.data.access_token}`)
    const exp = Date.now() + (r.data.expires_in * 1000)
    LocalStorage.set('exp', exp)
  })
    .catch(e => console.log(e))
}

export async function relogin ({ state, commit }) {
  await axios.post(api.login, {
    email: 'nmojica@signalsecure.com',
    password: 'd3v3l0p3r'
  }).then(r => {
    commit('setToken', r.data.access_token)
    LocalStorage.set('grant', `${r.data.access_token}`)
    const exp = Date.now() + (r.data.expires_in * 1000)
    LocalStorage.set('exp', exp)
  })
    .catch(e => console.log(e))
}
