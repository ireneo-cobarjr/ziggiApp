<template>
  <q-page>
    <div v-if="loading" class="loader-spinner">
      <q-spinner
        color="accent"
        size="3em"
      />
    </div>
    <div v-else>
        <div class="text-blue-grey-7 row justify-between q-pa-sm" >
        <div class="q-pa-sm">{{ `${filtered.length} ` }} result<span v-if="filtered.length > 1">s</span></div>
        <q-btn-dropdown label="Filters" dense unelevated persistent @hide="hideFilters" @show="showFilters" ref="fb">
            <div class="filter-dropdown q-px-sm q-py-md">
              <div class="row justify-between">
                <p class="text-h6">Filters</p>
                <div>
                  <q-btn unelevated no-caps color="secondary" class="filter-button q-mr-md" padding="2px 8px" @click="applyFilter">Apply</q-btn>
                  <q-btn unelevated no-caps outline color="secondary" class="filter-button" padding="2px 8px" @click="reset">Reset</q-btn>
                </div>
              </div>
              <q-expansion-item label="Categories" icon="filter_list">
                <categories-tree :categories="categories" @ticked="getTicks" @SetTicked="getTicks" />
              </q-expansion-item>
              <q-expansion-item label="Price" icon="filter_list" v-if="extraFilters.prices.delivery_dow.value.length > 0">
                <q-expansion-item label="Delivery Dow" v-if="extraFilters.prices.delivery_dow.value.length > 0">
                  <price-filter-tree :extraFilters="extraFilters" @tickedPriceFilters="$emit('priceFilter', $event)" :ticks="priceTicks" />
                </q-expansion-item>
                <q-expansion-item label="Delivery Frequency" v-if="extraFilters.prices.delivery_frequency.value.length > 0">
                  <price-filter-generic-tree :prices="extraFilters.prices" :label="`Weekly`" @tickedPriceFilters="$emit('deliveryFrequency', $event)" :property="`delivery_frequency`" :ticks="dfrequency"/>
                </q-expansion-item>
                <q-expansion-item label="Delivery Window" v-if="extraFilters.prices.delivery_window.value.length > 0">
                  <price-filter-generic-tree :prices="extraFilters.prices" :label="`24`" @tickedPriceFilters="$emit('deliveryWindow', $event)" :property="`delivery_window`" :ticks="dwindow"/>
                </q-expansion-item>
              </q-expansion-item>
              <q-expansion-item label="Creation Date" icon="filter_list">
                <date-range :src_date="extraFilters.creation_date" @input="$emit('creationDateInput', $event)" />
              </q-expansion-item>
              <q-expansion-item label="Activation Date" icon="filter_list">
                <date-range :src_date="extraFilters.active" @input="$emit('activeDateInput', $event)" />
              </q-expansion-item>
              <q-expansion-item label="Publish Date" icon="filter_list">
                <date-range :src_date="extraFilters.publish" @input="$emit('publishDateInput', $event)" />
              </q-expansion-item>
            </div>
        </q-btn-dropdown>
        </div>
        <q-list separator >
          <q-item :disable="disabled" v-for="(item, index) in filtered" :key="index" class="q-py-md" >
            <q-item-section top avatar>
              <q-avatar color="primary" text-color="white" icon="add_shopping_cart" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{item.name}}</q-item-label>
              <q-item-label caption>{{`Auto Order: ${item.auto_order}`}}</q-item-label>
              <q-item-label caption>{{`VAT: ${item.vat}`}}</q-item-label>
              <span>SKU: {{item.id}}</span>
              <q-expansion-item :label="`Vendor (${item.vendors.length})`" icon="store" dense class="q-mt-md" style="margin-left: -1rem">
                <div v-if="item.vendors.length < 1" class="q-pl-md">(None)</div>
                <div v-else class="q-pl-md q-mt-md">
                  <p v-for="(vendor, index) in item.vendors" :key=index>
                    <span class="text-capitalize text-bold"><q-icon name="storefront" size="sm" /> {{ vendor.company }}</span><br>
                    <span class="text-blue-grey-14">{{ vendor.address }}</span><br>
                    <span class="text-blue-grey-14">{{ vendor.email }}</span>
                  </p>
                </div>
              </q-expansion-item>
            </q-item-section>
          </q-item>
        </q-list>
    </div>
  </q-page>
</template>

<script>
import CategoriesTree from '../components/Categories.vue'
import PriceFilterTree from '../components/PricesFilter.vue'
import PriceFilterGenericTree from '../components/PricesFilterGeneric.vue'
import DateRange from '../components/DateRange.vue'

export default {
  props: ['filtered', 'loading', 'categories', 'extraFilters', 'priceTicks', 'dwindow', 'dfrequency'],
  components: {
    CategoriesTree,
    PriceFilterGenericTree,
    PriceFilterTree,
    DateRange
  },
  data () {
    return {
      disabled: false,
      ticks: []
    }
  },
  methods: {
    applyFilter () {
      this.$refs.fb.hide()
      this.$emit('checkFilters', this.ticks)
    },
    getTicks (e) {
      this.ticks = e
      this.$emit('SetTicked', e)
    },
    reset () {
      this.$refs.fb.hide()
      this.$emit('reset')
    },
    showFilters () {
      this.disabled = true
      this.$emit('FiltersVisible', this.disabled)
    },
    hideFilters () {
      this.disabled = false
      this.$emit('FiltersVisible', this.disabled)
    }
  },
  mounted () {
    this.$emit('setTitle', 'Brand')
  }
}
</script>

<style lang="scss" scoped>
  .loader-spinner {
      position: absolute;
      top: 40%;
      left: calc(50% - 1.5em);
  }

  .filter-dropdown {
    width: 95vw;
  }
  .filter-button {
    height: 2rem !important;
    padding: 2px 8px !important;
  }
</style>
