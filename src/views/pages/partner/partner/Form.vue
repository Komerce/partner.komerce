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
    <b-row :class="{ 'detail-mode': showDetailMode }">
      <b-col :md="showDetailMode ? 12 : 6">
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
                  <b-col
                    v-if="!showDetailMode"
                    cols="8"
                  >
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
              <b-col
                v-if="noPartner"
                md="12"
              >
                <b-form-group
                  label="Nomor Partner"
                  label-cols-md="4"
                >
                  <b-form-input
                    :value="noPartner ? `${noPartner} (Auto)` : ''"
                    :plaintext="showDetailMode"
                    disabled
                  />
                </b-form-group>
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
                      :plaintext="showDetailMode"
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
                      :state="errors.length > 0 ? false : null"
                      :plaintext="showDetailMode"
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
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        gender
                          ? genderOptions.find(item => item.value === gender)
                            .text
                          : ''
                      "
                      plaintext
                    />
                    <b-form-radio-group
                      v-else
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
                  label="NIK"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="NIK"
                    rules="required|integer|length:16"
                  >
                    <b-form-input
                      v-if="showDetailMode"
                      :value="nik"
                      plaintext
                    />
                    <cleave
                      v-else
                      v-model="nik"
                      class="form-control"
                      :options="options.nik"
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
                      :plaintext="showDetailMode"
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
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        provinceId
                          ? provinceItems.find(item => item.id === provinceId)
                            .name
                          : ''
                      "
                      plaintext
                    />
                    <v-select
                      v-else
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
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        regencyId
                          ? regencyItems.find(item => item.id === regencyId)
                            .name
                          : ''
                      "
                      plaintext
                    />
                    <v-select
                      v-else
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
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        districtId
                          ? districtItems.find(item => item.id === districtId)
                            .name
                          : ''
                      "
                      plaintext
                    />
                    <v-select
                      v-else
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
                <b-form-group
                  label="Kode pos"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Kode pos"
                    rules="integer|length:5"
                  >
                    <b-form-input
                      v-model="postalCode"
                      :state="errors.length > 0 ? false : null"
                      :plaintext="showDetailMode"
                    />
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
                    <b-form-input
                      v-if="showDetailMode"
                      :value="phone"
                      plaintext
                    />
                    <cleave
                      v-else
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
                      :plaintext="showDetailMode"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Nama PIC"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama PIC"
                    rules="min:3"
                  >
                    <b-form-input
                      v-model="picName"
                      :state="
                        errors.length > 0 || submitErrors.pic_name
                          ? false
                          : null
                      "
                      :formatter="capitalize"
                      :plaintext="showDetailMode"
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.pic_name
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="No hp PIC"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="No hp PIC"
                  >
                    <b-form-input
                      v-if="showDetailMode"
                      :value="picPhone"
                      plaintext
                    />
                    <cleave
                      v-else
                      v-model="picPhone"
                      class="form-control"
                      :options="options.phone"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
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
                    rules="min:3"
                  >
                    <b-form-input
                      v-model="accountNumber"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                      :plaintext="showDetailMode"
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
                  >
                    <b-form-input
                      v-model="accountName"
                      :formatter="capitalize"
                      :state="errors.length > 0 ? false : null"
                      :plaintext="showDetailMode"
                    />
                    <small class="text-danger d-block">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col
                v-if="!editProfileMode"
                md="12"
              >
                <h3 class="my-2">
                  Data Komerce
                </h3>
                <b-form-group
                  label="Tanggal Bergabung"
                  label-cols-md="4"
                >
                  <b-form-input
                    v-if="showDetailMode"
                    :value="dateFormat(joinDate, 'dd/mm/yyyy')"
                    plaintext
                  />
                  <flat-pickr
                    v-else
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
                <h3
                  v-if="editProfileMode"
                  class="my-2"
                >
                  Data Komerce
                </h3>
                <b-form-group
                  label="Sektor Bisnis"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Sektor Bisnis"
                    rules="required"
                  >
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        partnerCategoryId
                          ? partnerCategoryItems.find(
                            item => item.id === partnerCategoryId
                          ).partner_category_name
                          : ''
                      "
                      plaintext
                    />
                    <v-select
                      v-else
                      v-model="partnerCategoryId"
                      label="partner_category_name"
                      :reduce="option => option.id"
                      :options="partnerCategoryItems"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Ketik untuk mencari..."
                    >
                      <li
                        v-if="hasMorePartnerCategory"
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
                  label="Tipe Bisnis"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Tipe Bisnis"
                    rules="required"
                  >
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        businessTypeId
                          ? businessTypeItems.find(
                            item => item.id === businessTypeId
                          ).name
                          : ''
                      "
                      plaintext
                    />
                    <v-select
                      v-else
                      v-model="businessTypeId"
                      label="name"
                      :reduce="option => option.id"
                      :options="businessTypeItems"
                      :state="errors.length > 0 ? false : null"
                      placeholder="Ketik untuk mencari..."
                    >
                      <li
                        v-if="hasMoreBusinessType"
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
                  label="Nama brand"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Nama brand"
                  >
                    <b-form-input
                      v-model="brand"
                      :state="errors.length > 0 ? false : null"
                      :plaintext="showDetailMode"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Anggota tim"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Anggota tim"
                    rules="required"
                  >
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        totalMember
                          ? totalMemberOptions.find(
                            item => item.value === totalMember
                          ).text
                          : ''
                      "
                      plaintext
                    />
                    <b-form-select
                      v-else
                      v-model="totalMember"
                      :options="totalMemberOptions"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Referensi"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Referensi"
                    rules="required"
                  >
                    <b-form-input
                      v-if="showDetailMode"
                      :value="
                        reference
                          ? referenceOptions.find(
                            item => item.value === reference
                          ).text
                          : ''
                      "
                      plaintext
                    />
                    <b-form-select
                      v-else
                      v-model="reference"
                      :options="referenceOptions"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small class="text-danger">{{ errors[0] }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Bonus"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Bonus"
                  >
                    <b-form-textarea
                      v-model="bonus"
                      :state="
                        errors.length > 0 || submitErrors.bonus ? false : null
                      "
                      :plaintext="showDetailMode"
                    />
                    <small class="text-danger">{{
                      errors[0] || submitErrors.bonus
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  label="Status"
                  label-cols-md="4"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Status"
                    rules="required"
                  >
                    <b-form-input
                      v-if="showDetailMode || editProfileMode"
                      :value="
                        status
                          ? statusOptions.find(item => item.value === status)
                            .text
                          : ''
                      "
                      :plaintext="showDetailMode"
                      :disabled="editProfileMode"
                    />
                    <b-form-select
                      v-else
                      v-model="status"
                      :options="statusOptions"
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
              <b-col
                v-if="!showDetailMode"
                md="12"
              >
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
  BFormRadioGroup,
  BFormTextarea,
  BOverlay,
} from 'bootstrap-vue'
import { required, min, minValue } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.id'
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
    BOverlay,
    flatPickr,
    vSelect,
    Cleave,
  },
  mixins: [dateFormat],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    partnerId: {
      type: Number,
    },
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      submitErrors: '',

      required,
      min,
      minValue,

      noPartner: '',
      name: '',
      username: '',
      gender: '',
      nik: '',

      address: '',
      provinceId: '',
      regencyId: '',
      districtId: '',
      postalCode: '',

      joinDate: null,
      partnerCategoryId: '',
      businessTypeId: '',
      brand: '',
      totalMember: '',
      reference: '',
      bonus: '',
      status: '',

      email: '',
      phone: '',
      picName: '',
      picPhone: '',

      banks: [],
      bankCode: '',
      bankName: '',
      accountNumber: '',
      accountName: '',

      password: '',
      passwordConfirm: '',

      imageFile: null,
      imageInitialFile: null,
      hasMorePartnerCategory: false,
      hasMoreBusinessType: false,
      partnerCategoryItems: [],
      businessTypeItems: [],
      provinceItems: [],
      regencyItems: [],
      districtItems: [],

      // name: 'Test Partner',
      // phone: '081234567890',
      // gender: '1',
      // nik: '1234876543210008',
      // email: 'testpartner@mail.com',
      // username: 'testpartner',
      // partnerCategoryId: 1,
      // joinDate: '2021-03-09',
      // reference: 'Acara',
      // status: 'registered',
      // bankName: 'Mandiri',
      // accountNumber: '500123456',
      // accountName: 'Test Talent',
      // address: 'Jl. Proklamasi',
      // provinceId: 32,
      // regencyId: 3273,
      // districtId: 3273090,
      // password: 'password',
      // passwordConfirm: 'password',
      // picName: 'Jhon Doe',
      // picPhone: '081234567891',
      // bonus: '10%',
      // businessTypeId: 4,
      // brand: 'Adidas',
      // totalMember: '20 - 99',
      // postalCode: '51232',

      totalMemberOptions: [
        { text: '0 - 4 orang', value: '0 - 4' },
        { text: '5 - 19 orang', value: '5 - 19' },
        { text: '20 - 99 orang', value: '20 - 99' },
        { text: '> 100 orang', value: '> 100' },
      ],
      referenceOptions: [
        { text: 'Media Sosial', value: 'Media Sosial' },
        { text: 'Google search', value: 'Mesin Pencari Google' },
        { text: 'Rekomendasi Teman', value: 'Rekomendasi Teman' },
        { text: 'Acara', value: 'Acara' },
      ],
      genderOptions: [
        { text: 'Laki-laki', value: 1 },
        { text: 'Perempuan', value: 2 },
      ],
      statusOptions: [
        { text: 'Registered', value: 'registered' },
        { text: 'Active', value: 'active' },
        { text: 'Pause', value: 'pause' },
        { text: 'Off', value: 'off' },
      ],
      options: {
        phone: {
          phone: true,
          phoneRegionCode: 'ID',
        },
        nik: {
          delimiters: [' ', ' ', ' ', ' '],
          blocks: [4, 4, 4, 4],
        },
      },
    }
  },
  computed: {
    id() {
      if (this.editProfileMode) return this.$store.state.auth.userData.id
      if (this.showDetailMode) return this.partnerId
      return this.$route.params.id || this.$route.query.id
    },
    editProfileMode() {
      return this.$route.name === 'partner-profile'
    },
    showDetailMode() {
      return this.partnerId !== undefined
    },
    editMode() {
      return this.id !== undefined
    },
    successText() {
      return this.editMode
        ? `Satu ${this.$route.meta.name.singular} berhasil diperbaharui`
        : `Satu ${this.$route.meta.name.singular} berhasil ditambah`
    },
    endpointSubmit() {
      const endpoint = '/user/partner'
      return this.editMode ? `${endpoint}/edit` : `${endpoint}/add`
    },
    endpoint() {
      return `/user/partner/get-profile/${this.id}`
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
    this.loadPartnerCategories()
    this.loadBusinessTypes()
    this.loadProvincies()
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
          this.submitErrors = ''
          this.loadingSubmit = true

          const formData = new FormData()
          formData.append('full_name', this.name)
          formData.append('username', this.username)
          formData.append('gender', this.gender)
          formData.append('nik', this.nik)

          formData.append('province_id', this.provinceId)
          formData.append('regency_id', this.regencyId)
          formData.append('province_code', this.provinceId)
          formData.append(
            'province_name',
            this.provinceItems.find(item => item.id === this.provinceId)
              ?.name ?? '-',
          )
          formData.append('city_code', this.regencyId)
          formData.append(
            'city_name',
            this.regencyItems.find(item => item.id === this.regencyId)?.name
              ?? '-',
          )

          formData.append('district_id', this.districtId)
          formData.append('address', this.address)
          if (this.postalCode) formData.append('postal_code', this.postalCode)

          formData.append('no_hp', this.phone)
          formData.append('email', this.email)
          if (this.picName) formData.append('pic_name', this.picName)
          if (this.picPhone) formData.append('pic_phone', this.picPhone)

          if (this.bankName) {
            formData.append(
              'bank_code',
              this.banks.find(bank => bank.name === this.bankName).code,
            )
          }
          if (this.bankName) formData.append('bank_name', this.bankName)
          if (this.accountName) formData.append('bank_owner_name', this.accountName)
          if (this.accountNumber) formData.append('bank_no', this.accountNumber)

          if (this.joinDate) formData.append('join_date', this.joinDate)

          formData.append('partner_category_id', this.partnerCategoryId)
          formData.append(
            'partner_category_name',
            this.partnerCategoryItems.find(
              item => item.id === this.partnerCategoryId,
            )?.partner_category_name ?? '-',
          )
          formData.append('business_type_id', this.businessTypeId)
          if (this.brand) formData.append('brand_name', this.brand)
          formData.append('team_members', this.totalMember)
          formData.append('reference', this.reference)
          if (this.bonus) formData.append('bonus', this.bonus)

          formData.append('account_status', this.status)

          // Other
          // formData.append('status', '1')
          formData.append('role_id', '4')
          // formData.append('user_management_id', '0')

          formData.append('birth_date', '2000-02-01')
          // formData.append('no_partner', '72137')
          formData.append('martial_status', '1')
          // formData.append('partner_category_name', 'Health')
          // formData.append('province_code', '010000')
          // formData.append('province_name', 'PROV. D.K.I. JAKARTA')
          // formData.append('city_code', '016400')
          // formData.append('city_name', 'KOTA JAKARTA timur')
          if (this.editMode) formData.append('id', this.id)

          if (!this.editMode) {
            formData.append('password', this.password)
            formData.append('password_confirmation', this.passwordConfirm)
          }

          if (this.imageFile) formData.append('photo_profile_url', this.imageFile)

          this.$http
            .post(this.endpointSubmit, formData)
            .then(async response => {
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

                if (response.data.errors) {
                  this.submitErrors = Object.fromEntries(
                    Object.entries(response.data.errors).map(([key, value]) => [
                      key,
                      value[0],
                    ]),
                  )
                }

                return
              }

              if (this.editProfileMode) {
                const partnerProfileIncomplete = this.$store.state.auth.userData.role_name.toUpperCase()
                    === 'PARTNER' && !this.$store.state.auth.userData.nik

                const data = await this.getPartnerProfile(
                  this.$store.state.auth.userData.id,
                )

                const ability = [
                  { action: 'manage', subject: 'TalentPool' },
                  { action: 'manage', subject: 'Wishlist' },
                  { action: 'manage', subject: 'PartnerProfile' },
                  { action: 'manage', subject: 'DetailTalent' },
                ]

                data.ability = ability
                this.$ability.update(ability)
                localStorage.setItem('userData', JSON.stringify(data))
                this.$store.commit('auth/UPDATE_USER_DATA', data)

                if (partnerProfileIncomplete) {
                  this.$swal({
                    title: 'Profil Tersimpan',
                    html: `Kode Partner Anda adalah <b>${this.noPartner}</b>`,
                    icon: 'success',
                    confirmButtonText: 'Mengerti',
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  })
                } else {
                  this.$toast(
                    {
                      component: ToastificationContent,
                      props: {
                        title: 'Success',
                        text: 'Profil anda berhasil diperbaharui',
                        variant: 'success',
                        attachment: 'CheckIcon',
                      },
                    },
                    { timeout: 2500 },
                  )
                }

                this.$router.push({ name: 'talent-pools' })
                return
              }

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
              if (error.response.status === 422) {
                this.submitErrors = Object.fromEntries(
                  Object.entries(
                    error.response.data.data,
                  ).map(([key, value]) => [key, value[0]]),
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
      return this.$http
        .get(`/user/partner/get-profile/${userId}`)
        .then(response => response.data.data[0])
        .finally(() => {
          this.loading = false
        })
    },
    loadForm() {
      this.loading = true

      return this.$http
        .get(this.endpoint)
        .then(async response => {
          const data = response.data.data[0]

          this.noPartner = data.no_partner
          this.name = data.full_name
          this.username = data.username
          this.gender = data.gender
          this.nik = data.nik ?? data.partner_detail?.nik

          this.address = data.address
          this.postalCode = data.partner_detail?.postal_code
          if (data.partner_detail?.district) {
            this.provinceItems = [data.partner_detail.district.regency.province]
            this.provinceId = data.partner_detail.district.regency.province.id
            this.regencyItems = [data.partner_detail.district.regency]
            this.regencyId = data.partner_detail.district.regency.id
            this.districtItems = [data.partner_detail.district]
            this.districtId = data.partner_detail.district.id
          }

          if (data.join_date !== '0000-00-00') this.joinDate = data.join_date
          if (data.partner_detail?.partner_category_id) {
            this.partnerCategoryId = data.partner_detail.partner_category_id
          }

          if (data.partner_detail?.business_type_id) {
            this.businessTypeId = Number(data.partner_detail.business_type_id)
          }

          this.brand = data.partner_detail?.brand_name
          this.totalMember = data.partner_detail?.team_members

          this.reference = data.partner_detail?.reference
          this.bonus = data.partner_detail?.bonus
          this.status = data.partner_detail?.account_status

          this.phone = data.no_hp
          this.email = data.email
          this.picPhone = data.partner_detail?.pic_phone
          this.picName = data.partner_detail?.pic_name
          if (data.bank[0]?.bank_code) {
            this.bankName = data.bank[0].bank_name
            this.accountNumber = data.bank[0].bank_no
            this.accountName = data.bank[0].bank_owner_name
          }

          if (data.photo_profile_url) this.imageInitialFile = data.photo_profile_url
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
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
    loadPartnerCategories() {
      return this.$http
        .post(
          '/partnerCategory',
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
          this.partnerCategoryItems = data
        })
    },
    loadBusinessTypes() {
      return this.$http
        .get('/businessType', {
          params: {
            sort: 'name',
            direction: 'asc',
          },
        })
        .then(async response => {
          const { data } = response.data.data
          this.hasMoreBusinessType = response.data.data.total > data.length
          this.businessTypeItems = data
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
