<template>
  <b-overlay
    variant="light"
    :show="loading"
    spinner-variant="primary"
    blur="0"
    opacity=".5"
    rounded="sm"
    class="p-2"
  >
    <b-row>
      <b-col
        md="6"
      >
        <!-- form edit talent -->
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
                      >
                        <b-form-file
                          v-model="imageFile"
                          :state="errors.length > 0 ? false:null"
                          :placeholder="imageInitialFile ?
                            imageInitialFile.split('/').pop()
                            : `Pilih atau drop file disini...`"
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
                      :state="errors.length > 0 || submitErrors.name ? false:null"
                      :formatter="capitalize"
                    />
                    <small class="text-danger">{{ errors[0] || submitErrors.name }}</small>
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
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
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
                    :config="{ altInput: true, altFormat: 'j F Y', dateFormat: 'Y-m-d',}"
                  />
                  <small class="text-danger">{{ submitErrors.birth_date }}</small>
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
                      :state="errors.length > 0 || submitErrors.address ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] || submitErrors.address }}</small>
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
                  >
                    <v-select
                      v-model="provinceId"
                      label="name"
                      :reduce="option => option.id"
                      :options="provinceItems"
                      :state="errors.length > 0 || submitErrors.province_id ? false:null"
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{ errors[0] || submitErrors.province_id }}</small>
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
                  >
                    <v-select
                      v-model="regencyId"
                      label="name"
                      :reduce="option => option.id"
                      :options="regencyItems"
                      :disabled="!provinceId"
                      :state="errors.length > 0 || submitErrors.regency_id ? false:null"
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{ errors[0] || submitErrors.regency_id }}</small>
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
                  >
                    <v-select
                      v-model="districtId"
                      label="name"
                      :reduce="option => option.id"
                      :options="districtItems"
                      :disabled="!regencyId"
                      :state="errors.length > 0 || submitErrors.district_id ? false:null"
                      placeholder="Ketik untuk mencari..."
                    />
                    <small class="text-danger">{{ errors[0] || submitErrors.district_id }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Pendidikan dan Pengalaman Kerja
                </h3>
                <b-form-group
                  label="Pendidikan terakhir"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Education"
                  >
                    <b-form-select
                      v-model="education"
                      :options="educationOptions"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Pengalaman kerja"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Experience Status"
                  >
                    <b-form-radio-group
                      v-model="experienced"
                      class="mt-50"
                      :options="experienceStatusOptions"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <transition name="fade">
                <b-col
                  v-if="experienced"
                  md="12"
                >
                  <b-form-group
                    label="Lama bekerja"
                    label-cols-md="4"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="Experience Year"
                      rules="required"
                    >
                      <b-form-select
                        v-model="experienceYear"
                        :options="experienceYearOptions"
                        :state="errors.length > 0 ? false:null"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </transition>
              <b-col md="12">
                <h3 class="my-2">
                  Data Komerce
                </h3>
                <b-form-group
                  label="Posisi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Posisi"
                    rules="required"
                  >
                    <b-form-input
                      v-if="editProfileMode"
                      :value="positionId ? positionItems.find(item => item.id === positionId).position_name : ''"
                      :disabled="editProfileMode"
                    />
                    <v-select
                      v-else
                      v-model="positionId"
                      label="position_name"
                      :reduce="option => option.id"
                      :options="positionItems"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Ketik untuk mencari..."
                    >
                      <li
                        v-if="hasMorePosition"
                        slot="list-footer"
                        class="vs__dropdown-option vs__dropdown-option--disabled"
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
              <b-col
                v-if="!selfRegister && !editProfileMode"
                md="12"
              >
                <b-form-group
                  label="Tanggal Bergabung"
                  label-cols-md="4"
                >
                  <flat-pickr
                    v-model="joinDate"
                    class="form-control"
                    :config="{ altInput: true, altFormat: 'j F Y', dateFormat: 'Y-m-d',}"
                  />
                  <small class="text-danger">{{ submitErrors.join_date }}</small>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!selfRegister"
                md="12"
              >
                <b-form-group
                  label="Status"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Status"
                    rules="required"
                  >
                    <v-select
                      v-model="status"
                      disabled
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!selfRegister && !editProfileMode"
                md="12"
              >
                <b-form-group
                  label="Working space"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Working space"
                    :rules="hired ? 'required' : ''"
                  >
                    <v-select
                      v-model="workingSpaceId"
                      label="office_name"
                      :reduce="option => option.id"
                      :options="workingSpaceItems"
                      :state="errors.length > 0 ? false:null"
                      placeholder="Ketik untuk mencari..."
                    >
                      <li
                        v-if="hasMoreWorkingSpace"
                        slot="list-footer"
                        class="vs__dropdown-option vs__dropdown-option--disabled"
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
              <transition name="fade">
                <b-col
                  md="12"
                >
                  <b-form-group
                    label="No partner"
                    label-cols-md="4"
                    :rules="hired ? 'required' : ''"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="No partner"
                    >
                      <v-select
                        v-model="partnerNums"
                        :options="partnerItems"
                        :state="errors.length > 0 ? false:null"
                        :filterable="false"
                        placeholder="Ketik untuk mencari..."
                        disabled
                        multiple
                        @search="onSearchPartner"
                      >
                        <li
                          v-if="hasMorePartner"
                          slot="list-footer"
                          class="vs__dropdown-option vs__dropdown-option--disabled"
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
              </transition>
              <b-col
                md="12"
              >
                <b-form-group
                  label="Leader"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Leader"
                    :rules="required"
                  >
                    <v-select
                      v-model="staffId"
                      label="full_name"
                      :reduce="option => option.id"
                      :options="staffItems"
                      :state="errors.length > 0 ? false:null"
                      :filterable="false"
                      disabled
                      placeholder="Ketik untuk mencari..."
                      @search="onSearchStaff"
                    >
                      <li
                        v-if="hasMoreStaff"
                        slot="list-footer"
                        class="vs__dropdown-option vs__dropdown-option--disabled"
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
                      :state="errors.length > 0 || submitErrors.email ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] || submitErrors.email }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                md="12"
              >
                <h3 class="my-2">
                  Akun Bank
                </h3>
                <b-form-group
                  label="Nama bank"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama bank"
                    :rules="hired ? 'required' : ''"
                  >
                    <b-form-input
                      v-model="bankName"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!selfRegister && !editProfileMode"
                md="12"
              >
                <b-form-group
                  label="No rekening"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="No rekening"
                    :rules="hired ? 'required' : ''"
                  >
                    <b-form-input
                      v-model="accountNumber"
                      type="number"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!selfRegister && !editProfileMode"
                md="12"
              >
                <b-form-group
                  label="Nama pemilik bank"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama pemilik bank"
                    :rules="hired ? 'required' : ''"
                  >
                    <b-form-input
                      v-model="accountName"
                      :formatter="capitalize"
                      :state="errors.length > 0 ? false:null"
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
                      :state="errors.length > 0 ? false:null"
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
                      :state="errors.length > 0 ? false:null"
                      type="password"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Dokumen Pemutusan Hubungan Kerja
                </h3>
                <b-form-group
                  label="URL Dokumen"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="URL Dokumen"
                    rules="required"
                  >
                    <b-form-input
                      v-model="urlDocument"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="URL Lainnya"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="URL Lainnya"
                  >
                    <b-form-input
                      v-model="urlOther"
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                md="12"
              >
                <hr class="mb-2">
                <b-button
                  variant="primary"
                  type="submit"
                  class="mr-50"
                  :disabled="loadingSubmit"
                  @click.prevent="submit"
                >
                  <b-spinner
                    v-if="loadingSubmit"
                    small
                  />
                  Simpan
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>
    </b-row>
  </b-overlay>
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
  BFormSelect,
  BFormFile,
  BAvatar,
  BFormRow,
  BOverlay,
  BFormRadioGroup,
  BFormTextarea,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import Cleave from 'vue-cleave-component'
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
    BFormSelect,
    BFormFile,
    BAvatar,
    BFormRadioGroup,
    BOverlay,
    flatPickr,
    vSelect,
    Cleave,
  },
  data() {
    return {
      selfRegister: this.$route.name === 'talent-register',
      loading: false,
      loadingSubmit: false,
      submitErrors: '',

      required,
      min,
      minValue,

      name: '',
      username: '',
      gender: '',
      birthDate: null,
      marital: '',

      address: '',
      provinceId: '',
      regencyId: '',
      districtId: '',

      education: '',
      experienced: '',
      experienceYear: '',

      positionId: '',
      joinDate: null,
      status: '',
      workingSpaceId: '',
      partnerNums: [],
      staffId: '',
      email: '',
      phone: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      password: '',
      passwordConfirm: '',

      imageFile: null,
      imageInitialFile: null,
      hasMorePosition: false,
      hasMoreWorkingSpace: false,
      hasMorePartner: false,
      hasMoreStaff: false,
      positionItems: [],
      workingSpaceItems: [],
      partnerItems: [],
      staffItems: [],
      provinceItems: [],
      regencyItems: [],
      districtItems: [],

      urlDocument: '',
      urlOther: '',

      genderOptions: [
        { text: 'Laki-laki', value: 1 },
        { text: 'Perempuan', value: 2 },
      ],
      maritalOptions: [
        { text: 'Belum Menikah', value: 0 },
        { text: 'Menikah', value: 1 },
      ],
      educationOptions: [
        { text: 'SD', value: 'SD' },
        { text: 'SMP', value: 'SMP' },
        { text: 'SMA/SMK', value: 'SMA/SMK' },
        { text: 'Sarjana', value: 'Sarjana' },
      ],
      experienceStatusOptions: [
        { text: 'Ada', value: 1 },
        { text: 'Tidak ada', value: 0 },
      ],
      experienceYearOptions: [
        { text: '< 1 year', value: '< 1 year' },
        { text: '1 year', value: '1 year' },
        { text: '2 years', value: '2 years' },
        { text: '3 years', value: '3 years' },
      ],
      options: {
        phone: {
          phone: true,
          phoneRegionCode: 'ID',
        },
      },
      getId: '',
    }
  },
  computed: {
    id() {
      return this.$route.params.id || this.$route.query.id
    },
    hired() {
      return this.status === 'hired'
    },
    nonJob() {
      return this.status === 'non job'
    },
    candidate() {
      return this.status === 'registered' || this.status === 'selected'
    },
    resign() {
      return this.status === 'resign'
    },
    dismissed() {
      return this.status === 'dismissed'
    },
    editProfileMode() {
      return this.$route.name === 'talent-profile'
    },
    editMode() {
      return this.id !== undefined
    },
    successText() {
      return this.editMode ? `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
        : `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    endpoint() {
      const endpoint = 'docResign'
      return `/${endpoint}/${this.id}`
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
  },
  async mounted() {
    this.$http.get(`/docResign/${this.id}`).then(response => {
      const { data } = response.data
      this.getId = data.data_last_job.talent.id
    })
    this.loadProvincies()
    this.loadPositions()
    if (!this.selfRegister) this.loadWorkingSpaces()

    if (this.editMode) await this.loadForm()

    if (!this.selfRegister && (!this.editMode || !this.partnerItems.length)) this.loadPartners()
    if (!this.selfRegister && (!this.editMode || !this.staffItems.length)) this.loadStaffs()
  },
  methods: {
    submit() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          this.submitErrors = ''
          this.loadingSubmit = true

          const formData = {
            _method: 'put',
            username: this.username,
            full_name: this.name,
            gender: this.gender,
            birth_date: this.birthDate,
            martial_status: this.marital,
            province_id: this.provinceId,
            regency_id: this.regencyId,
            district_id: this.districtId,
            address: this.address,
            education: this.education,
            has_work_experience: this.experienced,
            year_experience: this.experienceYear,
            position_id: this.positionId,
            join_date: this.joinDate,
            status: this.status,
            office_id: this.workingSpaceId,
            user_management_id: this.staffId,
            no_partner: this.partnerNums,
            no_hp: this.phone,
            email: this.email,
            bank_name: this.bankName,
            bank_owner_name: this.accountName,
            bank_no: this.accountNumber,
            password: this.password,
            password_confirmation: this.passwordConfirm,
            photo_profile_url: this.imageFile,
            url_document: this.urlDocument,
            url_other: this.urlOther,
          }

          this.$http.post(`/talent/${this.getId}`, formData)
            .then(async response => {
              if (response.data.success !== undefined && !response.data.success) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Failed',
                    text: response.data.message,
                    variant: 'danger',
                    icon: 'AlertCircleIcon',
                  },
                }, { timeout: 2500 })

                return
              }

              const { data } = response

              if (!this.selfRegister && !this.editProfileMode) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    text: this.successText,
                    variant: 'success',
                    attachment: 'CheckIcon',
                  },
                }, { timeout: 2500 })
              }

              if (this.editProfileMode) {
                const profileData = await this.getPartnerProfile(this.$store.state.auth.userData.id)

                const ability = [
                  { action: 'read', subject: 'TalentHome' },
                  { action: 'manage', subject: 'TalentProfile' },
                ]
                profileData.ability = ability
                this.$ability.update(ability)
                localStorage.setItem('userData', JSON.stringify(profileData))
                this.$store.commit('auth/UPDATE_USER_DATA', profileData)

                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Success',
                    text: 'Profil anda berhasil diperbaharui',
                    variant: 'success',
                    attachment: 'CheckIcon',
                  },
                }, { timeout: 2500 })
              }

              this.$emit('on-submit', data)
            })
            .catch(error => {
              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(error.response.data.data).map(
                    ([key, value]) => [key, value[0]],
                  ),
                )
              }
            })
            .finally(() => {
              this.loadingSubmit = false
            })
        }
      })
    },
    getPartnerProfile(userId) {
      return this.$http.post('/user/get-profile', {
        user_id: userId,
      }).then(response => (Array.isArray(response.data.data) ? response.data.data[0] : response.data.data))
        .finally(() => {
          this.loading = false
        })
    },
    loadForm() {
      this.loading = true

      return this.$http.get(this.endpoint)
        .then(async response => {
          const { data } = response.data

          this.name = data.data_last_job.full_name
          this.username = data.data_last_job.username
          this.gender = data.data_last_job.gender
          this.birthDate = data.data_last_job.birth_date
          this.marital = data.data_last_job.martial_status

          this.address = data.data_last_job.address
          if (data.data_last_job.talent.district) {
            this.provinceItems = [data.data_last_job.talent.district.regency.province]
            this.provinceId = data.data_last_job.talent.district.regency.province.id
            this.regencyItems = [data.data_last_job.talent.district.regency]
            this.regencyId = data.data_last_job.talent.district.regency.id
            this.districtItems = [data.data_last_job.talent.district]
            this.districtId = data.data_last_job.talent.district.id
          }

          if (data.data_last_job.talent.education) {
            this.education = data.data_last_job.talent.education
          }
          if (data.data_last_job.talent.has_work_experience) {
            this.experienced = Number(data.data_last_job.talent.has_work_experience)
          }
          if (data.data_last_job.talent.year_experience) {
            this.experienceYear = data.data_last_job.talent.year_experience
          }

          if (data.data_last_job.position_id) {
            this.positionId = data.data_last_job.position_id
          }

          if (data.data_last_job.join_date !== '0000-00-00') this.joinDate = data.data_last_job.join_date
          this.status = data.status_off
          this.statusInitial = data.status_off

          this.workingSpaceId = data.data_last_job.office_name

          if (this.partnerNums && data.data_last_job.talent?.last_job_resign?.last_partner?.user?.full_name) {
            this.partnerNums = data.data_last_job.talent.last_job_resign.last_partner.user.full_name
          }

          if (data.data_last_job.talent?.last_job_resign?.last_team_lead?.full_name) {
            this.staffId = data.data_last_job.talent.last_job_resign.last_team_lead.full_name
          }

          this.phone = data.data_last_job.no_hp
          this.email = data.data_last_job.email

          if (data.bank_accounts.length) {
            this.bankName = data.bank_accounts[0].bank_name
            this.accountNumber = data.bank_accounts[0].bank_no
            this.accountName = data.bank_accounts[0].bank_owner_name
          }

          this.urlDocument = data.url_document
          this.urlOther = data.url_other

          if (data.data_last_job.photo_profile_url) this.imageInitialFile = data.data_last_job.photo_profile_url
        })
        .finally(() => {
          this.loading = false
        })
    },
    loadProvincies() {
      return this.$http.get('/region/province', {
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
      return this.$http.get('/region/regency', {
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
      return this.$http.get('/region/district', {
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
    loadPositions() {
      return this.$http.post('/position', {}, {
        params: {
          is_division_external: 1,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.positionItems = data
        })
    },
    loadWorkingSpaces() {
      return this.$http.post('/office', {}, {
        params: {
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data
          this.workingSpaceItems = data
        })
    },
    onSearchPartner(search, loading) {
      if (search.length) {
        this.searchPartner(loading, search, this)
      }
    },
    searchPartner: _.debounce((loading, search, that) => {
      loading(true)
      that.loadPartners(search).finally(() => loading(false))
    }, 500),
    loadPartners(search) {
      const key = /^-?\d+$/.test(search) ? 'no_partner' : 'name'

      return this.$http.get('/user/partner/pagination', {
        params: {
          [key]: search,
          account_status: 'active',
          page: 1,
          limit: 5,
          sort: 'name',
          direction: 'asc',
        },
      })
        .then(async response => {
          const { data } = response.data.data
          for (let i = 0; i < data.length; i += 1) {
            data[i].label = `${data[i].no_partner} - ${data[i].full_name}`
          }
          this.hasMorePartner = response.data.data.total > data.length
          this.partnerItems = data
        })
    },
    onSearchStaff(search, loading) {
      if (search.length) {
        this.searchStaff(loading, search, this)
      }
    },
    searchStaff: _.debounce((loading, search, that) => {
      loading(true)
      that.loadStaffs(search).finally(() => loading(false))
    }, 500),
    loadStaffs(search) {
      return this.$http.get('/leader', {
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
          this.hasMoreStaff = response.data.data.total > data.length
          this.staffItems = data
        })
    },
    async getFile(url) {
      const response = await fetch(url)
      const blob = await response.blob()
      const filename = url.split('/').pop()

      return new File([blob], filename, { type: blob.type })
    },
    capitalize(value) {
      return value.toLowerCase()
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
