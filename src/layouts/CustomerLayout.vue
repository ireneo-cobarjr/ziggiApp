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
          :disable="controlState"
          @click="$emit('drawerClicked')"
          v-else
        />

        <q-toolbar-title>
          Ziggi<span> - {{title}}</span>
        </q-toolbar-title>

        <div>
          <q-icon name="shopping_cart" size="sm" />
        </div>
      </q-toolbar>
      <div class="row q-px-sm q-pt-sm" v-if="$route.path === '/customer'">
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
export default {
  name: 'MainLayout',
  data () {
    return {
      //* This property just controls the state of the search box, search button and toolbar button.
      //* If filters dropdown is visible, the other controls are disabled until the filters dropdown is hidden back.
      //* So as to not make users make unlikely activities at the same time like adding a search term on the search box while the filters is still visible.
      controlState: false,

      //* This property just sets the current page's title on the toolbar
      title: '',

      //* This property is the model for the search box and holds the value for any text input on the search box.
      searchTerm: '',

      //* This property is used to save the latest search term to be used on the reset method.
      searched: '',

      //* The final result of search and filters applied. This is the data viewed by all users at all times.
      filteredResults: [],

      //* Data used by all filters. factory functions that build filters also store its result here.
      filters: {
        categories: [],
        delivery_dow: [],
        delivery_frequency: [],
        delivery_window: [],
        created_at: { min: '', max: '' },
        active: { min: '', max: '' }
      },

      //* This proprty stores the base state of date based filters. To be used by reset method.
      dateBaseState: {
        created_at: { min: '', max: '' },
        active: { min: '', max: '' }
      },

      //* Used by all filters. For each SKU who met a filters condition will have its sku_id placed at this array.
      //* This array holds the final sku id after applying filters and search term.
      ticks: [],

      //* Holds the state of the spinner component used by the loading scene.
      loading: true,

      //* This holds the state of productView page in relevance to navigation.
      isSingleProduct: false
    }
  },
  computed: {
    //* Precalculates the seach result. If the search term is blank, then this returns all sku from the endpoint.
    //* This property is not what users sees, but is rather the basis for the final result.
    searchResults () {
      return this.$store.getters['customer/searchProducts'](this.searchTerm)
    },

    //* Process categories to be used by category filters.
    categories () {
      return this.$store.getters['customer/getCategories']
    },

    //* Saves the base state of the ticks property. To be used by the reset method.
    baseTicks () {
      const ticks = []
      this.searchResults.forEach(sku => { ticks.push(sku.id) })
      return ticks
    }
  },
  methods: {
    //* /////////////////////////////////////////
    //* Factory Functions.
    //* /////////////////////////////////////////
    //* ///
    // ? Each Build Filter Functions process filters as arrays with objects having a property of label and id
    // ? so as to be compatible with Quasar's QTree component.

    //* Builds filters that uses dates from properties on the root of searchResults/sku. This is a reusable function.
    //* Parameter: property is a string that identifies the property with a date string value to be used as a filter.
    //* Return value: None. Directly saves data to filters property and dateBaseState property.
    buildDateFilters (property) {
      const set = []
      this.searchResults.forEach(sr => {
        set.push(sr[property])
      })
      this.filters[property].min = this.getMinDate(set)
      this.filters[property].max = this.getMaxDate(set)
      this.dateBaseState[property] = this.filters[property]
    },

    //* Builds filters from each sku's prices array property. This is a reusable function.
    //* Parameter: property is a string that identifies each sku's prices array to be used as a filter.
    //* Return value: None. Directly saves data to filters property.
    buildPriceFilter (property) {
      this.filters[property] = []
      //* Not all sku objects have a valid price array. Gather only those that are valid.
      //* filter searchResults and save to sku all skus with a none empty prices array.
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
      this.filters[property].forEach(pf => {
        pf.label = `${pf.label} (${pf.children.length})`
      })
    },

    //* Creates the filters for the categories based on the searchResults array.
    //* Return value: None. Directly saves data to filters property.
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

    //* Consolidates all filter factory functions.
    createFilters () {
      this.buildCategoryFilters()
      this.buildPriceFilter('delivery_dow')
      this.buildPriceFilter('delivery_window')
      this.buildPriceFilter('delivery_frequency')
      this.buildDateFilters('created_at')
      this.buildDateFilters('active')
    },

    // ? All methods that starts with 'on' like 'onSearch' are methods that responds to certain events.

    //* Responds to events creationDateInput and activeDateInput from the router-view components, specifically, QDate component.
    //* This method is responsible for making sure that date based filters will register sku_ids that meets its conditions on the ticks property.
    onDateFiltered (x) {
      const { property, arg } = x
      this.filters[property] = arg
      this.filterByDate(this.searchResults, property, this.filters[property])
    },

    //* Resets all filters and result back to its former state before any changes to any filters were applied.
    //* Responds to the 'reset' event from components of router-view.
    //* This method fires when the 'Reset' Button is clicked from the filters dropdown menu.
    onReset () {
      this.ticks = this.baseTicks
      this.filters.active = this.dateBaseState.active
      this.filters.created_at = this.dateBaseState.created_at
      this.filteredResults = this.$store.getters['customer/searchProducts'](this.searched)
    },

    //* Applies filter to searchReuslts array.
    //* Basically, it checks ticks array for all sku_ids on it, and uses it to filter the searchResult.
    //* Directly saves the result to filteredResults array and is instantly visible to the user.
    //* This method fires when the 'Apply' button from the filters dropdown menu is clicked.
    onFiltered () {
      this.filteredResults = this.searchResults.filter(result => this.ticks.some(tickID => tickID === result.id))
    },

    // ? NOTES:
    // ? Remember that changing the searchResult by changing the searchTerm on the searchBox and clicking the seach button will also change the filteredResults.
    // ? Changing filteredResults by changing values of filters from the filters dropdown menu and clicking the apply button will never change or affect searchResult.

    //* Fires when the search button from the toolbar is clicked.
    //* Take note that searchResults is already pre-calculated since its already a computed property and is ONLY A BASIS for the final filteredResults
    onSearch () {
      // saves the typed in search term from the search box to searched property so that we may be able to reset it later if needed.
      this.searched = this.searchTerm
      // saves the searchResults array value to the filteredResults.
      this.filteredResults = this.searchResults
      // gets the baseTicks and gets its value to ticks property, remember that baseTicks is also a computed property based on searchResults
      this.ticks = this.baseTicks
      // creates filters based on the searchResults.
      this.createFilters()
    },

    //* /////////////////////////////////////////
    //* These are helper fumctioms
    //* /////////////////////////////////////////

    //* This function is used by buildDateFilters() method. This function finds the newest date from src array
    //* Parameters: src is an array of strings of dates.
    //* Return value: a date in string format (e.g. /2020/8/10) that can readily be consumed by Quasar's QDate component.
    getMaxDate (src) {
      let max = src[0]
      for (let x = 1; x < (src.length - 1); x++) {
        const MAX = new Date(max)
        const dateB = new Date(src[x])
        const txtA = new Date(`${MAX.getFullYear()}/${MAX.getMonth() + 1}/${MAX.getDate()}`)
        const txtB = new Date(`${dateB.getFullYear()}/${dateB.getMonth() + 1}/${dateB.getDate()}`)
        if (txtB > txtA) {
          max = src[x]
        }
      }
      const date = new Date(max)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },

    //* This function is used by buildDateFilters() method. This function finds the oldest date from src array
    //* Parameters: src is an array of strings of dates.
    //* Return value: a date in string format (e.g. /2020/8/10) that can readily be consumed by Quasar's QDate component.
    getMinDate (src) {
      let min = src[0]
      for (let x = 1; x < (src.length - 1); x++) {
        const MIN = new Date(min)
        const dateB = new Date(src[x])
        const txtA = new Date(`${MIN.getFullYear()}/${MIN.getMonth() + 1}/${MIN.getDate()}`)
        const txtB = new Date(`${dateB.getFullYear()}/${dateB.getMonth() + 1}/${dateB.getDate()}`)
        if (txtB < txtA) {
          min = src[x]
        }
      }
      const date = new Date(min)
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },

    //* This function is used by onDateFiltered() method. This function directly filters src using the passed filtered parameter and saves all sku_id
    //* of filtered src to ticks array. This function doesnt direclty change the result users see but instead prepapares the filter process.
    //* Parameters: src is the array that will be filtered, property is the property name to be used as a filter, and filter is the filter value as an object.
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

    //* Responds to setTitle event fired from the router-view component and set the page title on the toolbar.
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
    // * Functions here will always fire whenever users navigate to this page.
    //* Sets loading screen on while all functions at vue created lifecycle hook are not yet finished running.
    this.loading = true

    //* Fetch data from the server using the endpoints defined at /boot/axios and store it on Vuex state.
    await this.$store.dispatch('customer/getProducts')
    await this.$store.dispatch('customer/getCategories')

    //* Runs onSearch from the first time. This will initialize most properties like filters.
    this.onSearch()

    //* Stops the loading screen
    this.loading = false

    //* Global Bus Event
    //* Responds to ticked event from filter components. This ensures that all filters are synced.
    //* arg is the value received from the event. All filters sends their ticks via this receiver.
    this.$root.$on('ticked', (arg) => { this.ticks = arg })
  }
}
</script>
