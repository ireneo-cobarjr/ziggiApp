<template>
  <div class="q-py-sm q-px-md text-center">
    <span>From:</span><span>{{`${min}`}}</span>
    <q-btn flat round icon="event" class="1-ml-md" color="primary">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date v-model="min_date" minimal :options="minOptions" @input="input">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Close" color="primary" flat v-close-popup />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn> <br>
    <span>To:</span><span>{{`${max}`}}</span>
    <q-btn flat round icon="event" class="1-ml-md" color="primary">
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <q-date v-model="max_date" minimal :options="maxOptions" @input="input">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="Close" color="primary" flat v-close-popup />
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>
    <br>
  </div>
</template>

<script>
export default {
  props: ['src_date', 'property'],
  data () {
    return {
      min_date: '',
      max_date: ''
    }
  },
  computed: {
    min () {
      const d = new Date(this.min_date)
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    },
    max () {
      const d = new Date(this.max_date)
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    }
  },
  methods: {
    minOptions (date) {
      return date <= this.max_date
    },
    maxOptions (date) {
      return date >= this.min_date
    },
    input () {
      this.$emit('input', {
        arg: { min: this.min_date, max: this.max_date },
        property: this.property
      })
    }
  },
  mounted () {
    this.min_date = this.src_date.min
    this.max_date = this.src_date.max
  }
}
</script>

<style lang="scss" scoped>
  span {
      display: inline-block;
      min-width: 3.2rem;
      margin-top: .5rem;
  }
</style>
