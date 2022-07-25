import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormRadioGroup,
  BFormTextarea,
  BFormFile,
  BAvatar,
  BSpinner,
  BOverlay,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { required, email } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { heightTransition } from '@core/mixins/ui/transition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import PincodeInput from 'vue-pincode-input'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BFormRadioGroup,
    BFormTextarea,
    vSelect,
    BFormFile,
    BAvatar,
    ValidationObserver,
    ValidationProvider,
    BSpinner,
    BOverlay,
    PincodeInput,
  },
  directives: {
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {
      loading: false,
      loadingSubmit: false,

      id: null,

      fullname: '',
      username: '',
      jenisKelamin: null,
      noHP: '',
      emailUser: '',
      address: '',

      imageFile: null,
      imageInitialFile: null,

      nameBusiness: '',
      phoneBusiness: '',
      location: '',
      sektorBusiness: '',
      typeBusiness: '',

      options: [
        {
          text: 'Laki-laki', value: 1,
        },
        {
          text: 'Perempuan', value: 2,
        },
      ],

      partnerCategoryItems: [],
      businessTypeItems: [],

      provinceItems: [],

      fieldLogoBusiness: [],

      cityCode: null,
      cityCodeValue: null,

      // Validation
      required,
      email,

      messageErrorLengthNameBusiness: false,
      messageErrorPhone: false,

      // Modal Edit
      editMode: '',
      modalTitle: '',
      modalSubtitle: '',
      modalFormLabel: '',
      modalEditFormInputType: '',
      formInputEditItem: '',
      formInputEditItemPaste: '',
      formInputEditItemPasteMode: false,
      usernameCheckPasswword: this.$store.state.auth.userData.username,

      itemEyeIcon: 'EyeOffIcon',
      labelSubmit: '',

      actionSubmit: '',

      // Validation Edit
      messageErrorPassword: false,
      successConfirmPassword: false,

      errorOtp: false,

      // Modal Success Verification
      otpConfirmation: '',
      successVerificationTitle: '',
      descriptionSuccessVerification: '',

      userData: this.$store.state?.auth?.userData,

      errorNoHp: false,

      loadingEdit: false,
      rulesFormInput: required,
      messageErrorEmail: null,
      nameLabelEdit: '',

      emailSamePrevious: false,
      countOtp: 60,
      resendOtp: false,
      loadingOtp: false,
      messageErrorUsernameIsSame: false,
    }
  },
  mounted() {
    this.loadProfile()
    this.loadPartnerCategory()
    this.loadBusinessType()
    this.loadAllProvince()
    console.log(this.userData)
  },
  methods: {
    removeLogoBusiness() {
      this.imageFile = null
      this.imageInitialFile = null
      this.fieldLogoBusiness.splice(0, 1)
    },
    tesChange() {
      this.fieldLogoBusiness.splice(0, 1)
      this.fieldLogoBusiness.push({ logo: '' })
    },
    async updateProfile() {
      await this.loadAllProvince()
      this.loadingSubmit = true
      this.$refs.formRules.validate().then(success => {
        if (success) {
          if (this.imageInitialFile !== '' && this.imageInitialFile !== null) {
            if (this.imageInitialFile.includes('http')) {
              this.imageInitialFile = ''
            }
          }
          const formData = new FormData()
          formData.append('id', this.id)
          formData.append('username', this.username)
          formData.append('full_name', this.fullname)
          formData.append('no_hp', this.noHP)
          formData.append('no_hp_business', this.phoneBusiness)
          formData.append('address', this.address)
          formData.append('gender', this.jenisKelamin)
          if (this.imageInitialFile !== null && this.imageFile === null) {
            formData.append('business_logo', this.imageInitialFile)
          } else if (this.imageFile !== null) {
            formData.append('business_logo', this.imageFile)
          } else {
            formData.append('business_logo', '')
          }
          formData.append('brand_name', this.nameBusiness)
          formData.append('partner_category_name', this.sektorBusiness)
          formData.append('business_type_id', this.typeBusiness)
          formData.append('business_location', String(this.address))
          formData.append('email', this.emailUser)
          if (this.cityCodeValue !== null) {
            formData.append('city_code', this.cityCodeValue)
          }
          this.$http.post('/user/partner/update-profile-komship', formData).then(() => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Success update profile',
                variant: 'success',
              },
            })
            this.loadingSubmit = false
            this.loadProfile()
          }).catch(err => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal update profile, silahkan coba lagi',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    loadProfile() {
      this.fieldLogoBusiness.push({ logo: '' })
      this.loading = true
      this.$http_komship.post('/v1/my-profile').then(response => {
        const { data } = response.data
        this.id = data.user_id
        this.fullname = data.user_fullname
        this.username = data.user_name
        if (data.user_gender === 'Laki-laki') {
          this.jenisKelamin = 1
        }
        if (data.user_gender === 'Perempuan') {
          this.jenisKelamin = 2
        }
        this.noHP = data.user_phone
        this.phoneBusiness = data.partner_no_hp_business
        this.emailUser = data.user_email
        this.address = data.user_address
        if (data.partner_business_logo) this.imageInitialFile = data.partner_business_logo
        this.nameBusiness = data.partner_business_name
        if (data.user_address_default !== null) {
          this.location = data.user_address_default.detail_address
        }
        if (data.address_partner_business) {
          this.cityCode = data.address_partner_business
          this.loadAllProvince()
        }
        if (data.partner_business_name === 'null') this.sektorBusiness = ''
        this.typeBusiness = data.partner_business_type_id
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load profile, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    loadPartnerCategory() {
      this.$http.post('/partnerCategory').then(response => {
        const { data } = response.data
        this.partnerCategoryItems = data
        return this.partnerCategoryItems
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    loadBusinessType() {
      this.$http.get('/businessType').then(response => {
        const { data } = response.data.data
        this.businessTypeItems = data
        return this.businessTypeItems
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    onSearchProvince(search, loading) {
      if (search.length) {
        this.searchProvince(loading, search, this)
      }
    },
    searchProvince: _.debounce((loading, search, that) => {
      loading(true)
      that.loadProvince(search).finally(() => loading(false))
    }, 500),
    loadProvince(search) {
      return this.$http.get(`/v1/partner/province-city?search=${search}`)
        .then(response => {
          const { data } = response.data
          this.provinceItems = data
          if (data.length === 1) {
            this.cityCode = data[0].city_code
          }
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal load data, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
    },
    loadAllProvince() {
      this.$http.get('/v1/partner/province-city')
        .then(response => {
          const { data } = response.data
          data.forEach(this.filterProvince)
          this.provinceItems = data
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal load data, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
    },
    filterProvince(data) {
      if (data.values === this.cityCode) {
        this.cityCode = data.city_code
      }
    },
    reset() {
      window.history.go(-1)
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
    formatBusinessName(e) {
      return String(e).substring(0, 30)
    },
    formatPhoneProfile(e) {
      console.log(e)
      if (e.keyCode === 13) {
        e.preventDefault()
      }
      if (this.phoneBusiness.length < 9) {
        this.messageErrorPhone = true
      } else {
        this.messageErrorPhone = false
      }
    },
    validateInputBusinessName(e) {
      if (e.keyCode === 47 || e.keyCode === 61 || e.keyCode === 58 || e.keyCode === 59 || e.keyCode === 13) {
        e.preventDefault()
        this.messageErrorLengthNameBusiness = true
      } else {
        this.messageErrorLengthNameBusiness = false
      }
    },
    validateInputPhoneProfile(e) {
      if (e.keyCode === 46 || e.keyCode === 45 || e.keyCode === 43 || e.keyCode === 101 || e.keyCode === 44 || e.keyCode === 13) {
        e.preventDefault()
      }
      if (this.phoneBusiness.length < 9) {
        this.messageErrorPhone = true
      } else {
        this.messageErrorPhone = false
      }
    },
    handleArrowInput(e) {
      if (e.which === 38 || e.which === 40) {
        e.preventDefault()
      }
    },
    async openModalEdit(data) {
      this.editMode = data
      if (data === 'number') {
        this.nameLabelEdit = 'No HP'
      }
      if (data === 'username') {
        this.modalTitle = await 'Edit Username'
        this.modalSubtitle = await 'Kamu hanya dapat mengganti username satu kali'
        this.modalFormLabel = await 'Username'
        this.modalEditFormInputType = await 'text'
        this.labelSubmit = await 'Simpan'
      } else if (data === 'noHP') {
        this.modalTitle = await 'Password Komship'
        this.modalSubtitle = await 'Masukkan Password Komshipmu untuk mengganti nomor HP'
        this.modalFormLabel = await 'Masukkan Pasword'
        this.modalEditFormInputType = await 'password'
        this.labelSubmit = 'Konfirmasi'
      } else if (data === 'email') {
        this.modalTitle = await 'Password Komship'
        this.modalSubtitle = await 'Masukkan Password Komshipmu untuk mengganti nomor HP'
        this.modalFormLabel = await 'Masukkan Pasword'
        this.modalEditFormInputType = await 'password'
        this.labelSubmit = await 'Konfirmasi'
      }
      this.$refs['modal-edit'].show()
    },
    closeModalEdit() {
      this.formInputEditItem = ''
      this.successConfirmPassword = false
      this.messageErrorUsernameIsSame = false
      this.$refs['modal-edit'].hide()
    },
    closeSuccessEditUsername() {
      this.$refs['modal-success-edit-username'].hide()
    },
    submitEdit() {
      this.messageErrorUsernameIsSame = false
      this.loadingEdit = true
      if (this.editMode === 'username') {
        if (this.userData.username !== this.formInputEditItem) {
          const formData = new FormData()
          formData.append('username', this.formInputEditItem)
          const params = {
            username: this.formInputEditItem,
          }
          this.$http.put('/user/partner/update-profile/username', {
            username: this.formInputEditItem,
          })
            .then(response => {
              this.loadingEdit = false
              if (response.data.code === 1009) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Gagal',
                    icon: 'AlertCircleIcon',
                    text: response.data.message,
                    variant: 'danger',
                  },
                }, 2000)
              } else {
                this.$refs['modal-success-edit-username'].show()
                this.$refs['modal-edit'].hide()
              }
            })
            .catch(err => {
              this.loadingEdit = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: err,
                  variant: 'danger',
                },
              }, 2000)
            })
        } else {
          this.loadingEdit = false
          this.messageErrorUsernameIsSame = true
        }
      } else if (this.editMode === 'noHP') {
        const formData = new FormData()
        formData.append('username', this.usernameCheckPasswword)
        formData.append('password', this.formInputEditItem)
        this.$http.post('/check-password', formData)
          .then(response => {
            this.modalTitle = 'Edit No HP'
            this.modalSubtitle = 'Pastikan nomor benar-benar milik Kamu'
            this.modalFormLabel = 'No HP'
            this.modalEditFormInputType = 'number'
            this.formInputEditItem = ''
            this.successConfirmPassword = true
            this.messageErrorPassword = false
            this.$refs.formRulesEdit.reset()
            this.loadingEdit = false
          }).catch(err => {
            if (err.response.data.data.check_password === false) {
              this.successConfirmPassword = false
              this.messageErrorPassword = true
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: err,
                  variant: 'danger',
                },
              }, 2000)
            }
            this.loadingEdit = false
          })
      } else if (this.editMode === 'email') {
        const formData = new FormData()
        formData.append('username', this.usernameCheckPasswword)
        formData.append('password', this.formInputEditItem)
        this.$http.post('/check-password', formData)
          .then(response => {
            this.modalTitle = 'Ganti Email'
            this.modalSubtitle = 'Pastikan email yang baru milik Kamu'
            this.modalFormLabel = 'Email'
            this.modalEditFormInputType = 'email'
            this.formInputEditItem = ''
            this.successConfirmPassword = true
            this.messageErrorPassword = false
            this.loadingEdit = false
            this.$refs.formRulesEdit.reset()
          }).catch(err => {
            if (err.response.data.data.check_password === false) {
              this.successConfirmPassword = false
              this.messageErrorPassword = true
              this.loadingEdit = false
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: err,
                  variant: 'danger',
                },
              }, 2000)
              this.loadingEdit = false
            }
          })
      }
    },
    submitVerification() {
      this.loadingEdit = true
      if (this.editMode === 'noHP') {
        const formData = new FormData()
        formData.append('phone_number', this.formInputEditItem)
        this.$http_komship.post('/v1/partner/sms/otp', formData)
          .then(response => {
            this.$refs['modal-edit'].hide()
            this.$refs['modal-verification-edit'].show()
            this.loadingEdit = false
            this.countDownTimer()
          }).catch(err => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: err,
                variant: 'danger',
              },
            }, 2000)
            this.loadingEdit = false
          })
      }
      if (this.editMode === 'email') {
        const formData = new FormData()
        formData.append('id_user', this.id)
        formData.append('email', this.formInputEditItem)
        this.$http.post('/user/partner/update-profile/email', formData)
          .then(response => {
            if (response.data.message !== 'Successfuly your email is the same as the previous email') {
              this.$refs.formRulesEdit.reset()
              this.successVerificationTitle = 'Cek Email Kamu'
              this.descriptionSuccessVerification = 'Klik link konfirmasi yang telah kami kirimkan ke email danirizky@gmail.com untuk mengonfirmasi alamat email yang baru dan membantu mengamankan akun Anda. Link konfirmasi akan hangus dalam 10 menit setelah email dikirimkan'
              this.$refs['modal-edit'].hide()
              this.$refs['modal-success-verification'].show()
              this.loadingEdit = false
            } else {
              this.emailSamePrevious = true
              this.loadingEdit = false
            }
          })
          .catch(err => {
            if (err.response.data.code === 1009) {
              this.messageErrorEmail = '*Email telah digunakan orang lain'
            }
            this.loadingEdit = false
          })
      }
    },
    sendVerification() {
      const formData = new FormData()
      formData.append('otp', this.otpConfirmation)
      this.$http_komship.post('/v1/partner/sms/otp/verification', formData)
        .then(response => {
          this.submitEditNomer()
        }).catch(err => {
          if (err.response.data.code === 400) {
            this.errorOtp = true
          } else {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: err,
                variant: 'danger',
              },
            }, 2000)
          }
        })
    },
    submitEditNomer() {
      const formData = new FormData()
      formData.append('no_handphone', this.formInputEditItem)
      this.$http.post('user/partner/update-profile/no-handphone', formData)
        .then(response => {
          this.successVerificationTitle = 'Terimakasih'
          this.descriptionSuccessVerification = `Kami telah mengkonfirmasi ${this.formInputEditItem} sebagai
          nomor HP untuk Akun Komerce Kamu`
          this.errorOtp = false
          this.successConfirmPassword = false
          this.formInputEditItem = ''
          this.$refs['modal-verification-edit'].hide()
          this.$refs['modal-success-verification'].show()
        }).catch(err => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: err,
              variant: 'danger',
            },
          }, 2000)
        })
    },
    handleBackEdit() {
      this.$refs['modal-verification-edit'].hide()
      this.$refs['modal-edit'].show()
    },
    changeEyeIcon() {
      if (this.itemEyeIcon === 'EyeOffIcon') {
        this.itemEyeIcon = 'EyeIcon'
        this.modalEditFormInputType = 'text'
      } else {
        this.itemEyeIcon = 'EyeOffIcon'
        this.modalEditFormInputType = 'password'
      }
    },
    closeSuccessVerification() {
      this.successConfirmPassword = false
      this.formInputEditItem = ''
      this.$refs['modal-success-verification'].hide()
    },
    formatPhone: _.debounce(function () {
      if (this.formInputEditItem.length < 8) {
        this.errorNoHp = true
      } else {
        this.errorNoHp = false
      }
      if (this.formInputEditItemPasteMode === true) {
        this.formInputEditItem = this.formInputEditItemPaste
      }
      this.formInputEditItemPasteMode = false
    }, 1000),
    validateInputPhone(e) {
      if (e.keyCode === 46 || e.keyCode === 45 || e.keyCode === 43) {
        e.preventDefault()
      }
    },
    formatterPhone(e) {
      this.formInputEditItemPasteMode = true
      this.formInputEditItem = ''
      this.formInputEditItemPaste = ''
      this.formInputEditItemPaste = e.clipboardData.getData('text').replace(/\D/g, '')
      if (this.formInputEditItemPaste.charAt(0) === '0') {
        this.formInputEditItemPaste = this.formInputEditItemPaste.substr(1, this.formInputEditItemPaste.length)
      } else {
        this.formInputEditItemPaste = this.formInputEditItemPaste.substr(0, this.formInputEditItemPaste.length)
      }
      if (this.formInputEditItemPaste.charAt(0) === '6') {
        this.formInputEditItemPaste = this.formInputEditItemPaste.substr(2, this.formInputEditItemPaste.length)
      } else {
        this.formInputEditItemPaste = this.formInputEditItemPaste.substr(0, this.formInputEditItemPaste.length)
      }
      if (this.formInputEditItem.includes('+62') && this.formInputEditItem.charAt(0) !== '0') {
        this.formInputEditItemPaste = this.formInputEditItemPaste.substr(3, this.formInputEditItemPaste.length)
      }
      this.formInputEditItemPaste = `0${this.formInputEditItemPaste}`
    },
    valueFormatPhone(e) {
      if (e.target.value.length < 8) {
        this.errorNoHp = true
      } else {
        this.errorNoHp = false
      }
    },
    resetMessageErrorEmail() {
      this.messageErrorPassword = false
      this.messageErrorEmail = null
      this.emailSamePrevious = false
    },
    countDownTimer() {
      if (this.countOtp > 0) {
        setTimeout(() => {
          this.countOtp -= 1
          this.countDownTimer()
        }, 1000)
      }
      if (this.countOtp === 0) {
        this.resendOtp = true
      }
    },
    handleResendOtp() {
      this.loadingOtp = true
      const formData = new FormData()
      formData.append('phone_number', this.formInputEditItem)
      this.$http_komship.post('/v1/partner/sms/otp', formData)
        .then(response => {
          this.$refs['modal-edit'].hide()
          this.$refs['modal-verification-edit'].show()
          this.loadingEdit = false
          this.countOtp = 60
          this.resendOtp = false
          this.countDownTimer()
          this.loadingOtp = false
        }).catch(err => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: err,
              variant: 'danger',
            },
          }, 2000)
          this.loadingOtp = true
        })
    },
    formatEditPhone(e) {
      return String(e).substring(0, 14)
    },
    hideCloseModalEdit() {
      this.formInputEditItem = ''
      this.messageErrorUsernameIsSame = false
      this.successConfirmPassword = false
    },
    handleValueCityCode() {
      this.cityCodeValue = this.cityCode.city_code
    },
    handleEnter(e) {
      if (e.keyCode === 13) {
        e.preventDefault()
      }
    },
    handleMessageErrorUsernameIsSame() {
      this.messageErrorPassword = false
      this.messageErrorUsernameIsSame = false
    },
  },

}
