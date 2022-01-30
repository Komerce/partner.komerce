<template>
  <div class="auth-wrapper auth-v1 px-2">
    <b-row class="auth-inner m-0">
      <b-card class="text-white mt-2">
        <b-link class="brand-logo">
          <b-link class="brand-logo d-none d-lg-flex text-center">
            <b-img
              :src="appLogoImage"
              alt="logo"
              class="flat-image-dark text-center"
              style="width: 216px"
            />
          </b-link>

        </b-link>
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
                :custom-messages="custommessages"
              >
                <div>
                  <b-alert
                    variant="danger"
                    :hidden="!!error"
                  >
                    <div class="alert-body">
                      <b-link
                        v-if="showResendEmailVerification"
                        class="ml-50"
                        @click="resendEmailVerification"
                      >
                        <u>Kirim ulang</u>
                      </b-link>
                    </div>
                  </b-alert>
                </div>
                <b-form-input
                  id="login-email"
                  v-model="usernameEmail"
                  :state="errors.length > 0 ? false : null"
                  name="login-email"
                  placeholder="john@mail.com"
                />
                <small class="text-danger">{{ errors[0] }} </small>
                <div>
                  <small
                    v-if="emailverifikasi"
                    class="text-danger"
                  >
                    {{ emailverifikasi }}
                  </small>
                </div>
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
                :custom-messages="custommessages4"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid' : null"
                >
                  <b-alert
                    variant="danger"
                    :hidden="!!error"
                  >
                    <div class="alert-body">
                      <b-link
                        v-if="showResendEmailVerification"
                        class="ml-50"
                        @click="resendEmailVerification"
                      >
                        <u>Kirim ulang </u>
                      </b-link>
                    </div>
                  </b-alert>
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
                  <small style="margin-right:50px;">Lupa Password?</small>
                </b-link>
              </div>
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
  BAlert,
  VBTooltip,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
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
    BAlert,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    // BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userId: '',
      emailverifikasi: '',
      error: '',
      errorcharemail: '',
      status: '',
      showResendEmailVerification: true,
      usernameEmail: '',
      custommessages1: {
        message: 'tes',

      },
      password: '',
      loading: false,
      // validation rules
      required,
      // email,
      custommessages: {
        required: 'Mohon masukan username atau email.',
        email: '',
      },
      custommessages4: {
        required: 'Mohon masukan password Kamu.',
      },
    }
  },
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app

    return {
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
    // validasiemail() {
    //   if (this.errors === 'masukkan email anda saat ini') {
    //     this.error = 'Maaf, username atau password yang Kamu masukan salah.'
    //   } else {
    //     this.error = 'masukkan email anda'
    //   }
    // },
    login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.loading = true
          this.showResendEmailVerification = true
          this.emailverifikasi = ''
          this.userId = ''

          useJwt
            .login({
              username_email: this.usernameEmail,
              password: this.password,
              login_from: 'website',
            })
            .then(response => {
              if (response.data.status === false) {
                this.error = response.data.message
                this.loading = false
                this.emailverifikasi = 'Maaf, username atau password yang Kamu masukan salah.'
              } else {
                useJwt.setToken(response.data.data.token)
                this.getUser(response.data.data)
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    getUser(userData) {
      this.userId = userData.id

      this.$http
        .post('/user/get-profile', {
          user_id: this.userId,
        })
        .then(async response => {
          let ability = []

          let { data } = response.data
          data = Array.isArray(data) ? data[0] : data
          const role = data.role_name.toUpperCase()

          if (!['ADMIN', 'MANAGEMENT', 'PARTNER', 'SDM', 'KOMSHIP MEMBER'].includes(role)) {
            this.error = 'Akun anda tidak memiliki hak akses untuk masuk.'
            this.logout()
            return
          }

          if (['PARTNER', 'SDM'].includes(role)) {
            if (!userData.email_verified_at) {
              // eslint-disable-next-line operator-linebreak
              this.error =
                'Email belum terverifikasi, harap periksa email Anda.'
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

          if (role === 'KOMSHIP MEMBER') {
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
            })
        })
        .finally(() => {
          this.loading = false
        })
    },
    resendEmailVerification() {
      this.showResendEmailVerification = true
      this.error = true
      this.error = 'Maaf, username atau password yang Kamu masukan salah'
      this.$http
        .get(`/resend_verification_email/${this.userId}`)
        .then(() => {
          this.userId = ''
          this.$swal({
            title: 'Terkirim',
            text: 'Harap periksa email anda untuk verifikasi akun Anda.',
            icon: 'success',
            confirmButtonText: 'Mengerti',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          })
        })
        .catch(() => {})
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
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/pages/page-auth.scss';
</style>
