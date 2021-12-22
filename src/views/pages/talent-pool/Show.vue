<template>
  <b-card-actions
    ref="formCard"
    no-actions
  >
    <b-row class="mb-2">
      <b-col>
        <h4>Profil Talent</h4>
      </b-col>
      <b-col cols="auto">
        <b-button
          variant="outline-danger"
          class="btn-icon mr-50"
          :disabled="loadingWishlist"
          @click="wishlistToggle"
        >
          <feather-icon
            icon="HeartIcon"
            :class="{ filled: isWishlist() }"
          />
        </b-button>
        <b-button
          variant="primary"
          class="btn-icon"
          @click="confirmSend"
        >
          <feather-icon
            class="mr-25"
            icon="UserCheckIcon"
          />
          Rekrut
        </b-button>
      </b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col md="6">
        <!-- form -->
        <validation-observer ref="formRules">
          <b-form>
            <b-row>
              <b-col
                class="pb-2"
                md="12"
              >
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
                    <h2 class="text-capitalize mb-2">
                      {{ name.toLowerCase() }}
                    </h2>

                    <b-form-row class="mb-50">
                      <b-col cols="4">
                        <span class="text-muted">Posisi</span>
                      </b-col>
                      <b-col>
                        {{ positionName }}
                      </b-col>
                    </b-form-row>

                    <b-form-row class="mb-50">
                      <b-col cols="4">
                        <span class="text-muted">Lokasi</span>
                      </b-col>
                      <b-col>
                        {{ location }}
                      </b-col>
                    </b-form-row>

                    <b-form-row>
                      <b-col cols="4">
                        <span class="text-muted">Bergabung</span>
                      </b-col>
                      <b-col>
                        {{ dateRangeFormat(joinDate) }}
                      </b-col>
                    </b-form-row>
                  </b-col>
                </b-form-row>
              </b-col>
              <b-col
                md="12"
                class="pb-2"
              >
                <h3 class="my-2">
                  Training
                </h3>

                <div
                  v-if="loadingTrainingProgram || !name"
                  class="d-flex align-items-center"
                >
                  <b-spinner
                    class="mr-50"
                    small
                  />
                  Loading..
                </div>
                <div
                  v-else-if="!trainingProgramItems.length"
                  class="d-flex align-items-center text-secondary"
                >
                  <feather-icon
                    icon="InfoIcon"
                    class="mr-50"
                    size="16"
                  />
                  Belum mengikuti training
                </div>
                <app-timeline>
                  <app-timeline-item
                    v-for="item in trainingProgramItems"
                    :key="`trainingProgram-${item.id}`"
                    :title="`Telah lulus training ${item.name}`"
                    :subtitle="`Lulus pada ${dateFormat(
                      item.end_date,
                      'mmmm yyyy'
                    )}`"
                    variant="primary"
                  />
                </app-timeline>
              </b-col>
              <b-col md="12">
                <h3 class="my-2">
                  Pengalaman
                </h3>

                <div
                  v-if="loadingExperience || !name"
                  class="d-flex align-items-center"
                >
                  <b-spinner
                    class="mr-50"
                    small
                  />
                  Loading..
                </div>
                <div
                  v-else-if="!experienceItems.length"
                  class="d-flex align-items-center text-secondary"
                >
                  <feather-icon
                    icon="InfoIcon"
                    class="mr-50"
                    size="16"
                  />
                  Belum ada pengalaman
                </div>
                <app-timeline>
                  <app-timeline-item
                    v-for="item in experienceItems"
                    :key="`experience-${item.id}`"
                    :title="
                      item.partner_category || item.position
                        ? `${
                          item.partner_category
                            ? `Menangani produk ${item.partner_category.partner_category_name} sebagai `
                            : ''
                        }${item.position.position_name}`
                        : ''
                    "
                    :subtitle="dateRangeFormat(item.start_at, item.end_at)"
                    variant="primary"
                  />
                </app-timeline>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </b-col>
      <b-col>
        <div
          class="
            d-flex
            align-items-center
            card-subtitle
            justify-content-end
            mt-1
          "
        >
          <span class="text-muted mr-50">Rating:</span>
          <h4 class="mb-0">
            {{ rating }}
          </h4>
          <feather-icon
            icon="StarIcon"
            class="ml-25 text-warning filled mt-n25"
            size="16"
          />
        </div>
      </b-col>
    </b-row>
  </b-card-actions>
</template>

<script>
/* eslint-disable vue/no-unused-components */
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
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import { dateFormat } from '@core/mixins/ui/date'

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
    BCardActions,
    flatPickr,
    vSelect,
    Cleave,
    AppTimeline,
    AppTimelineItem,
  },
  mixins: [dateFormat],
  data() {
    return {
      id: this.$route.params.id || this.$route.query.id,
      selfRegister: this.$route.name === 'talent-register',
      loading: false,
      loadingSubmit: false,
      loadingExperience: false,
      loadingTrainingProgram: false,
      loadingWishlist: false,
      submitErrors: '',

      required,
      min,
      minValue,

      userId: '',
      talentId: '',
      name: '',
      positionName: '',
      address: '',
      provinceName: '',
      cityName: '',
      rating: 1,
      experienceItems: [],
      trainingProgramItems: [],
      wishlistItems: [],

      username: '',
      gender: '',
      birthDate: null,
      marital: '',

      provinceId: '',
      regencyId: '',
      districtId: '',

      education: '',
      experienced: '',
      experienceYear: '',

      positionId: '',
      joinDate: null,
      status: '',
      statusInitial: '',
      workingSpaceId: '',
      partnerNums: '',
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

      // name: 'Test Talent',
      // gender: '1',
      // marital: '1',
      // birthDate: '1990-05-12',
      // email: 'dendykm3@yopmail.com',
      // username: 'dendykm3',
      // phone: '081234567890',
      // positionId: 1,
      // joinDate: '2021-03-09',
      // status: '2',
      // bankName: 'Mandiri',
      // accountNumber: '500123456',
      // accountName: 'Test Talent',
      // address: 'Jl. Proklamasi',
      // provinceId: 32,
      // regencyId: 3273,
      // districtId: 3273090,
      // password: 'password',
      // passwordConfirm: 'password',
      // education: 'SMP',
      // experienced: 1,
      // experienceYear: '2 years',
      // workingSpaceId: 30,
      // partnerNums: [1837, 1758],
      // staffId: 5,

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
      const endpoint = '/talent'
      return this.editMode ? `${endpoint}/${this.id}` : `${endpoint}/register`
    },
    location() {
      if (!this.cityName && !this.provinceName) return this.address ?? '-'

      return `${this.cityName ? `${this.cityName}, ` : ''}${this.provinceName}`
    },
    statusOptions() {
      if (this.statusInitial === 'selected') {
        return [
          { text: 'Selected', value: 'selected' },
          { text: 'Hired', value: 'hired' },
          { text: 'Non Job', value: 'nonJob' },
        ]
      }

      if (this.statusInitial === 'hired' || this.statusInitial === 'nonJob') {
        return [
          { text: 'Hired', value: 'hired' },
          { text: 'Non Job', value: 'nonJob' },
        ]
      }

      return [
        { text: 'Registered', value: 'registered' },
        { text: 'Selected', value: 'selected' },
        { text: 'Hired', value: 'hired' },
        { text: 'Non Job', value: 'nonJob' },
      ]
    },
    partnerProfileIncomplete() {
      return (
        this.$store.state.auth.userData.role_name.toUpperCase() === 'PARTNER'
        && !this.$store.state.auth.userData.nik
      )
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
    this.loadProvincies()

    if (this.editMode) await this.loadForm()
    if (this.editMode) this.loadtrainingPrograms()
    if (this.editMode) this.loadExperiences()
    if (this.editMode && !this.partnerProfileIncomplete) this.loadWishlistItems()

    if (!this.editMode || !this.positionItems.length) this.loadPositions()
    if (
      !this.selfRegister
      && (!this.editMode || !this.workingSpaceItems.length)
    ) this.loadWorkingSpaces()
    if (!this.selfRegister && (!this.editMode || !this.partnerItems.length)) this.loadPartners()
    if (!this.selfRegister && (!this.editMode || !this.staffItems.length)) this.loadStaffs()
  },
  methods: {
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

          formData.append('education', this.education)
          formData.append('has_work_experience', this.experienced)
          if (this.experienced) formData.append('year_experience', this.experienceYear)

          formData.append('position_id', this.positionId)

          if (!this.selfRegister) {
            formData.append('join_date', this.joinDate)
            formData.append('status', this.status)
            formData.append('office_id', this.workingSpaceId)
            formData.append('user_management_id', this.staffId)

            if (this.status === 'hired') {
              this.partnerNums.forEach(item => {
                formData.append('no_partners[]', item)
              })
            }
          }

          formData.append('no_hp', this.phone)
          formData.append('email', this.email)

          if (!this.selfRegister) {
            formData.append('bank_name', this.bankName)
            formData.append('bank_owner_name', this.accountName)
            formData.append('bank_no', this.accountNumber)
          }

          if (!this.editMode) {
            formData.append('password', this.password)
            formData.append('password_confirmation', this.passwordConfirm)
          }

          if (this.imageFile) formData.append('photo_profile_url', this.imageFile)

          this.$http
            .post(this.endpoint, formData)
            .then(response => {
              if (response.data.status !== undefined && !response.data.status) {
                this.$toast(
                  {
                    component: ToastificationContent,
                    props: {
                      title: 'Failed',
                      text: response.data.message,
                      variant: 'danger',
                      icon: 'AlertCircleIcon',
                    },
                  },
                  { timeout: 2500 },
                )

                return
              }

              const { data } = response

              if (!this.selfRegister) {
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
              }

              this.$emit('on-submit', data)
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

          this.name = data.full_name
          this.address = data.address
          this.positionName = data.position_name
          this.cityName = data.city_name
          this.provinceName = data.province_name
          this.joinDate = data.join_date
          this.userId = data.talent.user_id
          this.talentId = data.talent.id
          this.rating = data.talent_rating

          this.username = data.username
          this.gender = data.gender
          this.birthDate = data.birth_date
          this.marital = data.martial_status

          this.address = data.address
          if (data.talent.district) {
            this.provinceItems = [data.talent.district.regency.province]
            this.provinceId = data.talent.district.regency.province.id
            this.regencyItems = [data.talent.district.regency]
            this.regencyId = data.talent.district.regency.id
            this.districtItems = [data.talent.district]
            this.districtId = data.talent.district.id
          }

          if (data.talent.education) {
            this.education = data.talent.education
          }
          if (data.talent.has_work_experience) {
            this.experienced = Number(data.talent.has_work_experience)
          }
          if (data.talent.year_experience) {
            this.experienceYear = data.talent.year_experience
          }

          if (data.position_id) {
            this.positionItems = [
              { id: data.position_id, position_name: data.position_name },
            ]
            this.positionId = data.position_id
            this.loadPositions(data.position_name)
          }
          this.status = data.talent.status
          this.statusInitial = data.talent.status

          if (data.office_id) {
            this.workingSpaceItems = [
              { id: data.office_id, office_name: data.office_name },
            ]
            this.workingSpaceId = data.office_id
            this.loadWorkingSpaces(data.office_name)
          }
          if (data.no_partners.length) {
            const items = data.partner_assignments
            for (let i = 0; i < items.length; i += 1) {
              items[i].label = `${items[i].no_partner} - ${items[i].full_name} `
            }
            this.partnerItems = items
            this.partnerNums = data.no_partners
          }
          if (data.management) {
            this.staffItems = [data.management]
            this.staffId = data.management.id
            this.loadStaffs(data.management.full_name)
          }

          this.phone = data.no_hp
          this.email = data.email

          if (data.bank_accounts.length) {
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
    loadExperiences() {
      this.loadingExperience = true

      return this.$http
        .get('/experience', {
          params: {
            talent_id: this.id,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          this.experienceItems = data
        })
        .catch(() => {})
        .finally(() => {
          this.loadingExperience = false
        })
    },
    loadtrainingPrograms() {
      this.loadingTrainingProgram = true

      return this.$http
        .get('/trainingProgram', {
          params: {
            talent_id: this.id,
            sort: 'name',
            direction: 'asc',
            status: 'graduated',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          this.trainingProgramItems = data
        })
        .catch(() => {})
        .finally(() => {
          this.loadingTrainingProgram = false
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
    onSearchWorkingSpace(search, loading) {
      if (search.length) {
        this.searchWorkingSpace(loading, search, this)
      }
    },
    searchWorkingSpace: _.debounce((loading, search, that) => {
      loading(true)
      that.loadWorkingSpaces(search).finally(() => loading(false))
    }, 500),
    loadWorkingSpaces(search) {
      return this.$http
        .post(
          '/office/pagination',
          {},
          {
            params: {
              office_name: search,
              page: 1,
              limit: 5,
              sort: 'name',
              direction: 'asc',
            },
          },
        )
        .then(async response => {
          const { data } = response.data.data
          this.hasMoreWorkingSpace = response.data.data.total > data.length
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
      return this.$http
        .get('/user/partner/pagination', {
          params: {
            name: search,
            page: 1,
            limit: 5,
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          for (let i = 0; i < data.length; i += 1) {
            data[i].label = `${data[i].no_partner} - ${data[i].full_name} `
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
      return this.$http
        .get('/staff', {
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
      return value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    dateRangeFormat(startAt, endAt = null) {
      if (!startAt || startAt === '0000-00-00 00:00:00') return '-'

      const startDate = Date.parse(startAt)
      const endDate = Date.parse(endAt)

      if (startDate > endDate) return '-'

      const yearDays = 365
      const yearToleranceDays = yearDays - 30
      const monthDays = 30
      const monthToleranceDays = monthDays - 7
      const weekDays = 7
      const weekToleranceDays = weekDays - 2

      const dateDiff = (endAt ? endDate : new Date()) - startDate
      let dayDiff = Math.ceil(dateDiff / (24 * 60 * 60 * 1000))
      let text = ''

      for (let i = 0; i < 2; i += 1) {
        if (dayDiff <= 0) break

        if (i > 0) text += ', '

        if (dayDiff >= yearToleranceDays) {
          let range = Math.floor(dayDiff / yearDays)
          dayDiff -= yearDays * range

          if (dayDiff >= yearToleranceDays) {
            dayDiff -= yearDays
            range += 1
          }

          text += `${range} tahun`
          if (dayDiff === 0) break
        } else if (dayDiff >= monthToleranceDays) {
          let range = Math.floor(dayDiff / monthDays)
          dayDiff -= monthDays * range

          if (dayDiff >= monthToleranceDays) {
            dayDiff -= monthDays
            range += 1
          }

          text += `${range} bulan`
          break
        } else if (dayDiff >= weekToleranceDays) {
          let range = Math.floor(dayDiff / weekDays)
          dayDiff -= weekDays * range

          if (dayDiff >= weekToleranceDays) {
            dayDiff -= weekDays
            range += 1
          }

          text += `${range} minggu`
          break
        } else {
          text += `${Math.ceil(dayDiff)} hari`
          break
        }
      }

      return text
    },
    confirmSend() {
      this.$swal({
        title: 'Anda yakin?',
        html:
          'Anda akan diarahkan ke kontak <b>Staff Growth</b> WhatsApp kami untuk penjelasan lebih lanjut tentang arus perekrutan.<br><br>Silakan klik tombol di bawah untuk diarahkan secara otomatis ke WhatsApp atau hubungi <b>+6283 8653 60055</b>',
        showCancelButton: true,
        confirmButtonText: 'Kirim Whatsapp',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.send()
        }
      })
    },
    send() {
      let city = this.$store.state.auth.userData.partner_detail.district?.regency
        ?.name ?? this.$store.state.auth.userData.partner_detail.city_name
      city = city ? ` dari ${city.toLowerCase()}` : ''
      const message = `Halo, Saya ${this.$store.state.auth.userData.full_name}${city}, mau hire talent dengan nama ${this.name} dengan talent id ${this.id}, bisa tolong dibantu?`

      window.open(
        `https://wa.me/6283865360055?text=${message}`,
        'MyWindow',
        'width=600,height=600',
      )
      return false
    },
    loadWishlistItems() {
      this.loadingWishlist = true

      return this.$http
        .get('/wishlist', {
          params: {
            partner_id: this.$store.state.auth.userData.partner_detail.id,
          },
        })
        .then(response => {
          const { data } = response.data.data
          this.total = response.data.data.total
          this.wishlistItems = data
        })
        .catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text:
                'Unable to load the wishlist data. Please try again later or contact support.',
              variant: 'danger',
            },
          })
        })
        .finally(() => {
          this.loadingWishlist = false
        })
    },
    isWishlist() {
      return this.wishlistItems
        .map(item => item.talent.id)
        .includes(this.talentId)
    },
    wishlistToggle() {
      if (this.partnerProfileIncomplete) {
        this.$swal({
          title: 'Lengkapi Profil',
          text:
            'Untuk dapat menambahkan talent ke wishlist, harap lengkapi profil Anda.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Lengkapi Profil',
          cancelButtonText: 'Lain kali',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        }).then(result => {
          if (result.value) {
            this.$router.push({ name: 'partner-profile' })
          }
        })

        return
      }

      const isWishlist = this.isWishlist(this.talentId)

      if (isWishlist) this.unWishlist()
      else this.wishlist()
    },
    wishlist() {
      this.wishlistItems.push({ talent: { id: this.talentId } })

      this.$http
        .post('/wishlist', {
          partner_id: this.$store.state.auth.userData.partner_detail.id,
          talent_id: this.talentId,
        })
        .then(response => {
          const dataRes = response.data.data

          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Success',
                text: 'Satu talent telah ditambahkan ke dalam wishlist',
                variant: 'success',
                icon: 'CheckIcon',
              },
            },
            { timeout: 2500 },
          )

          const index = this.wishlistItems
            .map(item => item.talent.id)
            .indexOf(this.talentId)
          this.wishlistItems[index] = dataRes
        })
        .catch(error => {
          const index = this.wishlistItems
            .map(item => item.talent.id)
            .indexOf(this.talentId)
          this.wishlistItems.splice(index, 1)

          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Failed',
                text: error.response.data.message,
                variant: 'danger',
                icon: 'AlertCircleIcon',
              },
            },
            { timeout: 2500 },
          )
        })
    },
    unWishlist() {
      const index = this.wishlistItems
        .map(item => item.talent.id)
        .indexOf(this.talentId)
      const wishlist = this.wishlistItems[index]

      if (!wishlist.id) return

      this.wishlistItems.splice(index, 1)

      this.$http
        .delete(`/wishlist/${wishlist.id}`, {
          _method: 'put',
        })
        .then(() => {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Success',
                text: 'Satu talent telah dihapus dari wishlist',
                variant: 'success',
                icon: 'CheckIcon',
              },
            },
            { timeout: 2500 },
          )
        })
        .catch(error => {
          this.wishlistItems.push(wishlist)

          this.$toast(
            {
              component: ToastificationContent,
              props: {
                title: 'Failed',
                text: error.response.data.message,
                variant: 'danger',
                icon: 'AlertCircleIcon',
              },
            },
            { timeout: 2500 },
          )
        })
    },
  },
}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
@import '~@core/scss/vue/libs/vue-flatpicker.scss';
</style>
