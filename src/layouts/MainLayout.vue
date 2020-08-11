<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="keyboard_backspace"
          aria-label="Menu"
          @click="back"
          v-if="isSingleProduct"
        />
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          v-else
        />

        <q-toolbar-title>
          Ziggi<span> - {{title}}</span>
        </q-toolbar-title>

        <div>
          <q-icon name="shopping_cart" size="sm" />
        </div>
      </q-toolbar>
      <div class="row q-px-sm q-pt-sm" v-if="$route.path === '/'">
        <q-input outlined bottom-slots v-model="searchTerm" placeholder="Search" :dense=true class="full-width" bg-color="white" :disable="controlState">
          <template v-slot:append>
            <q-icon v-if="searchTerm !== ''" name="close" @click="searchTerm = ''" class="cursor-pointer" />
          </template>
          <template v-slot:after>
            <q-btn unelevated color="secondary" icon="search" @click="onSearch" :disable="controlState" />
          </template>
        </q-input>
      </div>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          <p class="text-primary text-h5 text-weight-bold">Ziggi</p>
        </q-item-label>
        <Links v-for="(link, index) in links" :key="index" :title="link.title" :caption="link.caption" :link="link.link" :icon="link.icon" />

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view
      :filtered="filteredResults"
      :filters="filters"
      :loading="loading"
      :ticks="ticks"
      :baseTicks="baseTicks"
      @applyFilters="onFiltered"
      @creationDateInput="onDateFiltered"
      @activeDateInput="onDateFiltered"
      @reset="onReset"
      @setTitle="onNav"
      @singleProduct="isSingleProduct = $event"
      @FiltersVisible="controlState = $event"
      />

    </q-page-container>
  </q-layout>
</template>

<script>
import Links from '../components/EssentialLink.vue'
export default {
  components: { Links },
  name: 'MainLayout',
  data () {
    return {
      controlState: false,
      title: '',
      searchTerm: '',
      searched: '',
      filteredResults: [],
      filters: {
        categories: [],
        delivery_dow: [],
        delivery_frequency: [],
        delivery_window: [],
        created_at: { min: '', max: '' },
        active: { min: '', max: '' }
      },
      dateBaseState: {
        created_at: { min: '', max: '' },
        active: { min: '', max: '' }
      },
      ticks: [],
      leftDrawerOpen: false,
      loading: true,
      isSingleProduct: false,
      links: [
        { title: 'Brand', link: '/', caption: '', icon: 'shopping_basket' },
        { title: 'Outlets', link: '/outlets', caption: '', icon: 'store' }
      ]
    }
  },
  computed: {
    searchResults () {
      return this.$store.getters['brand/searchProducts'](this.searchTerm)
    },
    categories () {
      return this.$store.getters['brand/getCategories']
    },
    baseTicks () {
      const ticks = []
      this.searchResults.forEach(sku => { ticks.push(sku.id) })
      return ticks
    }
  },
  methods: {
    buildDateFilters (property) {
      const set = []
      this.searchResults.forEach(sr => {
        set.push(sr[property])
      })
      this.filters[property].min = this.getMinDate(set)
      this.filters[property].max = this.getMaxDate(set)
      this.dateBaseState[property] = this.filters[property]
    },
    buildPriceFilter (property) {
      this.filters[property] = []
      //* Not all sku objects have a valid price array. Gather only those that are valid
      const skus = this.searchResults.filter(sku => sku.prices.length)
      if (skus.length) {
        skus.forEach(sku => {
          sku.prices.forEach(price => {
            if (this.filters[property].length) {
              const index = this.filters[property].findIndex(d => d.label === `${price[property]}`)
              if (index === -1) {
                this.filters[property].push({
                  label: `${price[property]}`,
                  id: `pf${price[property]}`,
                  children: [{ label: sku.name, id: price.sku_id }]
                })
              } else {
                const found = this.filters[property][index].children.findIndex(c => c.id === price.sku_id)
                if (found === -1) {
                  this.filters[property][index].children.push({ label: sku.name, id: price.sku_id })
                }
              }
            } else {
              this.filters[property].push({
                label: `${price[property]}`,
                id: `pf${price[property]}`,
                children: [{ label: sku.name, id: price.sku_id }]
              })
            }
          })
        })
      } else {
        this.filters[property] = []
      }
    },
    buildCategoryFilters () {
      const a = this.categories.filter(category => this.searchResults.some(s => s.category.parent_id === category.id))
      this.filters.categories = []
      a.forEach(b => {
        const children = []
        b.sub_category.forEach(sub => {
          const sku = this.searchResults.find(s => s.category_id === sub.id)
          if (sku) {
            children.push({ label: sub.name, id: sku.id })
          }
        })
        //* b.id is category ID of each Category, children's ID should be SKU id
        this.filters.categories.push({
          label: `${b.name} (${children.length})`,
          id: b.id,
          children: children
        })
      })
    },
    createFilters () {
      this.buildCategoryFilters()
      this.buildPriceFilter('delivery_dow')
      this.buildPriceFilter('delivery_window')
      this.buildPriceFilter('delivery_frequency')
      this.buildDateFilters('created_at')
      this.buildDateFilters('active')
    },
    onDateFiltered (x) {
      const { property, arg } = x
      this.filters[property] = arg
      this.filterByDate(this.searchResults, property, this.filters[property])
    },
    onReset () {
      this.ticks = this.baseTicks
      this.filters.active = this.dateBaseState.active
      this.filters.created_at = this.dateBaseState.created_at
      this.filteredResults = this.$store.getters['brand/searchProducts'](this.searched)
    },
    onFiltered () {
      this.filteredResults = this.searchResults.filter(result => this.ticks.some(tickID => tickID === result.id))
    },
    onSearch () {
      this.searched = this.searchTerm
      this.filteredResults = this.searchResults
      this.ticks = this.baseTicks
      this.createFilters()
    },
    getMaxDate (src) {
      let max = ''
      for (let x = 0; x < (src.length - 1); x++) {
        for (let y = (src.length - 1); y !== x; y--) {
          ((new Date(src[x])) > (new Date(src[y]))) ? max = src[x] : max = src[y]
        }
      }
      const date = new Date(max)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    getMinDate (src) {
      let min = ''
      for (let x = 0; x < (src.length - 1); x++) {
        for (let y = (src.length - 1); y !== x; y--) {
          ((new Date(src[x])) < (new Date(src[y]))) ? min = src[x] : min = src[y]
        }
      }
      const date = new Date(min)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    filterByDate (src, property, filter) {
      let test = []
      if (filter.min !== '') {
        test = src.filter(sku => {
          const s = new Date(sku[property])
          const x = new Date(`${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}`)
          return (x >= (new Date(filter.min)) && x <= (new Date(filter.max)))
        })
      } else {
        test = src
      }
      this.ticks = []
      test.forEach(t => { this.ticks.push(t.id) })
      this.$root.$emit('dateFiltered', this.ticks)
    },
    onNav (e) {
      this.title = e
      this.searchTerm = ''
    },
    back () {
      this.isSingleProduct = false
      this.$router.go(-1)
    }
  },
  async created () {
    this.loading = true
    await this.$store.dispatch('brand/getProducts')
    await this.$store.dispatch('brand/getCategories')
    this.onSearch()
    this.loading = false
    this.$root.$on('ticked', (arg) => { this.ticks = arg })
  }
}
</script>
