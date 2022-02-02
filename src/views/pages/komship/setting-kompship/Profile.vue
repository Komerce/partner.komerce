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
      <h3>
        <strong>Edit Profile</strong>
      </h3>

      <validation-observer ref="formRules">
        <b-form
          class="mt-4"
        >

          <h4 class="ml-2">
            <strong>Profile Penangguna Jawab</strong>
          </h4>
          <b-row class="mt-1">

            <b-col cols="8">
              <b-form-group
                label="Nama Lengkap"
                label-cols-md="3"
                class="ml-2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Nama Lengkap"
                  rules="required"
                >
                  <b-form-input
                    v-model="fullname"
                    placeholder="Nama Lengkap"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Username"
                label-cols-md="3"
                class="ml-2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Username"
                  rules="required"
                >
                  <b-form-input
                    v-model="username"
                    placeholder="Username"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Jenis Kelamin"
                label-cols-md="3"
                class="ml-2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Jenis Kelamin"
                  rules="required"
                >
                  <b-form-radio-group
                    v-model="jenisKelamin"
                    :options="options"
                    class="demo-inline-spacing mb-1"
                    value-field="value"
                    text-field="text"
                    disabled-field="disabled"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="No. HP"
                label-cols-md="3"
                class="ml-2"
              >
                <validation-provider
                  #default="{errors}"
                  name=" No. HP"
                  rules="required"
                >
                  <b-form-input
                    v-model="noHP"
                    type="number"
                    placeholder="Nomer HP"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Email"
                label-cols-md="3"
                class="ml-2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    v-model="emailUser"
                    placeholder="Email"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Alamat"
                label-cols-md="3"
                class="ml-2"
              >
                <validation-provider
                  #default="{errors}"
                  name="Alamat"
                  rules="required"
                >
                  <b-form-textarea
                    v-model="address"
                    placeholder="Alamat"
                    rows="3"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              cols="12"
              class="mt-2"
            >
              <h4 class="ml-2">
                <strong>Profile Pebisnis</strong>
              </h4>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Upload Logo"
                label-cols-md="3"
                class="ml-2"
              >
                <transition name="fade">
                  <b-avatar
                    v-if="fieldLogoBusiness.length > 0 && imageFile !== null"
                    v-model="imageFile"
                    variant="light-primary"
                    size="50"
                    :src="imageFile ? fileUrl(imageFile) : imageInitialFile"
                    class="mr-50"
                  />
                  <b-avatar
                    v-else
                    v-model="imageFile"
                    variant="light-primary"
                    size="50"
                    :src="imageFile ? fileUrl(imageFile) : imageInitialFile"
                    class="mr-50"
                  />
                </transition>
                <label
                  v-if="fieldLogoBusiness.length === 0"
                  for="uploadLogo"
                >
                  <b-avatar
                    variant="light-dark"
                    size="50"
                    class="btn btn-flat-primary btn-icon"
                  >
                    <feather-icon
                      icon="PlusIcon"
                      size="35"
                    />
                  </b-avatar>
                </label>
                <label
                  v-else
                  for="uploadLogo"
                  class="btn btn-flat-dark btn-icon"
                >
                  <feather-icon
                    icon="EditIcon"
                    size="20"
                  />
                </label>
                <label
                  v-if="imageFile !== null"
                  class="btn btn-flat-primary btn-icon"
                  @click="removeLogoBusiness"
                >
                  <feather-icon
                    icon="Trash2Icon"
                    size="20"
                  />
                </label>
                <b-form-file
                  id="uploadLogo"
                  v-model="imageFile"
                  :placeholder="
                    imageInitialFile
                      ? imageInitialFile.split('/').pop()
                      : `Pilih atau drop file disini...`
                  "
                  drop-placeholder="Drop file disini..."
                  accept="image/*"
                  class="d-none"
                  @change="tesChange"
                />
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Nama Bisnis"
                label-cols-md="3"
                class="ml-2"
              >
                <b-form-input
                  v-model="nameBusiness"
                  placeholder="Nama Bisnis"
                />
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Lokasi"
                label-cols-md="3"
                class="ml-2"
              >
                <v-select
                  v-model="cityCode"
                  :options="provinceItems"
                  :reduce="option => option.city_code"
                  label="values"
                  @search="onSearchProvince"
                />
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Sektor Bisnis"
                label-cols-md="3"
                class="ml-2"
              >
                <v-select
                  v-model="sektorBusiness"
                  label="partner_category_name"
                  :options="partnerCategoryItems"
                  :reduce="option => option.partner_category_name"
                />
              </b-form-group>
            </b-col>

            <b-col cols="8">
              <b-form-group
                label="Tipe Bisnis"
                label-cols-md="3"
                class="ml-2"
              >
                <v-select
                  v-model="typeBusiness"
                  label="name"
                  :options="businessTypeItems"
                  :reduce="option => option.id"
                />
              </b-form-group>
            </b-col>

            <!-- submit and reset -->
            <b-col
              class="d-flex justify-content-end mt-3"
              md="12"
            >
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click.prevent="updateProfile"
              >
                <b-spinner
                  v-if="loadingSubmit"
                  variant="light"
                  small
                />
                Submit
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                class="mr-5"
                @click.prevent="reset"
              >
                Reset
              </b-button>
            </b-col>
          </b-row>

        </b-form>
      </validation-observer>

    </b-card>
  </b-overlay>
</template>

<script>
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
import httpKomship from './http_komship'

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

      cityCode: '',

      // Validation
      required,
      email,
    }
  },
  mounted() {
    this.loadProfile()
    this.loadPartnerCategory()
    this.loadBusinessType()
    this.loadAllProvince()
  },
  methods: {
    removeLogoBusiness() {
      this.imageFile = null
      this.fieldLogoBusiness.splice(0, 1)
    },
    tesChange() {
      this.fieldLogoBusiness.splice(0, 1)
      this.fieldLogoBusiness.push({ logo: '' })
    },
    async updateProfile() {
      await this.loadAllProvince()
      console.log('imageFile', this.imageFile)
      console.log('imageInitialFile', this.imageInitialFile)
      this.loadingSubmit = true
      this.$refs.formRules.validate().then(success => {
        if (success) {
          if (this.imageInitialFile !== '' && this.imageInitialFile !== null) {
            console.log('tes2')
            if (this.imageInitialFile.includes('http')) {
              this.imageInitialFile = ''
              console.log('tes1')
            }
          }
          const formData = new FormData()
          formData.append('id', this.id)
          formData.append('username', this.username)
          formData.append('full_name', this.fullname)
          formData.append('no_hp', this.noHP)
          formData.append('address', this.address)
          formData.append('gender', this.jenisKelamin)
          if (this.imageInitialFile !== null && this.imageFile === null) {
            formData.append('business_logo', this.imageInitialFile)
          } else if (this.imageFile !== null) {
            formData.append('business_logo', this.imageFile)
          }
          formData.append('brand_name', this.nameBusiness)
          formData.append('partner_category_name', this.sektorBusiness)
          formData.append('business_type_id', this.typeBusiness)
          formData.append('business_location', String(this.location))
          formData.append('email', this.emailUser)
          formData.append('city_code', this.cityCode)
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
            console.log(err)
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal update profile, silahkan coba lagi',
                variant: 'danger',
              },
            })
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    loadProfile() {
      this.fieldLogoBusiness.push({ logo: '' })
      this.loading = true
      httpKomship.post('/v1/my-profile', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        console.log(data)
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
        this.emailUser = data.user_email
        this.address = data.user_address
        console.log('image', data.partner_business_logo)
        if (data.partner_business_logo) this.imageInitialFile = data.partner_business_logo
        this.nameBusiness = data.partner_business_name
        if (data.user_address_default !== null) {
          this.location = data.user_address_default.detail_address
        }
        if (data.address_partner_business) {
          this.cityCode = data.address_partner_business
          this.loadAllProvince()
        }
        this.sektorBusiness = data.partner_category_name
        this.typeBusiness = data.partner_business_type_id
        this.loading = false
      }).catch(err => {
        console.log('error get profile', err)
        this.loading = false
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load profile, silahkan coba lagi',
            variant: 'danger',
          },
        })
      })
    },
    loadPartnerCategory() {
      this.$http.post('/partnerCategory').then(response => {
        const { data } = response.data
        this.partnerCategoryItems = data
        return this.partnerCategoryItems
      })
    },
    loadBusinessType() {
      this.$http.get('/businessType').then(response => {
        const { data } = response.data.data
        this.businessTypeItems = data
        return this.businessTypeItems
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
          console.log('response province', data)
          this.provinceItems = data
          if (data.length === 1) {
            this.cityCode = data[0].city_code
          }
        })
    },
    loadAllProvince() {
      this.$http.get('/v1/partner/province-city')
        .then(response => {
          const { data } = response.data
          console.log('response province', data)
          data.forEach(this.filterProvince)
          console.log(this.cityCode)
          this.provinceItems = data
        })
    },
    filterProvince(data) {
      if (data.values === this.cityCode) {
        this.cityCode = data.city_code
      }
    },
    reset() {
      this.fullname = ''
      this.username = ''
      this.jenisKelamin = null
      this.noHP = ''
      this.emailUser = ''
      this.address = ''
      this.imageFile = null
      this.imageInitialFile = null
      this.nameBusiness = ''
      this.location = ''
      this.sektorBusiness = ''
      this.typeBusiness = ''
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
  },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
