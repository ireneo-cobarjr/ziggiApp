export function getProducts (state, payload) {
  state.sampleData = payload
}

export function setData (state) {
  const sample = []
  state.sampleData.forEach(d => {
    sample.push({ title: d.name, price: '10', imgsrc: 'mobile.jpeg', rating: 3.5, id: 1 })
  })
  state.products = sample
}
