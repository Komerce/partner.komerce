<template>
  <div class="auth-wrapper auth-v1 px-2">
    <b-row class="auth-inner m-0">
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <b-img
          src="@/@core/assets/image/logo-komerce-new-tag.png"
        />
      </b-col>

      <b-card :class="modeLogin === true ? 'text-white mt-2' : 'd-none'">
        <b-card-title class="mb-1 text-center">
          Masuk
        </b-card-title>
        <b-card-text class="mb-2 text-center text-black">
          Silahkan masuk dan memulai kemudahan mengelola e-commerce dalam 1 tempat.
        </b-card-text>
        <!-- form -->
        <validation-observer
          ref="loginForm"
          #default="{invalid}"
        >
          <b-form
            class="auth-login-form mt-2"
            @submit.prevent="login"
          >

            <b-form-group
              label="Username atau Email"
              label-for="login-email"
            >
              <validation-provider
                #default="{ errors }"
                label="Username atau Email"
                vid="email"
                rules="required"
                :custom-messages="custommessages1"
              >
                <b-form-input
                  id="login-email"
                  v-model="usernameEmail"
                  :state="errors.length > 0 ? false : null"
                  name="login-email"
                  placeholder="john@mail.com"
                />
                <small class="text-primary">{{ errors[0] }}</small>
                <b-col>
                  <b-row
                    v-if="!!error"
                    class="align-items-center justify-content-between mt-50"
                  >
                    <small
                      class="text-primary"
                    >
                      <strong>
                        {{ error }}
                      </strong>
                    </small>
                    <b-button
                      v-if="showResendEmailVerification"
                      class="ml-50 btn-icon"
                      variant="flat-primary"
                      size="sm"
                      @click="resendEmailVerification"
                    >
                      <b-spinner
                        v-if="loadingResendVerification"
                        small
                      />
                      <strong>
                        Kirim Ulang
                      </strong>
                    </b-button>
                  </b-row>
                  <b-row
                    v-if="messageResendEmailVerification !== ''"
                    class="align-items-center mt-50"
                  >
                    <small
                      class="text-primary"
                    >
                      <strong>
                        {{ messageResendEmailVerification }}
                      </strong>
                    </small>
                  </b-row>
                </b-col>
              </validation-provider>
            </b-form-group>

            <!-- forgot password -->
            <b-form-group>
              <label for="login-password">Password</label>
              <validation-provider
                #default="{ errors }"
                name="Password"
                vid="password"
                rules="required"
                :custom-messages="custommessages"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-form-input
                    id="login-password"
                    v-model="password"
                    :state="errors.length > 0 ? false : null"
                    class="form-control-merge"
                    :type="passwordFieldType"
                    name="login-password"
                    placeholder="Password"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
              <div class="d-flex justify-content-left text-left">
                <b-link :to="{ name: 'auth-forgot-password' }">
                  <small style="margin-right:10px;">Lupa Password?</small>
                </b-link>
              </div>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group v-if="false">
              <b-form-checkbox
                id="remember-me"
                v-model="status"
                name="checkbox-1"
              >
                Remember Me
              </b-form-checkbox>
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
              Masuk
            </b-button>
          </b-form>
        </validation-observer>

        <!-- </b-col> -->
      </b-card>

      <b-card :class="modeVerificationEmail === true ? 'mt-2 p-1' : 'd-none'">
        <b-card-title class="mb-1 text-center">
          <h3 class="text-black">
            <strong>
              Verifikasi Email
            </strong>
          </h3>
        </b-card-title>
        <b-card-text class="mb-1 text-center text-black">
          Cek email kamu, verifikasi telah dikirimkan.
          Belum menerima? {{ countTimerEmail === 0 ? 'Kirim ulang (60 detik)' : '' }}
        </b-card-text>
        <b-row class="justify-content-center mb-1">
          <small>Mohon tunggu {{ countTimerEmail }} detik untuk mengirim ulang.</small>
        </b-row>

        <b-row class="justify-content-center mb-1">
          <b-button
            :variant="countTimerEmail === 0 ? 'flat-primary' : 'flat-dark'"
            size="sm"
            :disabled="countTimerEmail !== 0"
            class="btn-icon"
            @click="resendEmailVerification"
          >
            Kirim Ulang
          </b-button>
        </b-row>

        <b-button
          variant="primary"
          block
          @click="handleChangeModePage"
        >
          Kembali Masuk
        </b-button>
      </b-card>
    </b-row>
  </div>

</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BButton,
  BForm,
  BFormInput,
  BFormGroup,
  BCard,
  BCardTitle,
  BLink,
  BCardText,
  BInputGroup,
  BInputGroupAppend,
  BFormCheckbox,
  BAlert,
  VBTooltip,
  BSpinner,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import { $themeConfig } from '@themeConfig'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BButton,
    BForm,
    // BAlert,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userId: '',
      error: '',
      status: '',
      showResendEmailVerification: true,
      usernameEmail: '',
      password: '',
      loading: false,
      // validation rules
      required,
      email,
      custommessages: {
        required: 'Mohon masukan password Kamu.',
      },
      custommessages1: {
        required: 'Mohon masukan username atau email.',
      },

      messageResendEmailVerification: '',
      loadingResendVerification: false,

      countTimerEmail: 60,

      // Mode Page
      modeVerificationEmail: false,
      modeLogin: true,
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
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.loading = true
          this.showResendEmailVerification = false
          this.error = ''
          this.userId = ''

          useJwt
            .login({
              username_email: this.usernameEmail,
              password: this.password,
              login_from: 'website',
            })
            .then(response => {
              const { data } = response
              const user = data.data
              if (response.data.status === false) {
                this.error = 'Maaf, username atau password yang Kamu masukan salah'
                this.loading = false
              } else {
                useJwt.setToken(response.data.data.token)
                this.getUser(response.data.data)
              }
            })
            .catch(() => {
              this.$toast({
                component: ToastificationContentVue,
                props: {
                  title: 'Gagal',
                  text: 'Gagal untuk login, silahkan coba lagi!',
                  icon: 'AlertCircleIcon',
                  variant: 'danger',
                },
              })
              this.loading = false
            })
        }
      })
    },
    getUser(userData) {
      this.userId = userData.id
      // eslint-disable-next-line no-param-reassign
      // if (userData.email_verified_at !== null) userData.email_verified_at = null

      this.$http
        .post('/user/get-profile', {
          user_id: this.userId,
        })
        .then(async response => {
          let ability = []

          let { data } = response.data
          data = Array.isArray(data) ? data[0] : data
          const role = data.role_name.toUpperCase()

          if (!['ADMIN', 'MANAGEMENT', 'PARTNER', 'SDM', 'KOMSHIP MEMBER', 'TALENT GLOBAL'].includes(role)) {
            this.error = 'Akun anda tidak memiliki hak akses untuk masuk.'
            this.logout()
            return
          }

          if (['PARTNER', 'SDM'].includes(role)) {
            if (!userData.email_verified_at) {
              // eslint-disable-next-line operator-linebreak
              this.error =
                'Email Kamu belum terverifikasi'
              this.showResendEmailVerification = true
              this.logout()
              return
            }
          }

          switch (role) {
            case 'ADMIN':
              ability = [
                { action: 'read', subject: 'Dashboard' },
                { action: 'manage', subject: 'Training' },
                { action: 'manage', subject: 'Management' },
                { action: 'manage', subject: 'MasterData' },
                { action: 'manage', subject: 'Partner' },
                { action: 'manage', subject: 'Position' },
                { action: 'manage', subject: 'Talent' },
                { action: 'manage', subject: 'Training' },
                { action: 'manage', subject: 'Division' },
                { action: 'manage', subject: 'Invoice' },
                { action: 'manage', subject: 'Assignment' },
                { action: 'manage', subject: 'JobRoleSetting' },

                // Komship
                { action: 'manage', subject: 'Komship' },
                { action: 'manage', subject: 'Dashboard Komship Admin' },
                { action: 'manage', subject: 'Pencairan' },
                { action: 'manage', subject: 'Pendapatan' },
                { action: 'manage', subject: 'Membership Komship' },
                { action: 'manage', subject: 'Perkembangan Partner' },
                { action: 'manage', subject: 'Data Partner' },
                { action: 'manage', subject: 'Arsip Partner' },
                { action: 'manage', subject: 'Data Layanan' },
                { action: 'manage', subject: 'Ekspedisi' },
                { action: 'manage', subject: 'Biaya Ekspedisi' },
                { action: 'manage', subject: 'Performa' },
              ]
              break
            case 'MANAGEMENT':
              ability = [
                { action: 'read', subject: 'Dashboard' },
                { action: 'manage', subject: 'Training' },
                { action: 'manage', subject: 'Management' },
                { action: 'manage', subject: 'MasterData' },
                { action: 'manage', subject: 'Partner' },
                { action: 'manage', subject: 'Position' },
                { action: 'manage', subject: 'Talent' },
                { action: 'manage', subject: 'Training' },
                { action: 'manage', subject: 'Division' },
                { action: 'manage', subject: 'Invoice' },
                { action: 'manage', subject: 'Assignment' },
                { action: 'manage', subject: 'JobRoleSetting' },
              ]
              break
            case 'PARTNER':
              ability = [
                { action: 'manage', subject: 'Komship TalentPool' },
                { action: 'manage', subject: 'Komship Wishlist' },
                { action: 'manage', subject: 'PartnerProfile' },
                { action: 'read', subject: 'Dashboard Komship' },
                { action: 'manage', subject: 'Customer' },
                { action: 'manage', subject: 'Produk' },
                { action: 'manage', subject: 'Tambah Produk' },
                { action: 'manage', subject: 'Data Produk' },
                { action: 'manage', subject: 'Order' },
                { action: 'manage', subject: 'Tambah Order' },
                { action: 'manage', subject: 'Data Order' },
                { action: 'manage', subject: 'Pickup' },
                { action: 'manage', subject: 'Ajukan Pickup' },
                { action: 'manage', subject: 'History Pickup' },
                { action: 'manage', subject: 'Keuangan' },
                { action: 'manage', subject: 'Penghasilan' },
                { action: 'manage', subject: 'Saldo' },
                { action: 'manage', subject: 'Setting Komship' },
                { action: 'manage', subject: 'Setting Profile' },
                { action: 'manage', subject: 'Setting Access Account' },
                { action: 'manage', subject: 'Setting Pickup Address' },
                { action: 'manage', subject: 'Setting Rekening Bank' },
                { action: 'manage', subject: 'Setting PIN' },
                { action: 'manage', subject: 'Setting Ekspedisi' },
                { action: 'manage', subject: 'Hiring' },
                { action: 'manage', subject: 'Fitur Pendukung' },

                // Komplace
                // { action: 'manage', subject: 'Dashboard Komplace' },
                // { action: 'manage', subject: 'Monitoring' },
                // { action: 'manage', subject: 'Manajemen Admin' },
                // { action: 'manage', subject: 'Pengaturan Akun Komplace' },
              ]
              break
            case 'SDM':
              ability = [
                { action: 'read', subject: 'TalentHome' },
                { action: 'manage', subject: 'TalentProfile' },
              ]
              break
            case 'KOMSHIP MEMBER':
              ability = [
                { action: 'manage', subject: 'Dashboard Komship' },
              ]
              break
            case 'TALENT GLOBAL':
              ability = [
                { action: 'manage', subject: 'Dashboard Komship' },
              ]
              break
            default:
              break
          }

          if (role === 'PARTNER') {
            data = await this.getPartnerProfile(this.userId)

            if (data.nik) {
              ability.push({ action: 'manage', subject: 'DetailTalent' })
              ability.push({ action: 'manage', subject: 'Wishlist' })
            }
          }

          if (role === 'TALENT GLOBAL') {
            const itemMember = await this.getAccessKomship(data.id)
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < itemMember.length; x++) {
              if (itemMember[x].access !== 'No Data Access.') {
                if (itemMember[x].menu_name === 'ORDER') {
                  ability.push({ action: 'manage', subject: 'Order' })
                  // eslint-disable-next-line no-plusplus
                  for (let y = 0; y < itemMember[x].access.length; y++) {
                    if (itemMember[x].access[y].access_name === 'View') {
                      ability.push({ action: 'manage', subject: 'Data Order' })
                    }
                    if (itemMember[x].access[y].access_name === 'Create') {
                      ability.push({ action: 'manage', subject: 'Tambah Order' })
                    }
                  }
                }
                if (itemMember[x].menu_name === 'PRODUCT') {
                  ability.push({ action: 'manage', subject: 'Produk' })
                  // eslint-disable-next-line no-plusplus
                  for (let y = 0; y < itemMember[x].access.length; y++) {
                    if (itemMember[x].access[y].access_name === 'View') {
                      ability.push({ action: 'manage', subject: 'Data Produk' })
                    }
                    if (itemMember[x].access[y].access_name === 'Create') {
                      ability.push({ action: 'manage', subject: 'Tambah Produk' })
                    }
                  }
                }
                if (itemMember[x].menu_name === 'PICKUP') {
                  ability.push({ action: 'manage', subject: 'Pickup' })
                  // eslint-disable-next-line no-plusplus
                  for (let y = 0; y < itemMember[x].access.length; y++) {
                    if (itemMember[x].access[y].access_name === 'Submit Pickup') {
                      ability.push({ action: 'manage', subject: 'Ajukan Pickup' })
                    }
                    if (itemMember[x].access[y].access_name === 'Pickup History') {
                      ability.push({ action: 'manage', subject: 'History Pickup' })
                    }
                  }
                }
                if (itemMember[x].menu_name === 'FINANCE') {
                  ability.push({ action: 'manage', subject: 'Keuangan' })
                  // eslint-disable-next-line no-plusplus
                  for (let y = 0; y < itemMember[x].access.length; y++) {
                    if (itemMember[x].access[y].access_name === 'Income Data') {
                      ability.push({ action: 'manage', subject: 'Penghasilan' })
                    }
                    if (itemMember[x].access[y].access_name === 'Balance Data') {
                      ability.push({ action: 'manage', subject: 'Saldo' })
                    }
                  }
                }
                if (itemMember[x].menu_name === 'SETTING') {
                  ability.push({ action: 'manage', subject: 'Setting Komship' })
                  // eslint-disable-next-line no-plusplus
                  for (let y = 0; y < itemMember[x].access.length; y++) {
                    if (itemMember[x].access[y].access_name === 'Edit Profile') {
                      ability.push({ action: 'manage', subject: 'Setting Profile' })
                    }
                    if (itemMember[x].access[y].access_name === 'Account Access') {
                      ability.push({ action: 'manage', subject: 'Setting Access Account' })
                    }
                    if (itemMember[x].access[y].access_name === 'Pickup Address') {
                      ability.push({ action: 'manage', subject: 'Setting Pickup Address' })
                    }
                    if (itemMember[x].access[y].access_name === 'Bank Account') {
                      ability.push({ action: 'manage', subject: 'Setting Rekening Bank' })
                    }
                    if (itemMember[x].access[y].access_name === 'PIN') {
                      ability.push({ action: 'manage', subject: 'Setting PIN' })
                    }
                    if (itemMember[x].access[y].access_name === 'Expedition') {
                      ability.push({ action: 'manage', subject: 'Setting Ekspedisi' })
                    }
                  }
                }
              }
            }
          }

          data.ability = ability
          this.$ability.update(ability)

          localStorage.setItem('userData', JSON.stringify(data))
          this.$store.commit('auth/UPDATE_USER_DATA', data)

          this.$router
            .go(getHomeRouteForLoggedInUser(role))
            .then(() => {})
            .catch(error => {
              this.$refs.loginForm.setErrors(error.response.data.error)
              this.$toast({
                component: ToastificationContentVue,
                props: {
                  title: 'Failed',
                  text: error.response.data.error,
                  icon: 'AlertCircleIcon',
                  variant: 'danger',
                },
              })
            })
        })
        .finally(() => {
          this.loading = false
        })
    },
    resendEmailVerification() {
      this.loadingResendVerification = true
      this.showResendEmailVerification = true
      if (this.countTimerEmail !== 60) {
        this.countTimerEmail = 60
      }

      this.$http
        .get(`/resend_verification_email/${this.userId}`)
        .then(() => {
          this.error = ''
          this.loadingResendVerification = false
          this.modeLogin = false
          this.modeVerificationEmail = true
          this.countDownTimer()
        })
        .catch(() => {
          this.loadingResendVerification = false
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: 'Gagal',
              text: 'Gagal untuk login, silahkan coba lagi!',
              icon: 'AlertCircleIcon',
              variant: 'danger',
            },
          })
        })
    },
    getPartnerProfile(userId) {
      return this.$http
        .get(`/user/partner/get-profile/${userId}`)
        .then(response => response.data.data[0])
        .finally(() => {
          this.loading = false
        })
    },
    getAccessKomship(id) {
      const params = {
        user_id: id,
      }
      return this.$http.get('/user/partner/get-menu-komship-member', {
        params,
      }).then(response => response.data.data)
    },
    logout() {
      useJwt
        .logout({})
        .then(() => {
          // Remove userData from localStorage
          // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
          localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
          localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleChangeModePage() {
      this.modeVerificationEmail = false
      this.modeLogin = true
    },
    countDownTimer() {
      if (this.countTimerEmail > 0) {
        setTimeout(() => {
          this.countTimerEmail -= 1
          this.countDownTimer()
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
</style>
