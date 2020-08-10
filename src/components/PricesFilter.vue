<template>
  <q-tree
  :nodes="priceFilter"
  node-key="id"
  tick-strategy="leaf"
  :ticked.sync="ticked"
  no-connectors
  :accordion="true"
  @update:ticked="$emit('tickedPriceFilters', $event)"
  />
</template>

<script>
export default {
  props: ['extraFilters', 'ticks'],
  data () {
    return {
      ticked: []
    }
  },
  computed: {
    priceFilter () {
      return this.buildTree(this.extraFilters.prices.delivery_dow)
    }
  },
  methods: {
    buildTree (src) {
      const tree = []
      const { value, ids } = src
      let counter = 0
      let rootID = 50000

      value.forEach(v => {
        const child = []
        ids[counter].forEach(i => { child.push({ label: `id: ${i}`, id: i, show: true }) })
        tree.push({ label: `${v}`, id: rootID, children: child })
        counter += 1
        rootID += 1
      })
      return tree
    },
    setTicks () {
      this.ticked = []
      this.priceFilter.forEach(pf => {
        pf.children.forEach(f => {
          if (f.show) {
            this.ticked.push(f.id)
          }
        })
      })
    }
  },
  created () {
    if (this.ticks.length > 0) {
      this.ticked = this.ticks
    } else {
      this.setTicks()
    }
    this.$emit('tickedPriceFilters', this.ticked)
  }
}
</script>

<style lang="scss" scoped>

</style>
