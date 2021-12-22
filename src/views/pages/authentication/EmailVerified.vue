<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <!-- Brand logo-->
    <b-link class="brand-logo d-none d-lg-flex">
      <b-img
        :src="appLogoImage"
        alt="logo"
        class="flat-image"
        style="width: 36px"
      />
      <h2 class="brand-text text-primary ml-50 mt-auto mb-auto">
        <span class="text-white">{{ appName }}</span>
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          Email terverifikasi ✅
        </h2>
        <p class="mb-2">
          Terima kasih telah memverifikasi akun Komerce Anda.
        </p>

        <div>
          <b-button
            variant="primary"
            class="mb-2 btn-sm-block"
            :to="{name:'auth-login'}"
          >
            Login
          </b-button>
        </div>

        <!-- image -->
        <b-img
          fluid
          :src="imgUrl"
          alt="Error page"
        />
      </div>
    </div>
  </div>
<!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BLink, BButton, BImg } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'
import store from '@/store/index'

export default {
  components: {
    BLink,
    BButton,
    BImg,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/not-authorized.svg'),
    }
  },
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    return {
      // App Name
      appName,
      appLogoImage,
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/not-authorized-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
