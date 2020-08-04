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
        <q-btn-dropdown label="Filters" dense unelevated persistent @hide="enableList" @show="disabled = true">
            <div class="filter-dropdown q-px-sm q-py-md">
              <p class="text-h6">Categories</p>
              <q-list separator>
                <q-item clickable v-ripple v-for="category in categories" :key="category.id">
                  <q-item-section side-top>
                    <q-checkbox v-model="category.show" />
                  </q-item-section>
                  <q-item-section @click="category.show = !category.show">
                    <q-item-label>{{ category.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
        </q-btn-dropdown>
        </div>
        <q-list separator >
          <q-item clickable :disable="disabled" v-ripple="!disabled"  v-for="(item, index) in filtered" :key="index" class="q-py-md" @click="$router.push(`product/:${item.id}`)">
              <q-item-section top avatar>
                  <q-avatar color="primary" text-color="white" icon="add_shopping_cart" />
              </q-item-section>
              <q-item-section>
                  <q-item-label class="text-weight-bold">{{item.name}}</q-item-label>
                  <q-item-label caption>{{`Auto Order: ${item.auto_order}`}}</q-item-label>
                  <q-item-label caption>{{`VAT: ${item.vat}`}}</q-item-label>
              </q-item-section>
          </q-item>
        </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  props: ['filtered', 'loading', 'categories'],
  data () {
    return {
      disabled: false
    }
  },
  methods: {
    enableList () {
      this.disabled = false
      this.$emit('checkFilters')
    }
  },
  mounted () {
    this.$emit('setTitle', 'Products')
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
</style>
