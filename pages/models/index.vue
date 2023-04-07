<template>
  <div class="container">
    <!-- <AppContainer /> -->
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend({
  name: 'HomePage',
  computed: {
    ...mapState({
      myUserList: state => state.users,
      myLocation: state => state.position,
      title: state => state.title,
      myProductList: (state) => {
        return state.products.data
      }
    })
  },
  mounted() {
    if (window.innerWidth < 992) {
      this.getDeviceInfo(true)
    } else {
      this.getDeviceInfo(false)
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth < 992) {
        this.getDeviceInfo(true)
      } else {
        this.getDeviceInfo(false)
      }
    })
  },
  methods: {
    ...mapActions({
      getDeviceInfo: 'general/getDeviceInfo'
    })
  }
})
</script>

<style></style>
