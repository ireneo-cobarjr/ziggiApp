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
        <q-input outlined bottom-slots v-model="searchTerm" placeholder="Search" :dense=true class="full-width" bg-color="white" >
          <template v-slot:append>
            <q-icon v-if="searchTerm !== ''" name="close" @click="searchTerm = ''" class="cursor-pointer" />
          </template>
          <template v-slot:after>
            <q-btn unelevated color="secondary" icon="search" @click="onSearch"/>
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
      :filtered="filtered"
      :loading="loading"
      :categories="categories"
      :extraFilters="extraFilters"
      @checkFilters="onFilter"
      @SetTicked="tmp = $event"
      @setTitle="onNav"
      @singleProduct="isSingleProduct = $event"
      @priceFilter="saveBaseTicks($event)"
      @deliveryWindow="deliveryWindow($event)"
      @deliveryFrequency="deliveryFrequency($event)"
      @creationDateInput="extraFilters.creation_date.inputs = $event"
      @activeDateInput="extraFilters.active.inputs = $event"
      @publishDateInput="extraFilters.publish.inputs = $event"
      @reset="reset"
      :priceTicks="priceFilterTicks"
      :dwindow="deliveryWindowTicks"
      :dfrequency="deliveryFrequencyTicks"
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
      title: '',
      tmp: [],
      priceFilterTicks: [],
      deliveryWindowTicks: [],
      deliveryFrequencyTicks: [],
      priceFilterTicksBaseState: [],
      deliveryFrequencyState: [],
      deliveryWindowState: [],
      searchTerm: '',
      leftDrawerOpen: false,
      filtered: [],
      categories: [],
      extraFilters: {
        prices: {
          delivery_dow: {
            value: [],
            ids: []
          },
          delivery_frequency: {
            value: [],
            ids: []
          },
          delivery_window: {
            value: [],
            ids: []
          }
        },
        creation_date: {
          dates: [],
          min: '',
          max: '',
          inputs: { min: '', max: '' }
        },
        active: {
          dates: [],
          min: '',
          max: '',
          inputs: { min: '', max: '' }
        },
        publish: {
          dates: [],
          min: '',
          max: '',
          inputs: { min: '', max: '' }
        }
      },
      loading: true,
      isSingleProduct: false,
      links: [
        { title: 'Brand', link: '/', caption: '', icon: 'shopping_basket' },
        { title: 'Outlets', link: '/outlets', caption: '', icon: 'store' }
      ]
    }
  },
  methods: {
    onSearch () {
      this.categories = this.$store.getters['brand/getCategories']
      this.filtered = this.$store.getters['brand/searchProducts'](this.searchTerm, this.tmp)
      if (this.searchTerm === '') { this.reset() }
      this.categories = this.$store.getters['brand/setCategories'](this.filtered)
      this.createFilter()
      this.setFilterValues()
      this.seDateFilters()
    },
    onFilter (f) {
      this.categories = this.$store.getters['brand/updateCategories'](f, this.categories)
      this.filtered = this.$store.getters['brand/updateProducts'](f)
      this.filtered = this.filterByDate(this.filtered, 'created_at', this.extraFilters.creation_date.inputs)
      this.filtered = this.filterByDate(this.filtered, 'active', this.extraFilters.active.inputs)
      this.filtered = this.filterByDate(this.filtered, 'publish', this.extraFilters.publish.inputs)
      if (!(this.arrayEquals(this.priceFilterTicksBaseState, this.priceFilterTicks))) {
        this.filtered = this.applypriceFilters(this.filtered)
      }
      this.createFilter()
      this.setFilterValues()
      this.categories = this.$store.getters['brand/setCategories'](this.filtered)
    },
    createFilter () {
      const f = []
      const g = []
      const h = []
      this.filtered.forEach(product => {
        if (product.prices.length > 0) {
          product.prices.forEach(price => {
            f.push(price.delivery_dow)
            g.push(price.delivery_frequency)
            h.push(price.delivery_window)
          })
        }
      })
      const unique1 = new Set(f)
      const unique2 = new Set(g)
      const unique3 = new Set(h)
      this.extraFilters.prices.delivery_dow.value = [...unique1]
      this.extraFilters.prices.delivery_frequency.value = [...unique2]
      this.extraFilters.prices.delivery_window.value = [...unique3]
    },
    setFilterValues () {
      this.setPriceFilterValues('delivery_dow')
      this.setPriceFilterValues('delivery_frequency')
      this.setPriceFilterValues('delivery_window')
    },
    setPriceFilterValues (property) {
      const ids = []
      let tmpIDS = []
      this.extraFilters.prices[property].value.forEach(value => {
        tmpIDS = []
        this.filtered.forEach(p => {
          if (p.prices.length > 0) {
            p.prices.forEach(id => {
              if (id[property] === value) {
                tmpIDS.push(id.id)
              }
            })
          }
        })
        ids.push(tmpIDS)
      })
      this.extraFilters.prices[property].ids = ids
    },
    applypriceFilters (filtered) {
      const result = []
      if (this.priceFilterTicks.length > 0) {
        const valid = filtered.filter(sku => sku.prices.length > 0)
        valid.forEach(sku => {
          for (let index = 0; index < sku.prices.length; index++) {
            if (this.priceFilterTicks.some(id => id === sku.prices[index].id)) {
              result.push(sku)
              break
            }
          }
        })
        return result
      } else { return filtered }
    },
    applyFrequencyFilters (filtered) {
      const result = []
      if (this.deliveryFrequencyTicks.length > 0) {
        const valid = filtered.filter(sku => sku.prices.length > 0)
        valid.forEach(sku => {
          for (let index = 0; index < sku.prices.length; index++) {
            if (this.deliveryFrequencyTicks.some(id => id === sku.prices[index].id)) {
              result.push(sku)
              break
            }
          }
        })
        return result
      } else { return filtered }
    },
    applyWindowFilters (filtered) {
      const result = []
      if (this.deliveryWindowTicks.length > 0) {
        const valid = filtered.filter(sku => sku.prices.length > 0)
        valid.forEach(sku => {
          for (let index = 0; index < sku.prices.length; index++) {
            if (this.deliveryWindowTicks.some(id => id === sku.prices[index].id)) {
              result.push(sku)
              break
            }
          }
        })
        return result
      } else { return filtered }
    },
    saveBaseTicks (value) {
      if (this.priceFilterTicks.length < 1) {
        this.priceFilterTicksBaseState = value.sort()
      }
      this.priceFilterTicks = value.sort()
    },
    deliveryFrequency (value) {
      if (this.deliveryFrequency.length < 1) {
        this.deliveryFrequencyState = value.sort()
      }
      this.deliveryFrequency = value.sort()
    },
    deliveryWindow (value) {
      if (this.deliveryWindow.length < 1) {
        this.deliveryWindowState = value.sort()
      }
      this.deliveryWindow = value.sort()
    },
    resetTicks () {
      this.categories.forEach(cats => {
        cats.show = true
        cats.sub_category.forEach(c => {
          c.show = true
        })
      })
    },
    seDateFilters () {
      this.filtered.forEach(sku => {
        this.extraFilters.creation_date.dates.push(sku.created_at)
        this.extraFilters.active.dates.push(sku.active)
        this.extraFilters.publish.dates.push(sku.publish)
      })
      this.extraFilters.creation_date.max = this.getMaxDate(this.extraFilters.creation_date.dates)
      this.extraFilters.creation_date.min = this.getMinDate(this.extraFilters.creation_date.dates)
      this.extraFilters.active.max = this.getMaxDate(this.extraFilters.active.dates)
      this.extraFilters.active.min = this.getMinDate(this.extraFilters.active.dates)
      this.extraFilters.publish.max = this.getMaxDate(this.extraFilters.publish.dates)
      this.extraFilters.publish.min = this.getMinDate(this.extraFilters.publish.dates)
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
    resetDateFilters () {
      this.extraFilters.creation_date.inputs.min = ''
      this.extraFilters.active.inputs.min = ''
      this.extraFilters.publish.inputs.min = ''
      this.extraFilters.creation_date.inputs.max = ''
      this.extraFilters.active.inputs.max = ''
      this.extraFilters.publish.inputs.max = ''
    },
    filterByDate (src, property, filter) {
      if (filter.min !== '') {
        return src.filter(sku => {
          const s = new Date(sku[property])
          const x = new Date(`${s.getFullYear()}/${s.getMonth() + 1}/${s.getDate()}`)
          return (x >= (new Date(filter.min)) && x <= (new Date(filter.max)))
        })
      } else {
        return src
      }
    },
    updateCategories () {
      this.tmp = []
      const x = this.categories
      x.forEach(y => {
        y.sub_category.forEach(s => {
          if (s.show) {
            this.tmp.push(s.id)
          }
        })
      })
    },
    onNav (e) {
      this.title = e
      this.searchTerm = ''
    },
    back () {
      this.isSingleProduct = false
      this.$router.go(-1)
    },
    arrayEquals (a, b) {
      return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    },
    reset () {
      this.resetTicks()
      this.resetDateFilters()
      if (this.priceFilterTicksBaseState.length > 0) {
        this.priceFilterTicks = this.priceFilterTicksBaseState
      }
      if (this.deliveryFrequencyState.length > 0) {
        this.deliveryFrequency = this.deliveryFrequencyState
      }
      if (this.deliveryWindowState.length > 0) {
        this.deliveryWindow = this.deliveryWindowState
      }
      this.searchTerm = ''
      this.categories = this.$store.getters['brand/getCategories']
      this.filtered = this.$store.getters['brand/searchProducts'](this.searchTerm, this.tmp)
      this.categories = this.$store.getters['brand/setCategories'](this.filtered)
      this.createFilter()
      this.setFilterValues()
      this.seDateFilters()
    }
  },
  async created () {
    this.loading = true
    await this.$store.dispatch('brand/getProducts')
    await this.$store.dispatch('brand/getCategories')
    this.onSearch()
    this.updateCategories()
    this.loading = false
  }
}
</script>
