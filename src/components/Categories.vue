<template>
  <q-tree
  :nodes="treeCategories"
  node-key="id"
  tick-strategy="leaf"
  :ticked.sync="ticked"
  no-connectors
  :accordion="true"
  @update:ticked="$emit('ticked', $event)"
  />
</template>

<script>
export default {
  props: ['categories'],
  data () {
    return {
      ticked: []
    }
  },
  computed: {
    treeCategories () {
      return this.buildTree(this.categories)
    }
  },
  methods: {
    buildTree (src) {
      const tree = []
      src.forEach(s => {
        const children = []
        s.sub_category.forEach(sub => {
          children.push({ label: sub.name, id: sub.id })
        })
        tree.push({ label: s.name, id: s.id, show: s.show, children: children })
      })
      return tree
    },
    setTicks () {
      this.ticked = []
      const x = this.categories
      x.forEach(y => {
        y.sub_category.forEach(s => {
          if (s.show) {
            this.ticked.push(s.id)
          }
        })
      })
    }
  },
  created () {
    this.setTicks()
  },
  mounted () {
    this.$emit('SetTicked', this.ticked)
  }
}
</script>

<style lang="scss" scoped>

</style>
