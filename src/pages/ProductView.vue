<template>
  <q-page class="q-pa-md">
    <q-parallax :height="200">
      <template v-slot:media>
        <img :src="image">
      </template>
    </q-parallax>
    <p class="text-h4 text-blue-grey-9 q-mt-md">{{product.name}}</p>
    <div class="danglings">
      <q-chip class="q-px-md">Auto Order</q-chip><br/>
      <span>{{product.auto_order}}</span>
    </div>
    <div class="danglings q-ml-lg">
      <q-chip class="q-px-xl">VAT</q-chip><br/>
      <span>{{product.vat}}</span>
    </div>
    <p class="text-justify q-mt-lg">{{description}}</p>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-fab icon="add_shopping_cart" color="accent" direction="up" vertical-actions-align="right" >
        <q-fab-action color="secondary" label="Checkout" label-position="left" />
        <q-fab-action color="primary" label="Add to Cart" label-position="left" />
    </q-fab>
    </q-page-sticky>
    <div class="spacer-bot"></div>
  </q-page>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      image: 'https://picsum.photos/id/1080/200/300'
    }
  },
  computed: {
    product () {
      return this.$store.getters['products/getProduct'](this.id)
    },
    description () {
      const desc = this.product.content.find(p => p.key === 'product.description' && p.locale === 'en_us')
      return desc.value
    }
  },
  mounted () {
    this.$emit('setTitle', this.product.name)
    this.$emit('singleProduct', true)
  }
}
</script>

<style lang="scss" scoped>
  .spacer-bot {
      height: 50px;
  }
  .danglings {
      display: inline-block;

      span {
          display: inline-block;
          width: 100%;
          text-align: center;
      }
  }
</style>
