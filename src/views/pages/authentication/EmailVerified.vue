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
      <b-row class="justify-content-center mt-5 pt-3">
        <b-col
          cols="12"
          class="d-flex justify-content-center mb-2"
        >
          <b-img
            src="@/@core/assets/image/icon-success-verified.svg"
            alt="logo"
            width="100"
          />
        </b-col>
        <b-col
          cols="7 px-5"
          class="text-center text-black"
        >
          <h4 class="text-black">
            <strong>
              Email Berhasil Terverifikasi
            </strong>
          </h4>
          <p>
            Selamat ! Sekarang kamu dapat memulai menggunakan layanan Komerce
          </p>
        </b-col>
        <b-col
          cols="8"
          class="text-center px-2"
        >
          <div class="demo-inline-spacing">
            <b-button
              block
              variant="primary"
              tag="router-link"
              :to="{name:'auth-login'}"
            >
              Masuk
            </b-button>
          </div>
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
          class="d-flex justify-content-center mb-2"
        >
          <b-img
            src="@/@core/assets/image/icon-success-verified.svg"
            alt="logo"
            width="100"
          />
        </b-col>
        <b-col
          cols="12"
          class="text-center"
        >
          <h4 class="text-black">
            <strong>
              Email Berhasil Terverifikasi
            </strong>
          </h4>
          <p>
            Selamat ! Sekarang kamu dapat memulai menggunakan layanan Komerce
          </p>
        </b-col>
        <b-col
          cols="12"
          class="text-center"
        >
          <div class="demo-inline-spacing ml-1">
            <b-button
              block
              variant="primary"
              tag="route-link"
              :to="{name:'auth-login'}"
            >
              Masuk
            </b-button>
          </div>
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
