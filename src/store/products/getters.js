export function searchProducts (state) {
  return (searchTerm) => {
    if (searchTerm === '' || searchTerm === null) {
      return state.products
    } else {
      const patt = new RegExp(searchTerm, 'i')
      return state.products.filter(product => {
        return patt.test(product.name)
      })
    }
  }
}
