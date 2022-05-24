/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BCard,
  BSpinner,
  BForm,
  BFormGroup,
  BInputGroup,
  BInputGroupAppend,
  BFormInput,
  BButton,
} from 'bootstrap-vue'
import {
  resetpasswordrequired,
  resetpasswordrules,
  resetconfirmpasswordrequired,
  resetpasswordconfirm,
} from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
// import store from '@/store/index'
import { $themeConfig } from '@themeConfig'

export default {
  components: {
    BCard,
    BButton,
    BForm,
    BFormGroup,
    BInputGroup,
    BFormInput,
    BSpinner,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      // error: '',
      passwordNew: '',
      confirmedPassword: '',
      resetpasswordrequired,
      resetpasswordrules,
      resetconfirmpasswordrequired,
      resetpasswordconfirm,
      status: '',
      loading: false,
      successChanged: false,
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
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    showmodal() {
      this.$refs['ubah-password'].toggle('#togggle-btn')
    },
    submit() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.loading = true
          // eslint-disable-next-line
          this.$http
            .post('/v1/partner/reset-password', {
              code: this.$route.query.code,
              password: this.passwordNew,
            })
            .then(() => {
              this.successChanged = true
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
  },
}
