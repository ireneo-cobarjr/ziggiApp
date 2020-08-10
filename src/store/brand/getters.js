export function searchProducts (state) {
  return (searchTerm, filter) => {
    if (searchTerm === '' || searchTerm === null) {
      return state.products
    } else {
      return filterSearch(searchTerm, state.products)
    }
  }
}

export function getCategories (state) {
  const filter = []
  state.categories.forEach(c => {
    filter.push({ name: c.name, id: c.id, sub_category: c.sub_category, show: true })
  })
  return filter
}

export function getProduct (state) {
  return (id) => {
    const pid = id.split(':')
    return state.products.find(p => `${p.id}` === `${pid[1]}`)
  }
}

export function setCategories (state, getters) {
  return (filtered) => {
    const x = getters.getCategories
    return x.filter(y => filtered.some(
      filter => filter.category.parent_id === y.id
    ))
  }
}

export function updateCategories () {
  return (f, cat) => {
    cat.forEach(c => {
      c.sub_category.forEach(s => {
        s.show = f.some(e => e === s.id)
      })
    })
    return cat
  }
}

export function updateProducts (state) {
  return (f) => {
    return state.products.filter(product => {
      return f.some(id => id === product.category_id)
    })
  }
}

// Helper functions
function filterSearch (f, data) {
  const patt = new RegExp(f, 'i')
  return data.filter(product => {
    return patt.test(product.name) && product.show
  })
}
