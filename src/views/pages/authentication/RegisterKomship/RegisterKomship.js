import { ValidationObserver, ValidationProvider } from 'vee-validate'
import ToastificationContentVue from '@/@core/components/toastification/ToastificationContent.vue'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { required, email } from '@validations'
import { kirimEmailConfig } from '@/libs/helpers'
import CryptoJS from 'crypto-js'
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
      generateTokenKirimEmail: '',

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
    generateToken() {
      const timestamp = Math.floor(Date.now() / 1000)
      const unixtimestamp = timestamp
      const toHash = `${kirimEmailConfig.username}::${kirimEmailConfig.token}::${unixtimestamp}`
      console.log('toHash :', toHash)
      const hash = CryptoJS.HmacSHA256(toHash, kirimEmailConfig.token)
      const generatedtoken = hash.toString(CryptoJS.enc.Hex)
      console.log('generatedtoken :', generatedtoken)
      this.generateTokenKirimEmail = generatedtoken
      return generatedtoken
    },
    subscribeKirimEmail() {
      // this.generateToken()
      const timestamp = Math.floor(Date.now() / 1000)
      const unixtimestamp = timestamp
      const toHash = `${kirimEmailConfig.username}::${kirimEmailConfig.token}::${unixtimestamp}`
      // console.log('toHash :', toHash)
      const hash = CryptoJS.HmacSHA256(toHash, kirimEmailConfig.token)
      const generatedtoken = hash.toString(CryptoJS.enc.Hex)
      // console.log('generatedtoken :', generatedtoken)

      // set header
      const myHeaders = new Headers()
      myHeaders.append('Access-Control-Allow-Origin', '*')
      // myHeaders.append('Access-Control-Allow-Headers', 'Content-Type')
      myHeaders.append('Auth-Id', kirimEmailConfig.username)
      myHeaders.append('Auth-Token', generatedtoken)
      myHeaders.append('Timestamp', unixtimestamp)
      // myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
      // myHeaders.append('Cookie', 'PHPSESSID=fc5880d9ac9d8ed65f6b2feedd61eeac')

      // set body request
      const urlencoded = new URLSearchParams()
      urlencoded.append('lists', '19')
      urlencoded.append('full_name', this.fullname)
      urlencoded.append('email', this.userEmail)
      // urlencoded.append('full_name', 'asdasmdkamsd akmsdkmasd')
      // urlencoded.append('email', 'masdkas@mail.com')

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow',
      }
      // calling api
      fetch('https://api.kirim.email/v3/subscriber', requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
    },
    register() {
      this.loading = true
      this.usernameTaken = ''
      this.emailTaken = ''
      this.serviceTitle = ''
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          this.error = ''
          this.subscribeKirimEmail()
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
          }).then(response => {
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