<template>
  <b-card-actions
    ref="formCard"
    :title="`${editMode ? 'Ubah' : 'Tambah'} ${$route.meta.name.singular}`"
    no-actions
  >
    <b-row>
      <b-col md="6">
        <!-- form -->
        <validation-observer ref="formRules">
          <b-form>
            <b-row>
              <b-col md="12">
                <b-form-group
                  label="Nama"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama"
                    rules="required|min:3"
                  >
                    <b-form-input
                      v-model="name"
                      :state="
                        errors.length > 0 || submitErrors.name ? false : null
                      "
                      :formatter="capitalize"
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.name
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Skill"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Skill"
                    rules="required"
                  >
                    <v-select
                      v-model="skillId"
                      label="name"
                      :reduce="option => option.id"
                      :options="skillItems"
                      :state="errors.length > 0 ? false : null"
                      :filterable="false"
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchSkill"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Phone"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Phone"
                    rules="required"
                  >
                    <cleave
                      v-model="phone"
                      class="form-control"
                      :options="options.phone"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Email"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Email"
                    rules="required|email"
                  >
                    <b-form-input
                      v-model="email"
                      type="email"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
                <hr>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Bank Name"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Bank Name"
                    rules="required"
                  >
                    <v-select
                      v-model="bankName"
                      label="name"
                      :reduce="option => option.name"
                      :options="banks"
                      :filterable="true"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Account Name"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Account Name"
                    rules="required|min:3"
                  >
                    <b-form-input
                      v-model="accountName"
                      :formatter="capitalize"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Account Number"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Account Number"
                    rules="required"
                  >
                    <b-form-input
                      v-model="accountNumber"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger d-block">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
                <hr>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="City"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="City"
                    rules="required"
                  >
                    <v-select
                      v-model="cityId"
                      label="name"
                      :reduce="option => option.id"
                      :options="cityItems"
                      :state="errors.length > 0 ? false : null"
                      :filterable="false"
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchCity"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="NPWP"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="NPWP"
                  >
                    <cleave
                      v-model="npwp"
                      class="form-control"
                      :options="options.npwp"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="CV"
                  label-cols-md="4"
                >
                  <b-form-row>
                    <b-col>
                      <validation-provider
                        #default="{ errors }"
                        name="CV"
                      >
                        <b-form-file
                          v-model="cvFile"
                          :state="errors.length > 0 ? false : null"
                          :placeholder="
                            cvInitialFile
                              ? cvInitialFile.split('/').pop()
                              : `Pilih atau drop file disini...`
                          "
                          drop-placeholder="Drop file disini..."
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </b-col>
                    <b-col
                      v-if="cvInitialFile"
                      cols="auto"
                    >
                      <b-button
                        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                        v-b-tooltip.hover.top="'Lihat File'"
                        variant="gradient-secondary"
                        class="btn-icon"
                        target="_blank"
                        :href="cvFile ? fileUrl(cvFile) : cvInitialFile"
                      >
                        <feather-icon icon="FileIcon" />
                      </b-button>
                    </b-col>
                  </b-form-row>
                </b-form-group>
              </b-col>
              <b-col
                md="12"
                class="mt-2"
              >
                <b-button
                  :variant="editMode ? 'warning' : 'primary'"
                  type="submit"
                  class="mr-50"
                  :disabled="loadingSubmit"
                  @click.prevent="submit"
                >
                  <b-spinner
                    v-if="loadingSubmit"
                    small
                  />
                  Submit
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>
    </b-row>
  </b-card-actions>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BFormInput,
  BFormGroup,
  BForm,
  BRow,
  BCol,
  BButton,
  BSpinner,
  BFormFile,
  BFormRow,
  VBTooltip,
} from 'bootstrap-vue'
import { required, min } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import vSelect from 'vue-select'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.id'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {
    BCardActions,
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormFile,
    BFormGroup,
    BFormRow,
    BForm,
    BRow,
    BCol,
    BButton,
    BSpinner,
    vSelect,
    Cleave,
  },
  data() {
    return {
      id: this.$route.params.id,
      loadingSubmit: false,
      submitErrors: '',

      required,
      min,

      name: '',
      skillId: '',
      phone: '',
      email: '',
      cityId: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      npwp: '',
      cvFile: null,
      cvInitialFile: null,
      skillItems: [],
      cityItems: [],
      banks: [],

      options: {
        phone: {
          phone: true,
          phoneRegionCode: 'ID',
        },
        npwp: {
          delimiters: ['.', '.', '.', '-', '.'],
          blocks: [2, 3, 3, 1, 3, 3],
        },
      },
    }
  },
  computed: {
    method() {
      return this.editMode ? 'put' : 'post'
    },
    editMode() {
      return this.id !== undefined
    },
    successText() {
      return this.editMode
        ? `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
        : `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    endpoint() {
      const endpoint = '/instructure'
      return this.editMode ? `${endpoint}/${this.id}` : endpoint
    },
  },
  async mounted() {
    if (this.editMode) {
      this.loadForm()
      return
    }

    this.loadSkills()
    this.loadCities()
    this.loadBanks()
  },
  methods: {
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
    submit() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.loadingSubmit = true

          const formData = new FormData()
          formData.append('_method', this.method)
          formData.append('name', this.name)
          formData.append('skill_id', this.skillId)
          formData.append('phone', this.phone)
          formData.append('email', this.email)
          formData.append('regency_id', this.cityId)
          formData.append(
            'bank_code',
            this.banks.find(bank => bank.name === this.bankName).code,
          )
          formData.append('bank_name', this.bankName)
          formData.append('bank_account_number', this.accountNumber)
          formData.append('bank_account_name', this.accountName)
          formData.append('npwp', this.npwp)

          if (this.cvFile) formData.append('cv', this.cvFile)

          this.$http
            .post(this.endpoint, formData)
            .then(() => {
              this.$toast(
                {
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    text: this.successText,
                    variant: 'success',
                    attachment: 'CheckIcon',
                  },
                },
                { timeout: 2500 },
              )
              this.$router.push({ name: this.$route.meta.navActiveLink })
            })
            .catch(error => {
              this.loadingSubmit = false

              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(
                    error.response.data.data,
                  ).map(([key, value]) => [key, value[0]]),
                )
              }
            })
        }
      })
    },
    loadForm() {
      this.$refs.formCard.showLoading = true

      return this.$http
        .get(this.endpoint)
        .then(async response => {
          const { data } = response.data

          this.name = data.name
          this.skillItems = [data.skill]
          this.skillId = Number(data.skill_id)
          this.phone = data.phone
          this.email = data.email
          this.bankName = data.bank_name
          this.accountNumber = data.bank_account_number
          this.accountName = data.bank_account_name
          this.npwp = data.npwp
          this.cityItems = [data.regency]
          this.cityId = Number(data.regency_id)

          if (data.cv) this.cvInitialFile = data.cv
        })
        .finally(() => {
          this.$refs.formCard.showLoading = false
        })
    },
    onSearchSkill(search, loading) {
      if (search.length) {
        this.searchSkill(loading, search, this)
      }
    },
    searchSkill: _.debounce((loading, search, that) => {
      loading(true)
      that.loadSkills(search).finally(() => loading(false))
    }, 500),
    onSearchCity(search, loading) {
      if (search.length) {
        this.searchCity(loading, search, this)
      }
    },
    searchCity: _.debounce((loading, search, that) => {
      loading(true)
      that.loadCities(search).finally(() => loading(false))
    }, 500),
    loadSkills(search) {
      return this.$http
        .get('/skill', {
          params: {
            keyword: search,
            page: 1,
            limit: 5,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          this.skillItems = data
        })
    },
    loadCities(search) {
      return this.$http
        .get('/region/regency', {
          params: {
            keyword: search ?? 'jakarta', // TODO: remove initial keyword after pagination works
            page: 1,
            limit: 5,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data
          this.cityItems = data
        })
    },
    async getFile(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const filename = url.split('/').pop()

      return new File([blob], filename, { type: blob.type })
    },
    capitalize(value) {
      return value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    fileUrl: file => URL.createObjectURL(file),
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
