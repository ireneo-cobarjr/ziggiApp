export function getProducts (state, payload) {
  state.products = payload.sort(compare)
}

export function getCategories (state, payload) {
  const categories = payload.filter(category => {
    return category.parent_id === null
  }).sort(compare)

  categories.forEach(category => {
    category.sub_category = payload.filter(sub => sub.parent_id === category.id)
  })
  state.categories = categories
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
