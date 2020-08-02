<template>
  <q-page id="search-page">
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
      <q-item clickable v-ripple  v-for="(product, index) in filtered" :key=index >
        <q-item-section side >
          <img class="side-product-image" :src="product.imgsrc">
        </q-item-section>
        <q-item-section>
          <div class="text-weight-bold text-blue-grey-10">{{ product.title }}</div>
          <q-rating
            v-model="product.rating"
            size="1em"
            color="orange"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            readonly
          />
          <div class="q-mt-md">
            <sup class="currency">$</sup><span class="text-h5">{{ product.price }}</span><sup class="cents"> .00</sup>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  props: ['filtered']
}
</script>

<style lang="scss" scoped>
  .filter-dropdown {
    width: 100vw;
  }
  .side-product-image {
    height: 90px;
    width: 90px;
  }
</style>
