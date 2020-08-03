<template>
  <q-page>
    <div v-if="spinLoader" class="loader-spinner">
      <q-spinner
        color="accent"
        size="3em"
      />
    </div>
    <div v-else>
        //
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      spinLoader: true
    }
  },
  mounted () {
    this.$emit('setTitle', 'Outlets')
  },
  async created () {
    await this.$store.dispatch('outlets/getOutlets')
    this.spinLoader = false
  }
}
</script>

<style lang="scss" scoped>
  .loader-spinner {
      position: absolute;
      top: 40%;
      left: calc(50% - 1.5em);
  }
</style>
