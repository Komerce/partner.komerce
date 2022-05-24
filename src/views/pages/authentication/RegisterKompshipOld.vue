<template>
  <b-row>
    <b-col
      cols="6"
      class="wrapper-kompship-register"
    >
      <b-navbar-brand class="ml-4 mt-1">
        <b-img
          src="@core/assets/image/logo-komerce-no-tag.png"
          width="150"
        />
      </b-navbar-brand>
      <b-col
        md="12"
        class="pt-5 mt-3"
      >
        <b-col class="ml-3">
          <h3 class="ml-5 mb-2 register-title text-black">
            {{ serviceIsKomship === true ? 'Daftar Komship' : 'Daftar' }}
          </h3>

          <b-row :class="modeNewUser === true ? '' : 'd-none'">
            <validation-observer
              ref="loginForm"
              #default="{invalid}"
            >
              <b-form
                class="ml-5"
                @submit.prevent="register"
              >
                <b-row>
                  <!-- full name -->
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Nama Lengkap"
                      rules="required"
                    >
                      <b-form-input
                        id="fullname"
                        v-model="fullname"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.fullname ? false:null"
                        name="fullname"
                        required
                        @input="resetValidationUsername"
                      />
                      <label for="fullname">
                        Nama Lengkap
                      </label>
                      <small class="text-primary"> {{ errors[0] }} </small>
                      <small
                        v-if="usernameTaken"
                        class="text-primary"
                      >
                        {{ usernameTaken }}
                      </small>
                    </validation-provider>
                  </b-col>

                  <!-- Nomer -->
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Nomor Handphone"
                      rules="required"
                    >
                      <b-form-input
                        id="nomorhp"
                        v-model="nomorHandphone"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.fullname ? false:null"
                        name="nomorhp"
                        type="number"
                        required
                        @input="validateNoHp"
                      />
                      <label for="fullname">
                        Nomor Handphone
                      </label>
                      <b-row>
                        <b-col>
                          <small class="text-primary"> {{ errors[0] }} </small>
                        </b-col>
                      </b-row>
                      <small class="text-primary"> {{ messageValidateNo !== '' ? messageValidateNo : '' }} </small>
                    </validation-provider>
                  </b-col>

                  <!-- email -->
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Email"
                      rules="required|email"
                    >
                      <b-form-input
                        id="emailUser"
                        v-model="userEmail"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.email ? false:null"
                        required
                        @input="resetValidationEmail"
                      />
                      <label for="emailUser">
                        Email
                      </label>
                      <small class="text-primary"> {{ errors[0] }} </small>
                      <small
                        v-if="emailTaken"
                        class="text-primary"
                      >
                        {{ emailTaken }}
                      </small>
                    </validation-provider>
                  </b-col>

                  <!-- password -->
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{errors}"
                      name="Password"
                      vid="password"
                      rules="required"
                    >
                      <b-form-input
                        id="password"
                        v-model="userPassword"
                        class="bg-light"
                        :type="passwordFieldTypePassword"
                        :state="errors.length > 0 ? false:null"
                        required
                        @input="validPassword"
                      />
                      <label for="password">Password</label>
                      <feather-icon
                        :icon="passwordToggleIconPassword"
                        class="icon-password"
                        @click="togglePasswordVisibilityPassword"
                      />
                      <small
                        class="text-primary"
                      >{{ errors[0] }}
                      </small>
                      <small
                        class="text-primary"
                      >{{ errorCharPassword }}
                      </small>
                    </validation-provider>
                  </b-col>
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{errors}"
                      name="Konfirmasi Password"
                      vid="password"
                      rules="required"
                    >
                      <b-form-input
                        id="confirm-password"
                        v-model="confirmPassword"
                        :class="confirmPassword !== confirmPassword ? 'is-invalid' : 'bg-light'"
                        :type="passwordFieldTypeConfirmPassword"
                        :state="errors.length > 0 || submitErrors.password ? false:null"
                        required
                      />
                      <label for="confirm-password">Confirm Password</label>
                      <feather-icon
                        :icon="passwordToggleIconConfirmPassword"
                        class="icon-password"
                        @click="togglePasswordVisibilityConfirmPassword(togglePasswordVisibility)"
                      />
                      <small class="text-primary">{{ errors[0] }}</small>
                    </validation-provider>

                    <b-form-group v-if="confirmPassword !== userPassword">
                      <small class="text-primary">*Pastikan konfirmasi password sama dengan password sebelumnya</small>
                    </b-form-group>
                  </b-col>

                  <!-- checkbox -->
                  <b-col cols="12">
                    <b-form-group>
                      <validation-provider
                        #default="{errors}"
                        rules="required"
                      >
                        <b-form-checkbox
                          v-model="agree"
                          :state="errors.length > 0 || submitErrors.agree ? false:null"
                          required
                        >
                          <p class="text-black">
                            Saya setuju dengan
                            <a
                              href="https://komship.id/terms"
                              target="_blank"
                              class="text-black underline decoration-1"
                            >
                              syarat dan ketentuan Komship
                            </a>
                          </p>
                        </b-form-checkbox>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <!-- submit -->
                  <b-col
                    cols="12"
                    class="px-0"
                  >
                    <b-col md="7">
                      <div class="demo-inline-spacing">
                        <b-button
                          type="submit"
                          variant="primary"
                          block
                          :disabled="invalid || agree === false || confirmPassword !== userPassword || userPassword.length < 8 || nomorHandphone.length < 8"
                        >
                          <b-spinner
                            v-if="loading"
                            small
                          />
                          Daftar
                        </b-button>
                      </div>
                    </b-col>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
          </b-row>

          <!-- Existing User -->
          <b-row :class="modeExistingUser === true ? '' : 'd-none'">
            <validation-observer
              ref="loginFormExisting"
              #default="{invalid}"
            >
              <b-form
                class="ml-5"
                @submit.prevent="registerExisting"
              >
                <b-row>
                  <!-- email -->
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Email"
                      rules="required|email"
                    >
                      <b-form-input
                        id="emailUser"
                        v-model="userEmailExisting"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.email ? false:null"
                        required
                        @input="resetValidationEmail"
                      />
                      <label for="emailUser">
                        Email
                      </label>
                      <small class="text-primary"> {{ errors[0] }} </small>
                      <b-row class="mt-50">
                        <b-col>
                          <div v-if="serviceIsKomship === false">
                            <small>
                              Akun Kamu telah terdaftar di layanan Komerce <strong>{{ serviceTitle }}</strong>.
                            </small>
                            <br>
                            <small>
                              Cukup gunakan email yang sama dengan layanan yang pernah kamu pakai untuk melanjutkan pendaftaran
                            </small>
                          </div>
                          <div v-else>
                            <small>
                              Akun Kamu telah terdaftar di layanan Komerce Komship.
                              Silahkan "Masuk" untuk melanjutkan.
                            </small>
                          </div>
                        </b-col>
                      </b-row>
                    </validation-provider>
                  </b-col>

                  <!-- checkbox -->
                  <b-col
                    cols="12"
                    :class="serviceIsKomship === true ? 'd-none' : ''"
                  >
                    <b-form-group>
                      <validation-provider
                        #default="{errors}"
                        rules="required"
                      >
                        <b-form-checkbox
                          v-model="agree"
                          :state="errors.length > 0 || submitErrors.agree ? false:null"
                          required
                        >
                          <p class="text-black">
                            Saya setuju dengan
                            <a
                              href="https://komship.id/terms"
                              target="_blank"
                              class="text-black underline decoration-1"
                            >
                              syarat dan ketentuan Komship
                            </a>
                          </p>
                        </b-form-checkbox>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <!-- submit -->
                  <b-col
                    cols="12"
                    class="px-0"
                  >
                    <b-col md="7">
                      <div
                        v-if="serviceIsKomship === false"
                        class="demo-inline-spacing"
                      >
                        <b-button
                          type="submit"
                          variant="primary"
                          block
                          :disabled="invalid || agree === false"
                        >
                          <b-spinner
                            v-if="loading"
                            small
                          />
                          Daftar
                        </b-button>
                      </div>
                      <div v-else>
                        <b-button
                          variant="primary"
                          block
                          tag="router-link"
                          :to="{name:'auth-login'}"
                        >
                          <b-spinner
                            v-if="loading"
                            small
                          />
                          Masuk
                        </b-button>
                      </div>
                    </b-col>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
          </b-row>
        </b-col>
      </b-col>
    </b-col>
    <b-col
      cols="6"
      class="wrapper-preview-dashboard-kompship d-flex justify-content-center align-items-center"
    >
      <b-img
        src="@core/assets/image/prev-dash.png"
      />
    </b-col>

    <!-- Mobile -->
    <b-col
      cols="12"
      class="wrapper-register-mobile bg-white h-screen"
    >
      <b-navbar-brand class="mt-1">
        <b-img
          src="@core/assets/image/logo-komerce-no-tag.png"
          width="150"
        />
      </b-navbar-brand>
      <b-col
        md="12"
        class="pt-5"
      >
        <b-col class="">
          <h3 class="mb-2 register-title">
            Daftar
          </h3>

          <b-row :class="modeNewUser === true ? '' : 'd-none'">
            <validation-observer
              ref="loginForm"
              #default="{invalid}"
            >
              <b-form
                class=""
                @submit.prevent="register"
              >
                <b-row>
                  <!-- full name -->
                  <b-col
                    cols="12"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Nama Lengkap"
                      rules="required"
                    >
                      <b-form-input
                        id="fullname"
                        v-model="fullname"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.fullname ? false:null"
                        name="fullname"
                        required
                        @input="resetValidationUsername"
                      />
                      <label for="fullname">
                        Nama Lengkap
                      </label>
                      <small class="text-primary"> {{ errors[0] }} </small>
                      <small
                        v-if="usernameTaken"
                        class="text-primary"
                      >
                        {{ usernameTaken }}
                      </small>
                    </validation-provider>
                  </b-col>

                  <!-- Nomer -->
                  <b-col
                    cols="12"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Nomor Handphone"
                      rules="required"
                    >
                      <b-form-input
                        id="nomorhp"
                        v-model="nomorHandphone"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.fullname ? false:null"
                        name="nomorhp"
                        type="number"
                        required
                        @input="validateNoHp"
                      />
                      <label for="fullname">
                        Nomor Handphone
                      </label>
                      <b-row>
                        <b-col>
                          <small class="text-primary"> {{ errors[0] }} </small>
                        </b-col>
                      </b-row>
                      <small class="text-primary"> {{ messageValidateNo !== '' ? messageValidateNo : '' }} </small>
                    </validation-provider>
                  </b-col>

                  <!-- email -->
                  <b-col
                    cols="12"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Email"
                      rules="required|email"
                    >
                      <b-form-input
                        id="emailUser"
                        v-model="userEmail"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.email ? false:null"
                        required
                        @input="resetValidationEmail"
                      />
                      <label for="emailUser">
                        Email
                      </label>
                      <small class="text-primary"> {{ errors[0] }} </small>
                      <small
                        v-if="emailTaken"
                        class="text-primary"
                      >
                        {{ emailTaken }}
                      </small>
                    </validation-provider>
                  </b-col>

                  <!-- password -->
                  <b-col
                    cols="12"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{errors}"
                      name="Password"
                      vid="password"
                      rules="required"
                    >
                      <b-form-input
                        id="password"
                        v-model="userPassword"
                        class="bg-light"
                        :type="passwordFieldTypePassword"
                        :state="errors.length > 0 ? false:null"
                        required
                        @input="validPassword"
                      />
                      <label for="password">Password</label>
                      <feather-icon
                        :icon="passwordToggleIconPassword"
                        class="icon-password"
                        @click="togglePasswordVisibilityPassword"
                      />
                      <small
                        class="text-primary"
                      >{{ errors[0] }}
                      </small>
                      <small
                        class="text-primary"
                      >{{ errorCharPassword }}
                      </small>
                    </validation-provider>
                  </b-col>
                  <b-col
                    cols="12"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{errors}"
                      name="Konfirmasi Password"
                      vid="password"
                      rules="required"
                    >
                      <b-form-input
                        id="confirm-password"
                        v-model="confirmPassword"
                        :class="confirmPassword !== confirmPassword ? 'is-invalid' : 'bg-light'"
                        :type="passwordFieldTypeConfirmPassword"
                        :state="errors.length > 0 || submitErrors.password ? false:null"
                        required
                      />
                      <label for="confirm-password">Confirm Password</label>
                      <feather-icon
                        :icon="passwordToggleIconConfirmPassword"
                        class="icon-password"
                        @click="togglePasswordVisibilityConfirmPassword(togglePasswordVisibility)"
                      />
                      <small class="text-primary">{{ errors[0] }}</small>
                    </validation-provider>

                    <b-form-group v-if="confirmPassword !== userPassword">
                      <small class="text-primary">*Pastikan konfirmasi password sama dengan password sebelumnya</small>
                    </b-form-group>
                  </b-col>

                  <!-- checkbox -->
                  <b-col cols="12">
                    <b-form-group>
                      <validation-provider
                        #default="{errors}"
                        rules="required"
                      >
                        <b-form-checkbox
                          v-model="agree"
                          :state="errors.length > 0 || submitErrors.agree ? false:null"
                          required
                        >
                          Saya setuju dengan syarat dan ketentuan Komship
                        </b-form-checkbox>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <!-- submit -->
                  <b-col
                    cols="12"
                    class="px-0"
                  >
                    <b-col md="7">
                      <div class="demo-inline-spacing">
                        <b-button
                          type="submit"
                          variant="primary"
                          block
                          :disabled="invalid || agree === false || confirmPassword !== userPassword || userPassword.length < 8 || nomorHandphone.length < 8"
                        >
                          <b-spinner
                            v-if="loading"
                            small
                          />
                          Daftar
                        </b-button>
                      </div>
                    </b-col>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
          </b-row>

          <!-- Existing User -->
          <b-row :class="modeExistingUser === true ? '' : 'd-none'">
            <validation-observer
              ref="loginFormExisting"
              #default="{invalid}"
            >
              <b-form
                @submit.prevent="registerExisting"
              >
                <b-row>
                  <!-- email -->
                  <b-col
                    cols="9"
                    class="mb-1"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Email"
                      rules="required|email"
                    >
                      <b-form-input
                        id="emailUser"
                        v-model="userEmailExisting"
                        class="bg-light"
                        :state="errors.length > 0 || submitErrors.email ? false:null"
                        required
                        @input="resetValidationEmail"
                      />
                      <label for="emailUser">
                        Email
                      </label>
                      <small class="text-primary"> {{ errors[0] }} </small>
                      <b-row class="mt-50">
                        <b-col>
                          <div v-if="serviceIsKomship === false">
                            <small>
                              Akun Kamu telah terdaftar di layanan Komerce <strong>{{ serviceTitle }}</strong>.
                            </small>
                            <br>
                            <small>
                              Cukup gunakan email yang sama dengan layanan yang pernah kamu pakai untuk melanjutkan pendaftaran
                            </small>
                          </div>
                          <div v-else>
                            <small>
                              Akun Kamu telah terdaftar di layanan Komerce Komship.
                              Silahkan "Masuk" untuk melanjutkan.
                            </small>
                          </div>
                        </b-col>
                      </b-row>
                    </validation-provider>
                  </b-col>

                  <!-- checkbox -->
                  <b-col
                    cols="12"
                    :class="serviceIsKomship === true ? 'd-none' : ''"
                  >
                    <b-form-group>
                      <validation-provider
                        #default="{errors}"
                        rules="required"
                      >
                        <b-form-checkbox
                          v-model="agree"
                          :state="errors.length > 0 || submitErrors.agree ? false:null"
                          required
                        >
                          <p class="text-black">
                            Saya setuju dengan
                            <a
                              href="https://komship.id/terms"
                              target="_blank"
                              class="text-black underline decoration-1"
                            >
                              syarat dan ketentuan Komship
                            </a>
                          </p>
                        </b-form-checkbox>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <!-- submit -->
                  <b-col
                    cols="12"
                    class="px-0"
                  >
                    <b-col md="7">
                      <div
                        v-if="serviceIsKomship === false"
                        class="demo-inline-spacing"
                      >
                        <b-button
                          type="submit"
                          variant="primary"
                          block
                          :disabled="invalid || agree === false"
                        >
                          <b-spinner
                            v-if="loading"
                            small
                          />
                          Daftar
                        </b-button>
                      </div>
                      <div v-esle>
                        <b-button
                          variant="primary"
                          block
                          tag="router-link"
                          :to="{name:'auth-login'}"
                        >
                          <b-spinner
                            v-if="loading"
                            small
                          />
                          Masuk
                        </b-button>
                      </div>
                    </b-col>
                  </b-col>
                </b-row>
              </b-form>
            </validation-observer>
          </b-row>
        </b-col>
      </b-col>
    </b-col>
  </b-row>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { required, email } from '@validations'
import httpKomship from '@/views/pages/komship/setting-kompship/http_komship'
import {
  BCol,
  BNavbarBrand,
  BImg,
  BRow,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BSpinner,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCol,
    BNavbarBrand,
    BImg,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    ValidationObserver,
    ValidationProvider,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      agree: false,
      fullname: '',
      nomorHandphone: '',
      userEmail: '',
      userPassword: '',
      confirmPassword: '',
      loading: false,

      submitErrors: '',

      required,
      email,

      passwordFieldTypePassword: 'password',
      passwordFieldTypeConfirmPassword: 'password',

      errorCharPassword: '',

      usernameTaken: '',
      emailTaken: '',

      data: [],

      // Existing
      userEmailExisting: '',
      modeNewUser: true,
      modeExistingUser: false,
      serviceTitle: '',
      serviceIsKomship: false,

      messageValidateNo: '',
    }
  },
  computed: {
    passwordToggleIconPassword() {
      return this.passwordFieldTypePassword === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    passwordToggleIconConfirmPassword() {
      return this.passwordFieldTypeConfirmPassword === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    register() {
      this.loading = true
      this.usernameTaken = ''
      this.emailTaken = ''
      this.serviceTitle = ''
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.error = ''

          httpKomship.post('/v1/register', {
            full_name: this.fullname,
            no_hp: this.nomorHandphone,
            email: this.userEmail,
            password: this.userPassword,
            password_confirmation: this.confirmPassword,
          }).then(response => {
            const { data } = response
            if (data.message === 'Akun Kamu telah terdaftar Komerce Hiring') {
              this.emailTaken = 'The email has already been taken.'
              this.loading = false
              this.modeNewUser = false
              this.modeExistingUser = true
              this.userEmailExisting = this.userEmail
              this.serviceTitle = 'Hiring Talent'
              this.agree = false
            } else if (data.message === 'Akun Kamu telah terdaftar Komship') {
              this.emailTaken = 'The email has already been taken.'
              this.loading = false
              this.modeNewUser = false
              this.modeExistingUser = true
              this.userEmailExisting = this.userEmail
              this.serviceTitle = 'Komship'
              this.agree = false
              this.serviceIsKomship = true
            }

            if (data.code !== 400) {
              this.loading = false
              this.$router.push({ name: 'komship-register-validate' })
            }
            this.loading = false
          }).catch(() => {
            this.$toast({
              component: ToastificationContentVue,
              props: {
                title: 'Gagal',
                text: 'Gagal untuk register, silahkan coba lagi!',
                icon: 'AlertCircleIcon',
                variant: 'danger',
              },
            }, 2000)
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    togglePasswordVisibilityPassword() {
      if (this.passwordFieldTypePassword === 'password') {
        this.passwordFieldTypePassword = 'text'
      } else if (this.passwordFieldTypePassword === 'text') {
        this.passwordFieldTypePassword = 'password'
      }
    },
    togglePasswordVisibilityConfirmPassword() {
      if (this.passwordFieldTypeConfirmPassword === 'password') {
        this.passwordFieldTypeConfirmPassword = 'text'
      } else if (this.passwordFieldTypeConfirmPassword === 'text') {
        this.passwordFieldTypeConfirmPassword = 'password'
      }
    },
    validPassword() {
      if (this.userPassword.length < 8) {
        this.errorCharPassword = '*Minimal 8 karakter'
      } else {
        this.errorCharPassword = ''
      }
    },
    resetValidationUsername() {
      this.usernameTaken = ''
    },
    resetValidationEmail() {
      this.emailTaken = ''
    },
    registerExisting() {
      this.loading = true
      this.$refs.loginFormExisting.validate().then(success => {
        if (success) {
          this.$http.put('/register/partner-existing', {
            email: this.userEmailExisting,
          }).then(() => {
            this.loading = false
            this.$router.push({ name: 'komship-register-validate' })
          }).catch(() => {
            this.loading = false
            this.$toast({
              component: ToastificationContentVue,
              props: {
                title: 'Gagal',
                text: 'Gagal untuk register, silahkan coba lagi!',
                icon: 'AlertCircleIcon',
                variant: 'danger',
              },
            })
          })
        } else {
          this.loading = false
        }
      })
    },
    validateNoHp() {
      if (this.nomorHandphone.length < 8) {
        this.messageValidateNo = 'Nomor handphone minimal 8 digit'
      } else {
        this.messageValidateNo = ''
      }
    },
  },
}
</script>

<style scoped>

[dir] .wrapper-kompship-register {
  background-color: #FFFFFF;
}

[dir] .wrapper-preview-dashboard-kompship {
  background: linear-gradient(147.38deg, rgba(231, 233, 242, 0.76) 0%, rgba(203, 206, 219, 0) 100%);
}

.register-title{
  font-weight: 600;
  font-size: 24px;
}
[dir] .input-group-text{
  background-color: #f6f6f6;
  border-radius: 13px;
}
[dir] .form-control{
  border-radius: 13px;
  box-shadow: unset;
  height: 50px;
  padding-bottom: 0;
  color: #222222;
}
[dir] .is-invalid{
  background-color: #FFEDED!important;
  background-image: unset!important;
}
[dir] .form-control:focus{
  background-color: #FFFFFF!important;
  border: 1.5px solid #FF6A3A;
  box-shadow: unset;
}
[dir] label {
    position: absolute;
    top: 13px;
    padding-left: 15px;
    z-index: 99999;
    font-size: 1.1rem;
    font-weight: 500;
    color: #828282;
    transition: 0.2s;
}
[dir] .icon-password{
  position: absolute;
  top: 16px;
  font-size: 1.1rem;
  right: 25px;
}
[dir] .form-control:focus ~ label, .form-control:valid ~ label{
  top: 5px;
  font-size: 0.7rem;
  color: #828282;
}
[dir] .form-control:focus ~ .input-group-text{
  background-color: #FFFFFF!important;
}

  /* Responsive */
  @media only screen and (max-width: 991px) {
    [dir] .wrapper-preview-dashboard-kompship {
      display: none !important;
    }
    [dir] .wrapper-kompship-register {
      display: none !important;
    }
  }
  @media only screen and (min-width: 992px) {
    [dir] .wrapper-register-mobile {
      display: none !important;
    }
  }
</style>
