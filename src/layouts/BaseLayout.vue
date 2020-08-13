<template>
  <q-layout view="lHh Lpr lFf">
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
    <router-view @drawerClicked="leftDrawerOpen = !(leftDrawerOpen)" ></router-view>
  </q-layout>
</template>

<script>
import Links from '../components/EssentialLink.vue'

export default {
  components: {
    Links
  },
  data () {
    return {
      leftDrawerOpen: false,
      links: [
        { title: 'Brand', link: '/brand', caption: '', icon: 'shopping_basket' },
        { title: 'Customer', link: '/customer', caption: '', icon: 'shopping_basket' },
        { title: 'Outlets', link: '/brand/outlets', caption: '', icon: 'store' }
      ]
    }
  }
}
</script>
