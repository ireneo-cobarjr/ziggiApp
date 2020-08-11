<template>
  <div>
    <q-checkbox v-model="selectAll" label="Select All" @input="onSelectAll" />
    <q-tree
    :nodes="filters"
    node-key="id"
    tick-strategy="leaf"
    :ticked.sync="ticked"
    no-connectors
    :accordion="true"
    @update:ticked="setTicks"
    />
  </div>
</template>

<script>
export default {
  props: ['filters', 'ticks', 'baseTicks'],
  data () {
    return {
      ticked: [],
      selectAll: true
    }
  },
  methods: {
    checkTicks (arg) {
      let status = true
      this.baseTicks.forEach(tick => {
        status = (status && arg.some(a => tick === a))
      })
      return status
    },
    setTicks (arg) {
      if (this.checkTicks(arg)) {
        this.selectAll = true
      } else if (this.ticked.length === 0) {
        this.selectAll = false
      } else {
        this.selectAll = null
      }
      // this.$emit('ticked', arg)
      this.$root.$emit('ticked', arg)
    },
    onSelectAll () {
      if (this.selectAll) {
        this.ticked = this.baseTicks
      } else {
        this.ticked = []
      }
      // this.$emit('ticked', this.ticked)
      this.$root.$emit('ticked', this.ticked)
    }
  },
  created () {
    if (this.ticks.length > 0) {
      this.ticked = this.ticks
    }
    this.setTicks(this.ticked)
    this.$root.$on('ticked', (arg) => {
      this.ticked = arg
      if (this.checkTicks(arg)) {
        this.selectAll = true
      } else if (this.ticked.length === 0) {
        this.selectAll = false
      } else {
        this.selectAll = null
      }
    })
    this.$root.$on('dateFiltered', e => {
      this.ticked = e
      if (this.checkTicks(e)) {
        this.selectAll = true
      } else if (this.ticked.length === 0) {
        this.selectAll = false
      } else {
        this.selectAll = null
      }
    })
  }
}
</script>
