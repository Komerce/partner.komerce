<template>
  <div class="auth-wrapper auth-v2">

    <b-row class="auth-inner m-0">
      <!-- Left Text-->
      <b-col
        lg="8"
        class="bg-google d-none d-lg-flex align-items-center px-5"
        :style="{
          backgroundImage: `url('${imgUrl}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'center',
        }"
      >

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
        <!-- /Brand logo-->

        <div
          class="w-100 d-lg-flex align-items-center justify-content-center px-5"
        />
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >

        <!-- Brand logo-->
        <b-link class="brand-logo d-flex d-lg-none">
          <b-img
            :src="appLogoImage"
            alt="logo"
            style="width: 36px"
          />
          <h2 class="brand-text text-primary ml-50 mt-auto mb-auto">
            {{ appName }}
          </h2>
        </b-link>
        <!-- /Brand logo-->

        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
          >
            Reset Password
          </b-card-title>
          <b-card-text class="mb-2">
            Tautan untuk mengatur ulang password akan dikirim melalui email.
          </b-card-text>

          <b-alert
            variant="danger"
            :show="!!error"
          >
            <div class="alert-body">
              <span>{{ error }}</span>
            </div>
          </b-alert>

          <!-- form -->
          <validation-observer
            ref="loginForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent="submit"
            >
              <!-- email -->
              <b-form-group
                label="Email"
                label-for="login-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="login-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- submit buttons -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="invalid || loading"
              >
                <b-spinner
                  v-if="loading"
                  small
                />
                Kirim
              </b-button>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>Kembali ke halaman</span>
            <b-link
              :to="{name:'auth-login'}"
            >
              <span>&nbsp;Login</span>
            </b-link>
          </b-card-text>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow, BCol, BAlert, BLink, BFormGroup, BFormInput, BCardText, BCardTitle, BImg, BForm, BSpinner, BButton, VBTooltip,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import { $themeConfig } from '@themeConfig'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,
    BFormGroup,
    BFormInput,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BSpinner,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      error: '',
      status: '',
      userEmail: '',
      sideImg: require('@/assets/images/illustration/auth-illustration-v2.png'),
      loading: false,

      // validation rules
      required,
      email,
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
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/illustration/auth-illustration-v2.png')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.loading = true
          this.error = ''

          useJwt.resetPassword({
            email: this.userEmail,
          })
            .then(response => {
              if (response.data.status === false) {
                this.error = response.data.message
                this.loading = false
              } else {
                this.$swal({
                  title: 'Tautan Dikirm',
                  text: 'Tautan untuk mengatur ulang password telah dikirim ke email Anda.',
                  icon: 'success',
                  confirmButtonText: 'Mengerti',
                  customClass: {
                    confirmButton: 'btn btn-primary',
                  },
                })

                // Redirect to login page
                this.$router.push({ name: 'auth-login' })
              }
            }).catch(() => {
              this.loading = false
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
</style>
