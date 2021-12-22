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
              <b-col
                class="pb-2"
                md="12"
              >
                <h3 class="mb-2">
                  Profil
                </h3>
                <b-form-row>
                  <b-col cols="4">
                    <div class="text-center mr-md-1">
                      <b-avatar
                        size="86px"
                        :src="imageFile ? fileUrl(imageFile) : imageInitialFile"
                      />
                    </div>
                  </b-col>
                  <b-col cols="8">
                    <b-form-group
                      label="Foto profil"
                      label-cols-md="12"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Foto profil"
                        :rules="!editMode ? 'required' : ''"
                      >
                        <b-form-file
                          v-model="imageFile"
                          :state="errors.length > 0 ? false : null"
                          :placeholder="
                            imageInitialFile
                              ? imageInitialFile.split('/').pop()
                              : `Pilih atau drop file disini...`
                          "
                          drop-placeholder="Drop file disini..."
                          accept="image/*"
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                </b-form-row>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Nama lengkap"
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
                  label="Username"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Username"
                    rules="required|min:3"
                  >
                    <b-form-input
                      v-model="username"
                      :state="
                        errors.length || submitErrors.username > 0
                          ? false
                          : null
                      "
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.username
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Jenis kelamin"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Jenis kelamin"
                    rules="required"
                  >
                    <b-form-radio-group
                      v-model="gender"
                      class="mt-50"
                      :options="genderOptions"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Tanggal lahir"
                  label-cols-md="4"
                >
                  <flat-pickr
                    v-model="birthDate"
                    class="form-control"
                    :config="{
                      altInput: true,
                      altFormat: 'j F Y',
                      dateFormat: 'Y-m-d',
                    }"
                  />
                  <small class="text-danger">{{
                    submitErrors.birth_date
                  }}</small>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Status pernikahan"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Status pernikahan"
                    rules="required"
                  >
                    <b-form-radio-group
                      v-model="marital"
                      class="mt-50"
                      :options="maritalOptions"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Alamat
                </h3>
                <b-form-group
                  label="Alamat"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Alamat"
                    rules="required|min:5"
                  >
                    <b-form-textarea
                      v-model="address"
                      :state="
                        errors.length > 0 || submitErrors.address ? false : null
                      "
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.address
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Provinsi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Provinsi"
                    rules="required"
                  >
                    <v-select
                      v-model="provinceId"
                      label="name"
                      :reduce="option => option.id"
                      :options="provinceItems"
                      :state="
                        errors.length > 0 || submitErrors.province_id
                          ? false
                          : null
                      "
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.province_id
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Kota"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Kota"
                    rules="required"
                  >
                    <v-select
                      v-model="regencyId"
                      label="name"
                      :reduce="option => option.id"
                      :options="regencyItems"
                      :disabled="!provinceId"
                      :state="
                        errors.length > 0 || submitErrors.regency_id
                          ? false
                          : null
                      "
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.regency_id
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Kecamatan"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Kecamatan"
                    rules="required"
                  >
                    <v-select
                      v-model="districtId"
                      label="name"
                      :reduce="option => option.id"
                      :options="districtItems"
                      :disabled="!regencyId"
                      :state="
                        errors.length > 0 || submitErrors.district_id
                          ? false
                          : null
                      "
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.district_id
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Data Komerce
                </h3>
                <b-form-group
                  label="Divisi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Divisi"
                    rules="required"
                  >
                    <v-select
                      v-model="divisionId"
                      label="division_name"
                      :reduce="option => option.id"
                      :options="divisionItems"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Ketik untuk mencari..."
                    >
                      <li
                        v-if="hasMoreDivision"
                        slot="list-footer"
                        class="
                          vs__dropdown-option vs__dropdown-option--disabled
                        "
                      >
                        <feather-icon
                          icon="MoreHorizontalIcon"
                          size="16"
                        />
                      </li>
                    </v-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Posisi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Posisi"
                    rules="required"
                  >
                    <v-select
                      v-model="positionId"
                      label="position_name"
                      :reduce="option => option.id"
                      :options="positionItems"
                      :state="errors.length > 0 ? false : null"
                      :filterable="false"
                      :disabled="!divisionId"
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchPosition"
                    >
                      <li
                        v-if="hasMorePosition"
                        slot="list-footer"
                        class="
                          vs__dropdown-option vs__dropdown-option--disabled
                        "
                      >
                        <feather-icon
                          icon="MoreHorizontalIcon"
                          size="16"
                        />
                      </li>
                    </v-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Tanggal Bergabung"
                  label-cols-md="4"
                >
                  <flat-pickr
                    v-model="joinDate"
                    class="form-control"
                    :config="{
                      altInput: true,
                      altFormat: 'j F Y',
                      dateFormat: 'Y-m-d',
                    }"
                  />
                  <small class="text-danger">{{
                    submitErrors.join_date
                  }}</small>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Working space"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Working space"
                    rules="required"
                  >
                    <v-select
                      v-model="workingSpaceId"
                      label="office_name"
                      :reduce="option => option.id"
                      :options="workingSpaceItems"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Ketik untuk mencari..."
                    >
                      <li
                        v-if="hasMoreWorkingSpace"
                        slot="list-footer"
                        class="
                          vs__dropdown-option vs__dropdown-option--disabled
                        "
                      >
                        <feather-icon
                          icon="MoreHorizontalIcon"
                          size="16"
                        />
                      </li>
                    </v-select>
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Kontak
                </h3>
                <b-form-group
                  label="No hp"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="No hp"
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
                      :state="
                        errors.length > 0 || submitErrors.email ? false : null
                      "
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.email
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Akun Bank
                </h3>
                <b-form-group
                  label="Nama bank"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama Bank"
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
                  label="No rekening"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="No rekening"
                    rules="required|min:3"
                  >
                    <b-form-input
                      v-model="accountNumber"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Nama pemilik bank"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama pemilik bank"
                    rules="required"
                  >
                    <b-form-input
                      v-model="accountName"
                      :formatter="capitalize"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger d-block">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!editMode"
                md="12"
              >
                <h3 class="my-2">
                  Password
                </h3>
                <b-form-group
                  label="Password"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Password"
                    vid="Password"
                    rules="required|min:8"
                  >
                    <b-form-input
                      v-model="password"
                      type="password"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!editMode"
                md="12"
              >
                <b-form-group
                  label="Konfirmasi password"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Konfirmasi password"
                    rules="required|confirmed:Password"
                  >
                    <b-form-input
                      v-model="passwordConfirm"
                      :state="errors.length > 0 ? false : null"
                      type="password"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <hr class="mb-2">
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
  BAvatar,
  BFormRow,
  BFormRadioGroup,
  BFormTextarea,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import Cleave from 'vue-cleave-component'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.id'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    BForm,
    BFormRow,
    BRow,
    BCol,
    BButton,
    BSpinner,
    BFormFile,
    BAvatar,
    BFormRadioGroup,
    BCardActions,
    flatPickr,
    vSelect,
    Cleave,
  },
  data() {
    return {
      id: this.$route.params.id || this.$route.query.id,
      loading: false,
      loadingSubmit: false,
      submitErrors: '',

      required,
      min,
      minValue,

      userId: '',
      name: '',
      username: '',
      gender: '',
      birthDate: null,
      marital: '',

      address: '',
      provinceId: '',
      regencyId: '',
      districtId: '',

      positionId: '',
      divisionId: '',
      joinDate: null,
      workingSpaceId: '',
      email: '',
      phone: '',
      banks: [],
      bankCode: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      password: '',
      passwordConfirm: '',

      imageFile: null,
      imageInitialFile: null,
      hasMorePosition: false,
      hasMoreWorkingSpace: false,
      hasMoreDivision: false,
      positionItems: [],
      workingSpaceItems: [],
      divisionItems: [],
      provinceItems: [],
      regencyItems: [],
      districtItems: [],

      // name: 'Test Talent',
      // gender: '1',
      // marital: '1',
      // birthDate: '1990-05-12',
      // email: 'dendykm10@yopmail.com',
      // username: 'dendykm10',
      // phone: '081234567890',
      // divisionId: 2,
      // positionId: 1,
      // joinDate: '2021-03-09',
      // workingSpaceId: 24,
      // bankName: 'Mandiri',
      // accountNumber: '500123456',
      // accountName: 'Test Talent',
      // address: 'Jl. Proklamasi',
      // provinceId: 32,
      // regencyId: 3273,
      // districtId: 3273090,
      // password: 'password',
      // passwordConfirm: 'password',

      genderOptions: [
        { text: 'Laki-laki', value: 1 },
        { text: 'Perempuan', value: 2 },
      ],
      maritalOptions: [
        { text: 'Belum Menikah', value: 0 },
        { text: 'Menikah', value: 1 },
      ],
      options: {
        phone: {
          phone: true,
          phoneRegionCode: 'ID',
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
      const endpoint = '/staff'
      return this.editMode ? `${endpoint}/${this.id}` : endpoint
    },
  },
  watch: {
    provinceId(_, oldValue) {
      this.regencyId = oldValue ? '' : this.regencyId
      this.loadRegencies()
    },
    regencyId(_, oldValue) {
      this.districtId = oldValue ? '' : this.districtId
      this.loadDistricts()
    },
    divisionId(_, oldValue) {
      this.positionId = oldValue ? '' : this.positionId
      this.loadPositions()
    },
  },
  async mounted() {
    this.loadProvincies()
    this.loadWorkingSpaces()
    this.loadDivisions()
    this.loadBanks()
    if (this.editMode) await this.loadForm()
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
          formData.append('full_name', this.name)
          formData.append('username', this.username)
          formData.append('gender', this.gender)
          formData.append('birth_date', this.birthDate)
          formData.append('martial_status', this.marital)

          formData.append('province_id', this.provinceId)
          formData.append('regency_id', this.regencyId)
          formData.append('district_id', this.districtId)
          formData.append('address', this.address)

          formData.append('division_id', this.divisionId)
          formData.append('position_id', this.positionId)
          formData.append('join_date', this.joinDate)
          formData.append('office_id', this.workingSpaceId)

          formData.append('no_hp', this.phone)
          formData.append('email', this.email)

          formData.append(
            'bank_code',
            this.banks.find(bank => bank.name === this.bankName).code,
          )
          formData.append('bank_name', this.bankName)
          formData.append('bank_owner_name', this.accountName)
          formData.append('bank_no', this.accountNumber)
          formData.append('origin_village', '1')

          if (!this.editMode) {
            formData.append('password', this.password)
            formData.append('password_confirmation', this.passwordConfirm)
          } else {
            formData.append('user_id', this.userId)
          }

          if (this.imageFile) formData.append('photo_profile_url', this.imageFile)

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

          this.userId = data.id
          this.name = data.full_name
          this.username = data.username
          this.gender = data.gender
          this.birthDate = data.birth_date
          this.marital = data.martial_status

          this.address = data.address
          if (data.staff.district) {
            this.provinceItems = [data.staff.district.regency.province]
            this.provinceId = data.staff.district.regency.province.id
            this.regencyItems = [data.staff.district.regency]
            this.regencyId = data.staff.district.regency.id
            this.districtItems = [data.staff.district]
            this.districtId = data.staff.district.id
          }

          if (data.division_id) {
            this.divisionId = data.division_id
          }

          if (data.position_id) {
            this.positionItems = [
              { id: data.position_id, position_name: data.position_name },
            ]
            this.positionId = data.position_id
            this.loadPositions(data.position_name)
          }

          this.joinDate = data.join_date
          this.status = data.status
          if (data.office_id) {
            this.workingSpaceId = data.office_id
          }

          this.phone = data.no_hp
          this.email = data.email

          if (data.bank_accounts[0]?.bank_code) {
            this.bankName = data.bank_accounts[0].bank_name
            this.accountNumber = data.bank_accounts[0].bank_no
            this.accountName = data.bank_accounts[0].bank_owner_name
          }

          if (data.photo_profile_url) this.imageInitialFile = data.photo_profile_url
        })
        .finally(() => {
          this.$refs.formCard.showLoading = false
        })
    },
    loadProvincies() {
      return this.$http
        .get('/region/province', {
          params: {
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data
          this.provinceItems = data
        })
    },
    loadRegencies() {
      return this.$http
        .get('/region/regency', {
          params: {
            province_id: this.provinceId,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data
          this.regencyItems = data
        })
    },
    loadDistricts() {
      return this.$http
        .get('/region/district', {
          params: {
            regency_id: this.regencyId,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data
          this.districtItems = data
        })
    },
    onSearchPosition(search, loading) {
      if (search.length) {
        this.searchPosition(loading, search, this)
      }
    },
    searchPosition: _.debounce((loading, search, that) => {
      loading(true)
      that.loadPositions(search).finally(() => loading(false))
    }, 500),
    loadPositions(search) {
      return this.$http
        .post(
          '/position/pagination',
          {},
          {
            params: {
              division_id: this.divisionId,
              position_name: search,
              page: 1,
              limit: 5,
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data.data
          this.positionItems = Object.keys(data).map(key => data[key])
          this.hasMorePosition = response.data.data.total > this.positionItems.length
        })
    },
    loadWorkingSpaces() {
      return this.$http
        .post(
          '/office',
          {},
          {
            params: {
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data
          this.workingSpaceItems = data
        })
    },
    loadDivisions() {
      return this.$http
        .get('/division', {
          params: {
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          this.divisionItems = data
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
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
