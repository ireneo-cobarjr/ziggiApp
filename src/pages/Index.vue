<template>
  <q-page id="search-page">
    <div v-if="loading" class="loader-spinner">
      <q-spinner
        color="accent"
        size="3em"
      />
    </div>
    <div v-else>
        <div class="text-blue-grey-7 row justify-between q-pa-sm" >
        <div class="q-pa-sm">{{ `${filtered.length} result(s)` }}</div>
        <q-btn-dropdown label="Filters" dense unelevated>
            <div class="filter-dropdown">
            Some Filters here <br />
            Some Filters here <br />
            Some Filters here <br />
            Some Filters here <br />
            Some Filters here <br />
            </div>
        </q-btn-dropdown>
        </div>
        <q-list separator >
        <q-item clickable v-ripple  v-for="(item, index) in filtered" :key=index class="q-py-md">
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
  props: ['filtered', 'loading']
}
</script>

<style lang="scss" scoped>
  .loader-spinner {
      position: absolute;
      top: 40%;
      left: calc(50% - 1.5em);
  }
</style>
