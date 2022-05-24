<template>
  <b-row>
    <b-col
      cols="6"
      class="h-screen bg-white wrapper-left-content-verified"
    >
      <b-row class="mb-5 pb-5">
        <b-img
          src="@/@core/assets/image/logo-komerce-no-tag.png"
          alt="logo"
          width="200"
          class="pl-3 pt-2"
        />
      </b-row>
      <b-row class="justify-content-center mt-24 pt-24">
        <b-col
          cols="12"
          class="text-center text-black"
        >
          <h2 class="text-black mb-1">
            <strong>
              Periksa Email Anda
            </strong>
          </h2>
          <p>
            Silahkan verifikasi melalui email yang telah kami kirimkan
          </p>
        </b-col>
        <b-col
          cols="8"
          class="text-center px-2"
        >
          <b-button
            variant="flat-primary"
            tag="router-link"
            :to="{name:'auth-login'}"
          >
            <strong>Masuk</strong>
          </b-button>
        </b-col>
      </b-row>
    </b-col>
    <b-col
      cols="6"
      class="h-screen wrapper-right-content-verified"
    />

    <!-- Mobile -->
    <b-col
      cols="12"
      class="h-screen bg-white wrapper-verified-mobile"
    >
      <b-row class="mb-5 pb-5">
        <b-img
          src="@/@core/assets/image/new-brand.png"
          alt="logo"
          width="200"
          class="pl-3 pt-2"
        />
      </b-row>
      <b-row class="justify-content-center mt-5 pt-3">
        <b-col
          cols="12"
          class="text-center"
        >
          <h2 class="text-black">
            <strong>
              Periksa Email Anda
            </strong>
          </h2>
          <p>
            Silahkan verifikasi melalui email yang telah kami kirimkan
          </p>
        </b-col>
        <b-col
          cols="12"
          class="text-center"
        >
          <b-button
            variant="flat-primary"
            tag="route-link"
            :to="{name:'auth-login'}"
          >
            <strong>Masuk</strong>
          </b-button>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
/* eslint-disable global-require */
import {
  BRow,
  BImg,
  BCol,
  BButton,
} from 'bootstrap-vue'
import store from '@/store/index'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BRow,
    BImg,
    BCol,
    BButton,
    // BContainer,
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
  [dir] .wrapper-right-content-verified {
    background-color: #E7E9F2C2;
    background-image: url('../../../@core/assets/image/bg-verified.svg');
    background-repeat: no-repeat;
  }

  // Responsive
  @media only screen and (max-width: 991px) {
    [dir] .wrapper-right-content-verified {
      display: none;
    }
    [dir] .wrapper-left-content-verified {
      display: none;
    }
  }
  @media only screen and (min-width: 992px) {
    [dir] .wrapper-verified-mobile {
      display: none;
    }
  }
@import '@core/scss/vue/pages/page-misc.scss';
</style>
