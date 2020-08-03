export function getProducts (state, payload) {
  state.products = payload.sort(compare)
}

export function getCategories (state, payload) {
  state.categories = payload.filter(category => {
    return category.parent_id === null
  }).sort(compare)
}

function compare (a, b) {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA > nameB) {
    return 1
  } else if (nameA < nameB) {
    return -1
  } else {
    return 0
  }
}
