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
    <b-card-actions
      no-actions
    >
      <b-row>
        <b-col md="6">
          <h3 class="mb-3">
            Detail
          </h3>
          <b-form @submit.prevent>
            <b-row>
              <h4 class="mb-2 ml-1">
                Profil
              </h4>
              <b-col
                class="pb-2"
                md="12"
              >
                <b-form-row>
                  <b-col cols="4">
                    <div class="text-center mr-md-1">
                      <b-avatar
                        size="86px"
                        class="mr-3"
                        :src="imageFile"
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
                        name="Foto Profil"
                      >
                        <b-form-file
                          v-model="imageFile"
                          disabled
                          :state="errors.length > 0 ? false:null"
                          :placeholder="imageInitialFile ?
                            imageInitialFile.split('/').pop()
                            : `Pilih atau drop file disini...`"
                          drop-placeholder="Drop file disini..."
                          accept="image/*"
                        />
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
                  <b-form-input
                    v-model="name"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Jenis kelamin"
                  label-cols-md="4"
                >
                  <b-form-radio-group
                    v-model="gender"
                    :options="genderOptions"
                    disabled
                    class="mt-50"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Tanggal lahir"
                  label-cols-md="4"
                >
                  <!-- <flat-pickr
                    class="form-control"
                    :config="{ altInput: true, altFormat: 'j F Y', dateFormat: 'Y-m-d',}"
                  /> -->
                  <b-form-input
                    v-model="birthdate"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Status Pernikahan"
                  label-cols-md="4"
                >
                  <b-form-radio-group
                    v-model="married"
                    :options="marriedOptions"
                    disabled
                    class="mt-50"
                  />
                </b-form-group>
              </b-col>

              <h4 class="mt-2 ml-1 mb-1">
                Alamat
              </h4>
              <b-col md="12">
                <b-form-group
                  label="Provinsi"
                  label-cols-md="4"
                >
                  <v-select
                    v-model="provinceId"
                    label="name"
                    disabled
                    placeholder="Ketik untuk mencari..."
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Kota"
                  label-cols-md="4"
                >
                  <v-select
                    v-model="regencyId"
                    label="name"
                    disabled
                    placeholder="Ketik untuk mencari..."
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Kecamatan"
                  label-cols-md="4"
                >
                  <v-select
                    v-model="districtId"
                    label="name"
                    disabled
                    placeholder="Ketik untuk mencari..."
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Detail Alamat"
                  label-cols-md="4"
                >
                  <b-form-input
                    v-model="address"
                    disabled
                  />
                </b-form-group>
              </b-col>

              <h4 class="mt-2 ml-1 mb-1">
                Pendidikan dan Pengalaman Kerja
              </h4>
              <b-col md="12">
                <b-form-group
                  label="Pendidikan Terakhir"
                  label-cols-md="4"
                >
                  <v-select
                    v-model="education"
                    label="name"
                    disabled
                    placeholder="Ketik untuk mencari..."
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Pengalaman Kerja"
                  label-cols-md="4"
                >
                  <b-form-radio-group
                    v-model="experienced"
                    :options="experienceStatusOptions"
                    disabled
                    class="mt-50"
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Lama Bekerja"
                  label-cols-md="4"
                >
                  <v-select
                    v-model="experienceYear"
                    :options="experienceYearOptions"
                    label="name"
                    disabled
                    placeholder="Ketik untuk mencari..."
                  />
                </b-form-group>
              </b-col>

              <h4 class="mt-2 ml-1 mb-1">
                Kontak
              </h4>
              <b-col md="12">
                <b-form-group
                  label="No HP"
                  label-cols-md="4"
                >
                  <b-form-input
                    v-model="contact"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Email"
                  label-cols-md="4"
                >
                  <b-form-input
                    v-model="email"
                    disabled
                  />
                </b-form-group>
              </b-col>

              <h4 class="mt-2 ml-1 mb-1">
                Nilai dan Sertifikat
              </h4>
              <b-col md="12">
                <b-form-group
                  label="Nilai"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Certificate"
                  >
                    <b-form-input
                      v-model="score"
                      disabled
                      :state="errors.length > 0 ? false:null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Sertifikat"
                  label-cols-md="4"
                >
                  <b-form-input
                    v-model="certificate"
                    disabled
                  />
                </b-form-group>
              </b-col>

              <!-- submit -->
              <b-col md="12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1 mt-3"
                  tag="router-link"
                  :to="{ name: $route.meta.navActiveLink, query: { tab: 'student-lulus' } }"
                >
                  Submit
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-col>
      </b-row>
    </b-card-actions>
  </b-overlay>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormRadioGroup,
  BFormRow,
  BAvatar,
  BFormFile,
  BOverlay,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import vSelect from 'vue-select'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BCardActions,
    BFormRadioGroup,
    BFormRow,
    BAvatar,
    BFormFile,
    vSelect,
    BOverlay,
    ValidationProvider,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      imageFile: null,
      imageInitialFile: null,
      name: '',
      gender: '',
      birthdate: '',
      married: '',

      provinceId: '',
      regencyId: '',
      districtId: '',
      address: '',

      education: '',
      experienced: '',
      experienceYear: '',

      contact: '',
      email: '',

      score: '',
      certificate: '',

      studentId: this.$route.params.student_id,
      genderOptions: [
        { text: 'Laki-laki', value: 1 },
        { text: 'Perempuan', value: 2 },
      ],

      marriedOptions: [
        { text: 'Menikah', value: 1 },
        { text: 'Belum Menikah', value: 2 },
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
    }
  },
  mounted() {
    this.loadForm()
  },
  methods: {
    loadForm() {
      return this.$http.get(`/lms/user/${this.studentId}`).then(response => {
        const { data } = response.data
        this.imageFile = data.user_img
        this.name = data.user_fullname
        this.gender = data.user_gender
        this.birthdate = data.user_birth_date
        this.married = data.user_martial_status
        this.provinceId = data.user_province
        this.regencyId = data.user_regency
        this.districtId = data.user_district
        this.address = data.user_address
        this.education = data.user_education
        this.experienced = data.user_has_work_experience
        this.experienceYear = data.user_work_experience
        this.contact = data.user_phone
        this.email = data.user_email
        this.score = data.user_course_score
        this.certificate = data.user_certificate
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
