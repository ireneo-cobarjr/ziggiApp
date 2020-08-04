export function searchProducts (state) {
  return (searchTerm, filter) => {
    const categories = filter.filter(f => f.show)
    if (searchTerm === '' || searchTerm === null) {
      return state.products.filter(product => {
        return categories.some(category => product.category.parent_id === category.id)
      })
    } else {
      const patt = new RegExp(searchTerm, 'i')
      return state.products.filter(product => {
        return patt.test(product.name) && categories.some(category => product.category.parent_id === category.id)
      })
    }
  }
}

export function getCategories (state) {
  const filter = []
  state.categories.forEach(c => {
    filter.push({ name: c.name, id: c.id, show: true })
  })
  return filter
}

export function getProduct (state) {
  return (id) => {
    const pid = id.split(':')
    return state.products.find(p => `${p.id}` === `${pid[1]}`)
  }
}
