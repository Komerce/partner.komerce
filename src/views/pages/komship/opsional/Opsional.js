import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BModal, VBModal, BSpinner, BOverlay,
} from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { required } from '@validations'
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import httpKomship2 from '../setting-kompship/http_komship2'

export default {
  components: {
    BModal,
    BSpinner,
    BOverlay,
    ValidationObserver,
    ValidationProvider,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {
      profile: [],
      quickType: null,
      mutationBank: null,
      customLabel: null,
      isGetting: false,
      isNotSetActive: true,

      nameSender: '',
      noHPSender: '',
      loadingSubmitSender: false,
      itemsCustomLabel: [],
      customLabelEditMode: false,
      fieldAddSender: false,
      editNameSender: '',
      editNoHPSender: '',
      loadingWrapperCustom: false,
      idCustomLabelEdit: null,
      senderIsDefault: null,
      editSenderIsDefault: null,
      required,
      loadingDeleteSender: false,
      messageValidateNumber: '',
      errorNumber: false,
      errorNumberEdit: false,
      messageErrorLengthSenderName: false,
      senderIdentity1Name: null,
      senderIdentity1NoHp: null,
      indexIdentity: 1,
    }
  },
  created() {
    this.getProfile()
  },
  methods: {
    getProfile() {
      httpKomship2
        .post('v1/my-profile')
        .then(res => {
          this.profile = res.data.data
          this.quickType = res.data.data.partner_is_allowed_edit
          this.mutationBank = res.data.data.partner_is_mutation_bank
          this.customLabel = res.data.data.partner_is_custom_label
          this.isGetting = true
          this.getCustomLabel()
        })
        .catch(err => {
          console.log(err)
          this.isGetting = true
        })
    },
    setQuickType() {
      this.$http
        .post(
          `/user/partner/setting/isAllowedEdit/${this.profile.partner_id}`,
          { is_allowed_edit: this.quickType },
        )
        .then(res => {
          if (res.data.code === 200) {
            this.getProfile()
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: `Input Cepat Berhasil ${
                    this.quickType ? 'Diaktifkan' : 'Dinonaktifkan'
                  }`,
                  variant: 'success',
                },
              },
              2000,
            )
          }
        })
    },
    setMutationBank() {
      this.$http
        .post(
          `user/partner/setting/isMutationBank/${this.profile.partner_id}`,
          { is_mutation_bank: this.mutationBank ? '1' : '0' },
        )
        .then(res => {
          if (res.data.code === 200) {
            this.getProfile()
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: `Mutasi Rekening Berhasil ${
                    this.mutationBank ? 'Diaktifkan' : 'Dinonaktifkan'
                  }`,
                  variant: 'success',
                },
              },
              2000,
            )
          }
        })
    },
    setCustomLabel() {
      if (this.customLabel === false) {
        this.$refs['modal-set-custom-label'].show()
      }
      if (this.customLabel && this.isNotSetActive) {
        this.$http
          .post(
            `/user/partner/setting/isCustomLabel/${this.profile.partner_id}`,
            {
              is_custom_label: 1,
            },
          )
          .then(() => {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Custom Label berhasil diaktifkan',
                  variant: 'success',
                },
              },
              2000,
            )
          })
          .catch(() => {
            this.$toast(
              {
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: 'Gagal update custom label',
                  variant: 'danger',
                },
              },
              2000,
            )
          })
      }
    },
    handleNotActiveCustomLabel() {
      this.$http
        .post(
          `/user/partner/setting/isCustomLabel/${this.profile.partner_id}`,
          {
            is_custom_label: 0,
          },
        )
        .then(() => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Custom Label berhasil dinonaktifkan',
                variant: 'success',
              },
            },
            2000,
          )
          this.customLabel = false
          this.isNotSetActive = true
          this.$refs['modal-set-custom-label'].hide()
        })
        .catch(() => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal update custom label',
                variant: 'danger',
              },
            },
            2000,
          )
        })
    },
    alertCustomLabel() {
      this.isNotSetActive = false
      this.customLabel = true
      this.$refs['modal-set-custom-label'].hide()
    },
    getCustomLabel() {
      this.loadingWrapperCustom = true
      this.$http_komship
        .get(`/v1/custom-labels/${this.profile.partner_id}`)
        .then(response => {
          const { data } = response.data
          this.itemsCustomLabel = data
          const getDefault = this.itemsCustomLabel.find(
            items => items.is_default === 1,
          )
          const getSenderIdentity1 = this.itemsCustomLabel.find(
            items => items.name_label === this.profile.partner_name,
          )
          this.senderIdentity1Name = getSenderIdentity1.name_label
          this.senderIdentity1NoHp = getSenderIdentity1.no_hp
          if (getSenderIdentity1 !== undefined) {
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.itemsCustomLabel.length; x++) {
              if (
                this.itemsCustomLabel[x].name_label
                === this.profile.partner_name
              ) {
                this.itemsCustomLabel.splice(x, 1)
              }
            }
          }
          if (getDefault !== undefined) {
            // eslint-disable-next-line no-plusplus
            for (let x = 0; x < this.itemsCustomLabel.length; x++) {
              if (this.itemsCustomLabel[x].is_default === 1) {
                this.itemsCustomLabel.splice(x, 1)
              }
            }
            this.itemsCustomLabel.unshift(getDefault)
          }
          this.loadingWrapperCustom = false
        })
        .catch(err => {
          console.log(err)
          this.loadingWrapperCustom = false
        })
    },
    submitSender() {
      this.loadingSubmitSender = true
      this.$refs.formRulesAdd.validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('name_label', this.nameSender)
          formData.append('no_hp', this.noHPSender)
          formData.append('partner_id', this.profile.partner_id)
          formData.append('is_default', this.senderIsDefault ? 1 : 0)
          this.$http_komship
            .post('/v1/custom-labels/store', formData)
            .then(response => {
              this.$toast(
                {
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    icon: 'CheckIcon',
                    text: response.data.message,
                    variant: 'success',
                  },
                },
                2000,
              )
              this.nameSender = ''
              this.noHPSender = ''
              this.senderIsDefault = false
              this.getCustomLabel()
              this.fieldAddSender = false
              this.loadingSubmitSender = false
            })
            .catch(err => {
              this.$toast(
                {
                  component: ToastificationContent,
                  props: {
                    title: 'Failure',
                    icon: 'AlertCircleIcon',
                    text: err.response.message,
                    variant: 'danger',
                  },
                },
                2000,
              )
              this.loadingSubmitSender = false
            })
        } else {
          this.loadingSubmitSender = false
        }
      })
    },
    updateSenderLabel() {
      this.loadingSubmitSender = true
      // eslint-disable-next-line dot-notation
      this.$refs['formEditRules'][0].validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('name_label', this.editNameSender)
          formData.append('no_hp', this.editNoHPSender)
          formData.append('is_default', this.editSenderIsDefault ? 1 : 0)
          formData.append('_method', 'put')
          this.$http_komship
            .post(
              `/v1/custom-labels/update/${this.idCustomLabelEdit}`,
              formData,
            )
            .then(response => {
              this.$toast(
                {
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    icon: 'CheckIcon',
                    text: response.data.message,
                    variant: 'success',
                  },
                },
                2000,
              )
              this.getCustomLabel()
              this.loadingSubmitSender = false
              this.customLabelEditMode = false
            })
            .catch(err => {
              this.$toast(
                {
                  component: ToastificationContent,
                  props: {
                    title: 'Failure',
                    icon: 'AlertCircleIcon',
                    text: err.response.message,
                    variant: 'danger',
                  },
                },
                2000,
              )
              this.loadingSubmitSender = false
            })
        } else {
          this.loadingSubmitSender = false
        }
      })
    },
    deleteSenderLabel(data) {
      this.loadingDeleteSender = true
      this.$http_komship
        .delete(`/v1/custom-labels/delete/${data.id}`)
        .then(response => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: response.data.message,
                variant: 'success',
              },
            },
            2000,
          )
          this.getCustomLabel()
          this.loadingDeleteSender = false
          this.customLabelEditMode = false
        })
        .catch(err => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Failure',
                icon: 'AlertCircleIcon',
                text: err.response.message,
                variant: 'danger',
              },
            },
            2000,
          )
          this.loadingDeleteSender = false
        })
    },
    addSender() {
      this.customLabelEditMode = false
      this.fieldAddSender = true
    },
    removeFieldAddSender() {
      this.fieldAddSender = false
    },
    editSenderActive(data) {
      this.errorNumberEdit = false
      this.editNameSender = data.name_label
      this.editNoHPSender = data.no_hp
      this.idCustomLabelEdit = data.id
      if (data.is_default === 1) {
        this.editSenderIsDefault = true
      } else {
        this.editSenderIsDefault = false
      }
      this.customLabelEditMode = true
    },
    editSenderNoActive() {
      this.customLabelEditMode = false
    },
    checkNumber() {
      if (this.noHPSender.length < 9) {
        this.errorNumber = true
        this.messageValidateNumber = '*minimal 9 digit dan hanya berupa angka.'
      } else {
        this.errorNumber = false
        this.messageValidateNumber = ''
      }
    },
    checkEditNumber() {
      if (this.editNoHPSender.length < 9) {
        this.errorNumberEdit = true
        this.messageValidateNumber = '*minimal 9 digit dan hanya berupa angka.'
      } else {
        this.errorNumber = false
        this.messageValidateNumber = ''
      }
    },
    formatNameSender(e) {
      return String(e).substring(0, 30)
    },
    validateInputNameSender(e) {
      if (
        e.keyCode === 47
        || e.keyCode === 61
        || e.keyCode === 58
        || e.keyCode === 59
      ) {
        e.preventDefault()
        this.messageErrorLengthSenderName = true
      } else {
        this.messageErrorLengthSenderName = false
      }
    },
  },
}
