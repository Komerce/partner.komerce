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
        <strong> Profil</strong>
      </h3>

      <validation-observer ref="formRules">
        <b-form
          class="mt-3"
        >

          <h4 class="ml-1">
            <strong>Profil Penanggung Jawab</strong>
          </h4>
          <b-row class="mt-1">
            <b-col md="6">
              <b-form-group
                label="Nama Lengkap"
              >
                <validation-provider
                  #default="{errors}"
                  name="Nama Lengkap"
                  rules="required"
                >
                  <b-form-input
                    v-model="fullname"
                    placeholder="andrelaksana"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                label="No. HP"
              >
                <validation-provider
                  #default="{errors}"
                  name=" No. HP"
                  rules="required"
                >
                  <b-form-input
                    v-model="noHP"
                    type="number"
                    placeholder="0812 3456 7890"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Username"
              >
                <validation-provider
                  #default="{errors}"
                  name="Username"
                  rules="required"
                >
                  <b-form-input
                    v-model="username"
                    placeholder="andrelaksana"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Email"
              >
                <validation-provider
                  #default="{errors}"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    v-model="emailUser"
                    placeholder="andre@gmail.com"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <b-form-group
                label="Alamat"
              >
                <validation-provider
                  #default="{errors}"
                  name="Alamat"
                  rules="required"
                >
                  <b-form-textarea
                    v-model="address"
                    placeholder="Jl. Raya Tamansari, Kompleks Karangwuni, Dusun l,
Tamansari, Karangmoncol, Purbalingga, Jawa tengah,
53355"
                    rows="4"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

            </b-col>
            <b-col
              md="6"
            >
              <b-form-group
                label="Jenis Kelamin"
              >
                <validation-provider
                  #default="{errors}"
                  name="Jenis Kelamin"
                  rules="required"
                >
                  <b-form-radio-group
                    v-model="jenisKelamin"
                    :options="options"
                    value-field="value"
                    text-field="text"
                    disabled-field="disabled"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="12">
              <h4 class="mb-2">
                <strong>Profil Bisnis</strong>
              </h4>
              <b-form-group
                label="Upload Logo"
                class="mb-3"
                style="color:#black;"
              >
                <div class="mt-1 flex justify-center px-1 pt-4 pb-6 border-2 border-gray-300 border-dashed rounded-t-md">
                  <div class=" text-center">
                    <div class="flex text-sm text-gray-800">
                      <label
                        for="uploadLogo"
                        class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
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
                          @change="changeFile"
                        />
                      </label></div></div>
                  <label
                    v-if="logobisnis.length === 0"
                    for="uploadLogo"
                  >
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="false"
                    >

                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
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
                    @click="hapuslogo"
                  >
                    <feather-icon
                      icon="Trash2Icon"
                      size="20"
                    />
                  </label></div></b-form-group>
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
                @change="changeFile"
              />
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Nama Brand"
              >
                <validation-provider
                  #default="{errors}"
                  name="namaBrand"
                >
                  <b-form-input
                    v-model="namaBrand"
                    placeholder="Heiyo"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Sektor Bisnis"
              >
                <v-select
                  v-model="sektorBusiness"
                  label="Teknologi"
                  :options="sektorbisnis"
                  :reduce="option => option.sektorbisnis"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Lokasi"
              >
                <validation-provider
                  #default="{errors}"
                  name="Lokasi"
                >
                  <b-form-input
                    v-model="location"
                    placeholder="Purbalingga, Jawa Tengah"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                label="Tipe Bisnis"
              >
                <v-select
                  v-model="typeBusiness"
                  label="Produsen"
                  :options="tipebisnis"
                  :reduce="option => option.id"
                />
              </b-form-group>
            </b-col>
            <b-col
              md="12"
              class="d-flex justify-content-end mt-3"
            >
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click.prevent="simpanprofil"
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
  BFormFile,
  BSpinner,
  BOverlay,
  BFormTextarea,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { required, email } from '@validations'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { heightTransition } from '@core/mixins/ui/transition'

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
      selected: '',
      namaBrand: '',
      fullname: '',
      username: '',
      jenisKelamin: null,
      noHP: '',
      emailUser: '',
      address: '',
      imageFile: null,
      imageInitialFile: null,
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

      sektorbisnis: [],
      tipebisnis: [],

      logobisnis: [],

      required,
      email,
    }
  },
  mounted() {
    // calling api
  },
  methods: {
    hapuslogo() {
      this.imageFile = null
      this.logobisnis.splice(0, 1)
    },
    simpanprofil() {
      this.loadingSubmit = true
    //  calling api http post
    },
    loadprofile() {
      this.loading = true
      this.logobisnis.push({ logo: '' })
      // calling api http post
    },
    partnerCategory() {
      // calling api http post
    },
    loadbisnistype() {
      // calling api http get
    },
    changeFile() {
      this.logobisnis.splice(0, 1)
      this.logobisnis.push({ logo: '' })
    },
    fileUrl: file => (file ? URL.createObjectURL(file) : null),
  },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
