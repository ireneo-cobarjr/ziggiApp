import { instance as axios, api } from 'boot/axios'

export async function getOutlets ({ commit }) {
  await axios.get(api.outlets)
    .then(
      r => { commit('getOutlets', r.data) }
    )
    .catch(
      e => e
    )
}
