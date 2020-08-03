<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Ziggi<span> - {{title}}</span>
        </q-toolbar-title>

        <div>
          <q-icon name="shopping_cart" size="sm" />
        </div>
      </q-toolbar>
      <div class="row q-px-sm q-pt-sm">
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
      <router-view :filtered="filtered" :loading="loading" :categories="categories" @checkFilters="onSearch" @setTitle="onNav" />
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
      searchTerm: '',
      leftDrawerOpen: false,
      filtered: [],
      categories: [],
      loading: true,
      links: [
        { title: 'Products', link: '/', caption: '', icon: 'shopping_basket' },
        { title: 'Outlets', link: '/outlets', caption: '', icon: 'store' }
      ]
    }
  },
  methods: {
    onSearch () {
      this.filtered = this.$store.getters['products/searchProducts'](this.searchTerm, this.categories)
    },
    getCategoryList () {
      this.categories = this.$store.getters['products/getCategories']
    },
    onNav (e) {
      this.title = e
      this.searchTerm = ''
    }
  },
  async created () {
    this.loading = true
    await this.$store.dispatch('products/getProducts')
    await this.$store.dispatch('products/getCategories')
    this.getCategoryList()
    this.onSearch()
    this.loading = false
  }
}
</script>
