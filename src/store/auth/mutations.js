export function setAuthData (state, payload) {
  state.token = payload.token
  state.email = payload.email
  state.password = payload.password
}

export function setToken ({ state }, payload) {
  state.token = payload
}
