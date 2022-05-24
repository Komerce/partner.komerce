<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <b-card class="text-white mt-2">
        <b-link class="brand-logo text-center">
          <b-link class="brand-logo d-none d-lg-flex text-center">
            <b-img
              :src="appLogoImage"
              alt="logo"
              class="flat-image-dark text-center"
              style="width: 216px; text-align:center;"
            />
          </b-link>
        </b-link>
        <b-card-title class="mb-1 text-center">
          Ubah Password
        </b-card-title>
        <b-card-title class="mb-1 text-center">
          Masukkan password Kamu
        </b-card-title>

        <validation-observer ref="simpleRules">
          <b-form
            class="auth-reset-password-form mt-2"
            @submit.prevent="submit"
          >
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
                      />
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
            </b-form-group>

            <!-- confirm password -->
            <b-form-group
              label-for="reset-password-confirm"
              label="Konfirmasi Password baru"
            >
              <validation-provider
                #default="{ errors }"
                name="Confirm Password"
                rules="required|password"
                :custom-messages="custommessages4"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0"
                >
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="cPassword"
                    :type="password2FieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="reset-password-confirm"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              block
              type="submit"
              variant="primary"
              @click="showmodal"
            >
              buat password
            </b-button>
          </b-form>
        </validation-observer>
        <b-modal
          ref="ubah-password"
          hide-footer
          modal-class="modal-dark"
          centered
        >
          <b-col
            md="12"
            class="d-flex justify-content-center pt-3"
          >
            <b-img
              width="100"
              src="@core/assets/image/iconsquare-popup-success.png"
            />
          </b-col>

          <b-col class="text-center mt-1">
            <h4 class="text-black">
              <strong>
                Password telah berhasil diubah.
              </strong>
            </h4>
          </b-col>
          <b-button
            type="submit"
            variant="primary"
            block
            :to="{name:'auth-login'}"
            @click="submit"
          >
            Kembali Masuk
          </b-button>
        </b-modal>
      </b-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BCard, BCardTitle, BForm, BFormGroup, BInputGroup, BInputGroupAppend, BLink, BFormInput, BButton,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BCard,
    BButton,
    BCardTitle,
    BForm,
    BFormGroup,
    BInputGroup,
    BLink,
    BFormInput,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      // error: '',
      cPassword: '',
      status: '',
      loading: false,
      custommessages4: {
        required: 'Mohon masukkan password',
        password: '',
      },
      custommessages5: {
        required: 'Mohon masukkan password',
        password: 'pasword tidak sama',
      },
      // validation rules
      passwordFieldType: 'password',
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
    password1ToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    showmodal() {
      this.$refs['ubah-password'].toggle('#togggle-btn')
    },
    togglePassword2Visibility() {
      this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password'
    },
    togglePassword1Visibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    submit() {
      this.$refs.changepassword.validate().then(success => {
        if (success) {
          this.loading = true
          this.error = ''

          useJwt.changepassword({
            password: this.password,
            cPassword: this.cPassword,
          })
            .then(response => {
              if (response.data.status === false) {
                this.error = response.data.message
                this.loading = false
                this.password = 'testing'
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
