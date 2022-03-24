<template>
  <!-- Error page-->
  <div class="misc-wrapper">
    <!-- Brand logo-->
    <b-link class="brand-logo d-none d-lg-flex">
      <b-img
        :src="appLogoImage"
        alt="logo"
        class="flat-image"
        style="width: 100px"
      />
      <h2 class="brand-text text-primary ml-50 mt-auto mb-auto">
        <span>{{ appName }}</span>
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          Page Not Allowed 🕵🏻‍♀️
        </h2>
        <p class="mb-2">
          Oops! 😖 The requested URL was not allowed for you.
        </p>

        <b-button
          variant="primary"
          class="mb-2 btn-sm-block"
          :to="{ path: '/' }"
        >
          Back to home
        </b-button>

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
import store from '@/store/index'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BLink,
    BButton,
    BImg,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/error.svg'),
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
        this.downImg = require('@/assets/images/pages/error-dark.svg')
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
