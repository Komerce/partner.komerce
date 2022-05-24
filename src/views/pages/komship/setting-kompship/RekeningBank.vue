<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
  >
    <b-card>
      <!-- Verivication PIN -->
      <b-modal
        ref="modal-pin"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
        hide-footer
        hide-header
        modal-class="modal-primary"
        centered
        title="Primary Modal"
      >
        <b-col class="d-flex justify-content-center mt-50">
          <h4>
            <strong>Verifikasi PIN</strong>
          </h4>
        </b-col>

        <b-col class="d-flex justify-content-center mt-3">
          <small>
            <strong>Mohon verifikasi identitas kamu dengan masukan PIN</strong>
          </small>
        </b-col>

        <b-col class="d-flex justify-content-center mt-2 mb-1">
          <CodeInput
            :loading="false"
            class="input"
            :type="visibilityPin"
            @change="onChange"
            @complete="onComplete"
          />
        </b-col>

        <b-col class="d-flex justify-content-center">
          <b-button
            variant="flat-primary"
            class="btn-icon"
            @click="toggleVisibilityPin"
          >
            Tampilkan
          </b-button>
        </b-col>

        <b-col class="text-center mt-1">
          <small class="text-danger">{{ errorPin }}</small>
        </b-col>

        <b-col class="d-flex justify-content-center mt-1">
          <b-button
            variant="primary"
            @click="confirmPin"
          >
            <b-spinner
              v-if="loadingSubmit"
              small
            />
            Konfirmasi
          </b-button>
        </b-col>
        <b-col class="d-flex justify-content-center mt-1">
          <b-button
            variant="outline-primary"
            @click="backPage"
          >
            Kembali
          </b-button>
        </b-col>
        <b-col class="d-flex justify-content-center align-items-center mt-1">
          <small>Belum punya PIN ?</small><b-button
            class="btn-icon"
            size="sm"
            variant="flat-primary"
            tag="router-link"
            :to="{ name: $route.meta.routePin }"
          >
            Buat PIN!
          </b-button>
        </b-col>
      </b-modal>

      <!-- Verification No. HP -->
      <b-modal
        id="modal-hp"
        no-close-on-backdrop
        hide-header-close
        ok-only
        hide-header
        modal-class="modal-primary"
        centered
      >
        <b-col class="d-flex justify-content-center mt-50">
          <h4>
            <strong>Verifikasi No HP</strong>
          </h4>
        </b-col>

        <b-col class="d-flex justify-content-center mt-3">
          <small class="text-center">
            <strong>Mohon verifikasi identitas kamu dengan memasukan Kode Verifikasi (OTP) yang dikirimkan via SMS ke No 085788888834</strong>
          </small>
        </b-col>

        <b-col class="d-flex justify-content-center mt-2 mb-1">
          <CodeInput
            :loading="false"
            class="input"
            :type="visibilityPin"
            @change="onChange"
            @complete="onComplete"
          />
        </b-col>

        <b-col class="d-flex justify-content-center">
          <b-button
            variant="flat-primary"
            class="btn-icon"
            @click="toggleVisibilityPin"
          >
            Tampilkan
          </b-button>
        </b-col>

        <b-col class="d-flex justify-content-center mt-1">
          <b-button
            variant="primary"
          >
            Konfirmasi
          </b-button>
        </b-col>
        <b-col class="d-flex justify-content-center mt-1">
          <b-button
            variant="outline-primary"
          >
            Kembali
          </b-button>
        </b-col>
      </b-modal>

      <b-col cols="12">
        <h4>
          <strong>Pengaturan Rekening Bank</strong>
        </h4>
      </b-col>

      <b-col
        v-for="(data, index) in formRekening"
        :key="index + 1"
        md="10"
        class="border ml-1 mt-2"
      >
        <b-row class="d-flex align-items-center mb-1">
          <b-col>
            <h5>
              <strong>Rekening {{ index+1 }}</strong>
            </h5>
          </b-col>
          <b-col class="d-flex justify-content-end">
            <b-button
              v-if="editMode === true"
              class="btn-icon"
              variant="flat-dark"
              @click="changeEditMode"
            >
              <feather-icon
                icon="EditIcon"
              />
            </b-button>
            <b-button
              v-else
              class="btn-icon"
              variant="flat-dark"
              @click="editRekening(data)"
            >
              <feather-icon
                icon="EditIcon"
              />
            </b-button>
          </b-col>
        </b-row>

        <validation-observer ref="formRules">
          <b-form>
            <b-row>
              <b-col cols="10">
                <b-form-group
                  label="Nama Bank"
                  label-cols-md="3"
                >
                  <div v-if="editMode === true && editIdRek === data.bank_account_id">
                    <validation-provider
                      #default="{errors}"
                      name="Nama Bank"
                      rules="required"
                    >
                      <v-select
                        v-model="bankName"
                        label="name"
                        :reduce="option => option.code"
                        :options="banks"
                        :filterable="true"
                        :state="errors.length > 0 ? false : null"
                        placeholder="Ketik untuk mencari..."
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </div>
                  <div v-else>
                    <b-form-input
                      v-model="data.bank_name"
                      disabled
                    />
                  </div>
                </b-form-group>
              </b-col>

              <b-col cols="10">
                <b-form-group
                  label="No Rekening"
                  label-cols-md="3"
                >
                  <div v-if="editMode === true && editIdRek === data.bank_account_id">
                    <validation-provider
                      #default="{errors}"
                      name="No Rekening"
                      rules="required"
                    >
                      <b-form-input
                        v-model="accountNo"
                        :state="errors.length > 0 ? false:null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </div>
                  <div v-else>
                    <b-form-input
                      v-model="data.account_no"
                      disabled
                    />
                  </div>
                </b-form-group>
              </b-col>

              <b-col cols="10">
                <b-form-group
                  label="Nama"
                  label-cols-md="3"
                >
                  <div v-if="editMode === true && editIdRek === data.bank_account_id">
                    <validation-provider
                      #default="{errors}"
                      name="Nama"
                      rules="required"
                    >
                      <b-form-input
                        v-model="accountName"
                        :state="errors.length > 0 ? false:null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </div>
                  <div v-else>
                    <b-form-input
                      v-model="data.account_name"
                      disabled
                    />
                  </div>
                </b-form-group>
              </b-col>

              <!-- Edit Rekening -->
              <transition name="fade">
                <b-col
                  v-if="editMode === true && editIdRek === data.bank_account_id"
                  md="12"
                  class="d-flex justify-content-end mt-1 pb-1"
                >
                  <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="outline-primary"
                    class="mr-1"
                    @click.prevent="confirmDelete(data)"
                  >
                    Hapus
                  </b-button>
                  <b-button
                    v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                    type="reset"
                    variant="primary"
                    class="mr-1"
                    @click.prevent="submitEditRekening"
                  >
                    <b-spinner
                      v-if="loadingSubmit"
                      variant="light"
                      small
                    />
                    Simpan
                  </b-button>
                </b-col>
              </transition>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>

      <!-- Add Rekening -->
      <b-col
        v-if="fieldActionAddRekening === true"
        md="10"
        class="border ml-1 mt-2"
      >
        <b-row class="d-flex align-items-center mb-1">
          <b-col>
            <h5>
              <strong>Tambah Rekening</strong>
            </h5>
          </b-col>
        </b-row>

        <validation-observer ref="formRulesAdd">
          <b-form>
            <b-row>
              <b-col cols="10">
                <b-form-group
                  label="Nama Bank"
                  label-cols-md="3"
                >
                  <validation-provider
                    #default="{errors}"
                    name="Nama Bank"
                    rules="required"
                  >
                    <v-select
                      v-model="fieldAddBankName"
                      label="name"
                      :reduce="option => option.code"
                      :options="banks"
                      :filterable="true"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col cols="10">
                <b-form-group
                  label="No Rekening"
                  label-cols-md="3"
                >
                  <validation-provider
                    #default="{errors}"
                    name="No rekening"
                    rules="required"
                  >
                    <b-form-input
                      v-model="fieldAddAccountNo"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col cols="10">
                <b-form-group
                  label="Nama"
                  label-cols-md="3"
                >
                  <validation-provider
                    #default="{errors}"
                    name="Nama"
                    rules="required"
                  >
                    <b-form-input
                      v-model="fieldAddAccountName"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col
                md="12"
                class="d-flex justify-content-end mt-1 pb-1"
              >
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="outline-primary"
                  class="mr-1"
                  @click="cancelAddRekening"
                >
                  Hapus
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="primary"
                  class="mr-1"
                  @click.prevent="submitVerification"
                >
                  <b-spinner
                    v-if="loadingSubmit"
                    variant="light"
                    small
                  />
                  Simpan
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>

      <b-col
        md="10"
        class="ml-1 mt-1"
      >
        <div class="demo-inline-spacing">
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            block
            variant="outline-primary"
            @click="addRekening"
          >
            <feather-icon
              icon="PlusIcon"
              class="mr-50"
              style="display: inline-block"
            />
            <span class="align-middle">Tambahkan Rekening</span>
          </b-button>
        </div>
      </b-col>
    </b-card>
    <b-modal
      ref="modal-verification-submit"
      no-close-on-backdrop
      hide-header-close
      hide-footer
      hide-header
      modal-class="modal-primary"
      centered
    >
      <b-col
        v-if="errorConfirmOtp === true"
        class="d-flex justify-content-center mt-2"
      >
        <b-badge variant="light-primary">
          <div class="d-flex align-items-center">
            <b-button
              variant="flat-primary"
              class="btn-icon"
              size="sm"
              @click="handleCloseNotifError"
            >
              <feather-icon
                icon="XCircleIcon"
              />
            </b-button>
            Upss, kode verifikasi (OTP) salah
          </div>
        </b-badge>
      </b-col>

      <b-col class="d-flex justify-content-center mt-2">
        <h4>
          <strong>Verifikasi Nomor Hp</strong>
        </h4>
      </b-col>

      <b-col class="d-flex justify-content-center mt-1">
        <small class="text-center">
          <strong>Mohon verifikasi identitas kamu dengan memasukan Kode Verifikasi (OTP) yang dikirimkan via SMS ke Nomor kamu {{ phoneUser }}</strong>
        </small>
      </b-col>

      <b-col class="d-flex justify-content-center mt-2 mb-1">
        <div style="display: flex; flex-direction: row;">
          <CodeInput
            :loading="false"
            class="input"
            :type="visibilityPin"
            @change="onChange"
            @complete="onComplete"
          />
        </div>
      </b-col>

      <b-col class="d-flex justify-content-center">
        <b-button
          variant="flat-primary"
          class="btn-icon"
          @click="toggleVisibilityPin"
        >
          Tampilkan
        </b-button>
      </b-col>

      <b-col
        v-if="countSubmit > 1 && countCanResendOtp > 0"
        class="d-flex justify-content-center mt-2"
      >
        <b-badge variant="light-warning">
          <div class="d-flex">
            <feather-icon
              icon="AlertCircleIcon"
              class="mr-50"
            />
            {{ validateResendOtp }}
          </div>
        </b-badge>
      </b-col>

      <b-col
        v-if="validateResendOtp === ''"
        class="d-flex justify-content-center mt-1"
      >
        <div v-if="countOtp > 0 && countSubmit !== 2">
          <small>Kirim Ulang({{ countOtp }})</small>
        </div>
        <div v-else>
          <div v-if="countSubmit < 2">
            <b-button
              variant="flat-primary"
              size="sm"
              class="btn-icon"
              @click="sendOtpAgain"
            >
              Kirim Ulang
            </b-button>
          </div>
        </div>
      </b-col>

      <b-col class="d-flex justify-content-center mt-1 pb-2">
        <b-button
          variant="flat-primary"
          class="btn-icon mr-1"
          @click.prevent="handleClosePopupOtp"
        >
          Kembali
        </b-button>
        <b-button
          variant="primary"
          class="btn-icon"
          @click.prevent="submitRekening"
        >
          Konfirmasi
        </b-button>
      </b-col>
    </b-modal>

    <!-- Modal Validate Profile -->
    <!-- Modal Success Pickup -->
    <b-modal
      ref="modal-validate-profile"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <b-row class="justify-content-center pt-2 mb-2">
          <img src="@/assets/images/icons/warning.svg">
        </b-row>
        <b-row class="text-center mb-2 px-5">
          <h4 class="text-black">
            <strong>
              Untuk melanjutkan, silahkan lengkapi Profil
              Anda terlebih dahulu
            </strong>
          </h4>
        </b-row>
        <b-row class="justify-content-center pb-2">
          <b-button
            variant="primary"
            class="btn-icon"
            tag="router-link"
            :to="{ name: $route.meta.routeToProfile }"
          >
            Lengkapi Profile
          </b-button>
        </b-row>
      </div>
    </b-modal>
  </b-overlay>
</template>

<script>
import CodeInput from 'vue-verification-code-input'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { required } from '@validations'
import vSelect from 'vue-select'
import {
  BRow,
  BCol,
  BCard,
  BForm,
  BFormGroup,
  BFormInput,
  BButton,
  BModal,
  VBModal,
  BOverlay,
  BSpinner,
} from 'bootstrap-vue'
// import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { heightTransition } from '@core/mixins/ui/transition'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from './http_komship'

export default {
  components: {
    BRow,
    BCard,
    BCol,
    // vSelect,
    BForm,
    BFormGroup,
    BFormInput,
    BButton,
    BModal,
    CodeInput,
    ValidationObserver,
    ValidationProvider,
    BOverlay,
    BSpinner,
    vSelect,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {
      loadingSubmit: false,
      loading: false,
      dataPin: null,
      errorPin: '',
      addForm: true,

      banks: [],

      editIdRek: null,

      // Validation
      required,

      bankName: '',
      accountNo: '',
      accountName: '',

      editMode: false,

      formRekening: [{ row: '' }],

      fieldActionAddRekening: false,

      submitAction: false,

      // Create Rekening Bank
      fieldAddBankName: '',
      fieldAddAccountNo: '',
      fieldAddAccountName: '',

      phoneUser: '',

      phoneNumber: '',

      countOtp: 60,

      errorConfirmOtp: false,

      countSubmit: 0,

      validateResendOtp: '',
      countCanResendOtp: 0,

      visibilityPin: 'password',

      validateProfile: [],
    }
  },
  mounted() {
    this.showModal()
    this.getBank()
    this.loadBanks()
    this.getProfile()
    this.$refs['modal-pin'].show()
  },
  methods: {
    getBank() {
      this.loading = true
      return httpKomship.get('v1/bank-account', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.formRekening = data
        this.loading = false
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan refresh halaman!',
            variant: 'danger',
          },
        }, 2000)
        this.loading = false
      })
    },
    submitVerification() {
      // Verification
      if (this.validateResendOtp === '') {
        this.loadingSubmit = true
        this.$refs.formRulesAdd.validate().then(success => {
          if (success) {
            const formData = new FormData()
            formData.append('_method', 'post')
            formData.append('phone_number', this.phoneNumber)
            httpKomship.post('/v1/partner/sms/otp', formData, {
              headers: { Authorization: `Bearer ${useJwt.getToken()}` },
            }).then(() => {
              this.loadingSubmit = false
              this.$refs['modal-verification-submit'].show()
              this.countDownTimerOtp()
            }).catch(() => {
              this.loadingSubmit = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'gagal',
                  icon: 'AlertCircleIcon',
                  text: 'Gagal kirim otp, silahkan coba lagi!',
                  variant: 'danger',
                },
              }, 2000)
            })
          } else {
            this.loadingSubmit = false
          }
        })
      } else {
        this.$refs['modal-verification-submit'].show()
      }
    },
    sendOtpAgain() {
      this.countSubmit += 1
      if (this.countOtp < 2) {
        this.countOtp = 60
        const formData = new FormData()
        formData.append('_method', 'post')
        formData.append('phone_number', this.phoneNumber)
        httpKomship.post('/v1/partner/sms/otp', formData, {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(() => {}).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal kirim OTP, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
        this.countDownTimerOtp()
      }
      if (this.countSubmit > 1) {
        this.validateResendOtp = 'Kirim ulang sudah melewati batas'
        this.countCanResendOtp = 60
        this.countDownTimerResend()
      }
    },
    submitRekening() {
      if (this.errorConfirmOtp === true) {
        this.errorConfirmOtp = false
      }
      const formData = new FormData()
      formData.append('otp', this.dataPin)
      httpKomship.post('/v1/partner/sms/otp/verification', formData).then(response => {
        if (response.data.code === 200) {
          httpKomship.post('/v1/bank-account/store',
            {
              bank_name: this.fieldAddBankName,
              account_name: this.fieldAddAccountName,
              account_no: this.fieldAddAccountNo,
            }, {
              headers: { Authorization: `Bearer ${useJwt.getToken()}` },
            }).then(responseStore => {
            if (responseStore.data.code === 400) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  icon: 'AlertCircleIcon',
                  text: responseStore.data.message,
                  variant: 'danger',
                },
              }, 2000)
            } else {
              this.loadingSubmit = false
              this.getBank()
              this.fieldActionAddRekening = false
              this.$refs['modal-verification-submit'].hide()
              this.visibilityPin = 'password'
            }
          }).catch(() => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal menambahkan rekening, silahkan coba lagi!',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failed',
              icon: 'AlertCircleIcon',
              text: response.data.message,
              variant: 'danger',
            },
          }, 2000)
          this.loadingSubmit = false
          this.errorConfirmOtp = true
        }
      })
    },
    editRekening(data) {
      this.editIdRek = data.bank_account_id
      this.bankName = data.bank_name
      this.accountNo = data.account_no
      this.accountName = data.account_name
      this.editMode = true
      this.addForm = false
    },
    submitEditRekening() {
      this.loadingSubmit = true
      // eslint-disable-next-line dot-notation
      this.$refs['formRules'][0].validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('_method', 'put')
          formData.append('bank_name', this.bankName)
          formData.append('account_name', this.accountName)
          formData.append('account_no', this.accountNo)

          httpKomship.post(`/v1/bank-account/update/${this.editIdRek}`, formData, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(() => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Berhasil',
                icon: 'CheckIcon',
                text: 'Berhasil update rekening',
                variant: 'success',
              },
            }, 2000)
            this.loadingSubmit = false
            this.editMode = false
            this.getBank()
          }).catch(() => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal edit rekening bank, silahkan coba lagi',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: 'Ingin hapus satu rekening ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.delete(data)
        }
      })
    },
    delete(data) {
      httpKomship.delete(`/v1/bank-account/delete/${data.bank_account_id}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      })
        .then(() => {
          this.getBank()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal delete rekening bank, silahkan coba lagi',
              variant: 'danger',
            },
          }, 2000)
        })
    },
    onChange(v) {
      this.dataPin = v
    },
    onComplete(v) {
      this.dataPin = v
    },
    showModal() {
      this.$refs['modal-pin'].show()
    },
    hideModal() {
      this.$refs['modal-pin'].hide()
    },
    confirmPin() {
      this.loadingSubmit = true
      httpKomship.post('/v1/pin/auth', {
        pin: this.dataPin,
      }, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        if (data.is_match === true) {
          this.loadingSubmit = false
          this.hideModal()
          this.visibilityPin = 'password'
        } else {
          this.errorPin = 'PIN tidak valid'
          this.loadingSubmit = false
        }
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal konfirmasi PIN, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    loadBanks() {
      this.loading = true
      this.$http
        .get('xendit/disbursementbankAvailable')
        .then(({ data }) => {
          this.banks = data.data
        })
        .catch(() => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Terjadi Kesalahan',
                text: 'Terjadi kesalahan saat pengambilan data bank',
                variant: 'danger',
                attachment: 'AlertTriangleIcon',
              },
            },
            { timeout: 2500 },
          )
        })
        .finally(() => {
          this.loading = false
        })
    },
    addRekening() {
      if (this.validateProfile.user_name === '' || this.validateProfile.fullname === '' || this.validateProfile.user_gender === ''
      || this.validateProfile.user_email === '' || this.validateProfile.user_phone === '' || this.validateProfile.user_address === ''
      || this.validateProfile.address_partner_business === '' || this.validateProfile.partner_business_name === ''
      || this.validateProfile.partner_category_name === '' || this.validateProfile.partner_business_type_id === ''
      || this.validateProfile.partner_business_logo === '') {
        this.$refs['modal-validate-profile'].show()
      } else {
        this.fieldActionAddRekening = true
        if (this.editMode === true) {
          this.editMode = false
        }
      }
    },
    cancelAddRekening() {
      this.fieldActionAddRekening = false
    },
    removeFormRekening(index) {
      this.formRekening.splice(index, 1)
    },
    countDownTimerOtp() {
      if (this.countOtp > 0) {
        setTimeout(() => {
          this.countOtp -= 1
          this.countDownTimerOtp()
        }, 1000)
      }
    },
    // Handle OTP
    handleOnComplete(value) {
      this.dataPin = value
    },
    handleOnChange(value) {
      this.dataPin = value
    },
    backPage() {
      window.history.go(-1)
    },
    changeEditMode() {
      this.editMode = false
    },
    getProfile() {
      this.$http_komship.post('v1/my-profile', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        // this.phoneUser = data.user_phone.replace(`${data.user_phone.substr(3, 7)}`, '****')
        this.phoneUser = data.user_phone
        this.phoneNumber = data.user_phone
        this.validateProfile = data
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan refresh halaman!',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    handleClosePopupOtp() {
      this.$refs['modal-verification-submit'].hide()
    },
    handleCloseNotifError() {
      this.errorConfirmOtp = false
    },
    countDownTimerResend() {
      if (this.countCanResendOtp > 0) {
        setTimeout(() => {
          this.countCanResendOtp -= 1
          this.countDownTimerResend()
        }, 1000)
      }
      if (this.countCanResendOtp === 0) {
        this.validateResendOtp = ''
        this.countSubmit = 0
      }
    },
    toggleVisibilityPin() {
      if (this.visibilityPin === 'password') {
        this.visibilityPin = 'text'
      } else {
        this.visibilityPin = 'password'
      }
    },
  },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
[dir] .otp-input {
    width: 40px;
    height: 40px;
    padding: 5px;
    margin: 0 10px;
    font-size: 20px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  [dir] .otp-input::-webkit-inner-spin-button,
  [dir] .otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
