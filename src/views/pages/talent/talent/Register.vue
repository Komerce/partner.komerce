<template>
  <div>
    <!-- Navbar -->
    <b-navbar
      :toggleable="false"
      :variant="navbarBackgroundColor"
      class="header-navbar navbar navbar-shadow align-items-center"
      :class="[navbarTypeClass]"
    >
      <slot
        name="navbar"
        :navbarBackgroundColor="navbarBackgroundColor"
        :navbarTypeClass="[...navbarTypeClass, 'header-navbar navbar navbar-shadow align-items-center']"
      >
        <div class="navbar-container d-flex content align-items-center">
          <b-navbar-nav class="nav d-flex align-items-center mr-auto">
            <span class="brand-logo">
              <b-img
                :src="appLogoImage"
                alt="logo"
              />
            </span>
            <h2 class="brand-text">
              {{ appName }}
            </h2>
          </b-navbar-nav>
        </div>
      </slot>
    </b-navbar>
    <div class="px-md-3 pt-2 pt-md-4 pb-1">
      <div class="pt-5">
        <form-wizard
          ref="formWizard"
          :title="null"
          :subtitle="null"
          shape="square"
          finish-button-text="Submit"
          back-button-text="Previous"
          class="mb-3"
          :start-index="tabIndex"
          @on-change="updateIndex"
        >
          <!-- accoint details tab -->
          <tab-content
            title="Pendaftaran"
            lazy
          >
            <div class="m-n2">
              <form-content
                v-if="tabIndex === 0"
                @on-submit="next"
              />
            </div>
          </tab-content>

          <!-- personal details tab -->
          <tab-content
            title="Kuesioner"
            lazy
          >
            <form-questionnaire v-if="tabIndex === 1" />
          </tab-content>

          <template slot="footer">
            <div class="wizard-footer-left" />
            <div class="wizard-footer-right" />
          </template>
        </form-wizard>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { BImg, BNavbarNav, BNavbar } from 'bootstrap-vue'
import { $themeConfig } from '@themeConfig'
import useAppConfig from '@core/app-config/useAppConfig'
import useVerticalLayout from '@core/layouts/layout-vertical/useVerticalLayout'
import useJwt from '@/auth/jwt/useJwt'
import FormQuestionnaire from './questionnaire/Form.vue'
import FormContent from './Form.vue'

export default {
  components: {
    FormWizard,
    TabContent,
    FormQuestionnaire,
    FormContent,
    BImg,

    // Navbar Components
    BNavbar,
    BNavbarNav,
  },
  data() {
    return {
      id: this.$route.query.id,
      tabIndex: this.$route.query.tab === 'questionnaire' ? 1 : 0,
    }
  },
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    const {
      navbarBackgroundColor, navbarType, footerType,
    } = useAppConfig()

    const {
      navbarTypeClass,
    } = useVerticalLayout(navbarType, footerType)

    return {
      // App Name
      appName,
      appLogoImage,
      navbarBackgroundColor,
      navbarTypeClass,
    }
  },
  mounted() {
    if (this.id) this.$refs.formWizard.activateAll()
  },
  methods: {
    formSubmitted() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Form Submitted',
          icon: 'EditIcon',
          variant: 'success',
        },
      })
    },
    validationForm() {
      return new Promise((resolve, reject) => {
        this.$refs.accountRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormAddress() {
      return new Promise((resolve, reject) => {
        this.$refs.addressRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormSocial() {
      return new Promise((resolve, reject) => {
        this.$refs.socialRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    updateIndex(oldIndex, newIndex) {
      this.tabIndex = newIndex

      const tab = this.tabIndex === 1 ? 'questionnaire' : 'profile'
      const { id } = this

      this.$router.replace({ query: { id, tab } }).catch(() => {})
    },
    next(data) {
      useJwt.setToken(data.token)

      this.id = data.data.talent.id

      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Success',
          text: 'Pendaftaran berhasil.',
          variant: 'success',
          attachment: 'CheckIcon',
        },
      }, { timeout: 2500 })

      this.$refs.formWizard.nextTab()
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-wizard.scss';
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
