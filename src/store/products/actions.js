export function getProducts ({ commit, state }, vm) {
  vm.$axios.get(vm.$API.products, {
    params: {
      XDEBUG_SESSION_START: 'PHPSTORM'
    },
    headers: {
      Authorization: `Bearer ${state.token}`
    }
  })
    .then(
      r => {
        commit('getProducts', r.data)
        commit('setData')
      }
    )
    .catch(
      e => console.log(e)
    )
}
