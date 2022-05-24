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
      <h3 class="text-black ml-50">
        <strong>Pengaturan Alamat Penjemputan</strong>
      </h3>

      <!-- List & Edit -->
      <b-row
        v-for="(data, index) in dataAddress"
        :key="index + 1"
        class="mt-3 ml-50"
      >
        <b-col
          cols="11"
          class="border"
        >
          <b-row class="d-flex mt-50 mb-1">
            <b-col md="6">
              <h4 class="text-black">
                <strong>Alamat {{ index+1 }}</strong>
              </h4>
            </b-col>
            <b-col
              md="6"
              class="d-flex justify-content-end align-items-center"
            >
              <span
                v-if="data.is_default === 1"
                class="text-primary mr-50"
              >
                <strong>Alamat Utama</strong>
              </span>
              <b-button
                v-if="editMode === true"
                variant="flat-dark"
                class="btn-icon"
                @click="changeEditMode"
              >
                <feather-icon
                  icon="EditIcon"
                />
              </b-button>
              <b-button
                v-else
                variant="flat-dark"
                class="btn-icon"
                @click="editAddress(data)"
              >
                <feather-icon
                  icon="EditIcon"
                />
              </b-button>
            </b-col>
          </b-row>

          <validation-observer
            ref="formRulesEdit"
            #default="{invalid}"
          >
            <b-form>
              <b-row>
                <b-col
                  cols="12"
                  class="mb-1 ml-16 pl-50"
                >
                  <b-row>
                    <b-col
                      cols="4"
                    >
                      <label>
                        <h4 class="text-black">
                          Nama Tempat<span class="text-primary">*</span>
                        </h4>
                      </label>
                    </b-col>
                    <b-col
                      cols="7"
                    >
                      <validation-provider
                        #default="{errors}"
                        name="Nama Alamat"
                        rules="required"
                      >
                        <div v-if="editMode === true && editIdAddress === data.address_id">
                          <b-form-input
                            v-model="addressName"
                            :state="errors.length > 0 ? false:null"
                          />
                        </div>
                        <div v-else>
                          <b-form-input
                            v-model="data.address_name"
                            disabled
                          />
                        </div>
                        <small class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col
                  cols="12"
                  class="mb-1 ml-16 pl-50"
                >
                  <b-row>
                    <b-col
                      cols="4"
                    >
                      <label>
                        <h4 class="text-black">
                          Kelurahan/Kecamatan<span class="text-primary">*</span>
                        </h4>
                      </label>
                    </b-col>
                    <b-col
                      cols="7"
                    >
                      <div v-if="editMode === true && editIdAddress === data.address_id">
                        <validation-provider
                          #default="{errors}"
                          name="Kelurahan/Kecamatan"
                          rules="required"
                        >
                          <div
                            v-for="(dataOrigin, indexOrigin) in tes"
                            :key="indexOrigin+1"
                          >
                            <v-select
                              v-if="dataOrigin.id === data.destination_id"
                              v-model="originValue"
                              :options="itemsOriginEdit"
                              label="label"
                              :state="errors.length > 0 ? false:null"
                              @search="onSearchOrigin"
                            />
                          </div>
                          <v-select
                            v-if="handleOldOrigin === true"
                            v-model="originValue"
                            :options="itemsOriginEdit"
                            label="label"
                            :state="errors.length > 0 ? false:null"
                            @search="onSearchOrigin"
                          />
                          <small class="text-primary">{{ errors[0] }}</small>
                        </validation-provider>
                      </div>
                      <div v-else>
                        <div
                          v-for="(dataOrigin, indexOrigin) in tes"
                          :key="indexOrigin+1"
                        >
                          <div v-if="dataOrigin.id !== undefined">
                            <v-select
                              v-if="dataOrigin.id === data.destination_id"
                              v-model="dataOrigin.label"
                              label="label"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col
                  cols="12"
                  class="mb-3 ml-16 pl-50"
                >
                  <b-row>
                    <b-col
                      cols="4"
                    >
                      <label>
                        <h4 class="text-black">
                          Alamat Detail<span class="text-primary">*</span>
                        </h4>
                        <small>
                          Alamat ini akan jadi petunjuk kurir saat mau jemput barang. Pastikan kamu isi dengan detail ya.
                        </small>
                      </label>
                    </b-col>
                    <b-col
                      cols="7"
                    >
                      <div v-if="editMode === true && editIdAddress === data.address_id">
                        <validation-provider
                          #default="{errors}"
                          name="Alamat Detail"
                          rules="required"
                        >
                          <b-form-textarea
                            v-model="addressDetail"
                            placeholder="Alamat Detail"
                            rows="3"
                            :state="errors.length > 0 ? false:null"
                            :formatter="formatDetailAddress"
                            @keypress="validateInputDetail"
                          />
                          <b-row class="justify-content-between">
                            <small class="text-primary ml-1 mt-50">{{ errors[0] }}</small>
                            <small class="mr-1 mt-50">
                              <small
                                v-if="messageErrorLengthAddress"
                                class="text-primary"
                              >
                                *hindari menggunakan simbol (/) (=) (:) (;)
                              </small>
                              {{ addressDetail.length }}/85
                            </small>
                          </b-row>
                        </validation-provider>
                      </div>
                      <div v-else>
                        <b-form-textarea
                          v-model="data.address_detail"
                          placeholder="Alamat Detail"
                          disabled
                          rows="3"
                        />
                      </div>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col
                  cols="12"
                  class="mb-2"
                >
                  <h4 class="text-black">
                    <strong>
                      Penanggung Jawab
                    </strong>
                  </h4>
                </b-col>

                <b-col
                  cols="12"
                  class="mb-1 ml-16 pl-50"
                >
                  <b-row>
                    <b-col
                      cols="4"
                    >
                      <label for="name-product">
                        <h4 class="text-black">
                          Nama
                        </h4>
                      </label>
                    </b-col>
                    <b-col
                      cols="7"
                    >
                      <div v-if="editMode === true && editIdAddress === data.address_id">
                        <b-form-input
                          v-model="picName"
                          :formatter="formatName"
                          @keypress="validateInputName"
                        />
                        <b-row class="justify-content-end">
                          <small class="mr-1 mt-50">
                            <small
                              v-if="messageErrorLengthName"
                              class="text-primary"
                            >
                              *hindari menggunakan simbol (/) (=) (:) (;)
                            </small>
                            {{ picName.length }}/30
                          </small>
                        </b-row>
                      </div>
                      <div v-else>
                        <b-form-input
                          v-model="data.pic"
                          disabled
                        />
                      </div>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col
                  cols="12"
                  class="mb-1 ml-16 pl-50"
                >
                  <b-row>
                    <b-col
                      cols="4"
                    >
                      <label for="name-product">
                        <h4 class="text-black">
                          No. HP<span class="text-primary">*</span>
                        </h4>
                        <small>
                          Kurir yang jemput akan menghubungi nomor ini
                        </small>
                      </label>
                    </b-col>
                    <b-col
                      cols="7"
                    >
                      <div v-if="editMode === true && editIdAddress === data.address_id">
                        <validation-provider
                          #default="{errors}"
                          name="No. HP"
                          rules="required"
                        >
                          <b-form-input
                            v-model="phoneUser"
                            :state="errors.length > 0 ? false:null"
                            type="number"
                            @input="formatEditPhoneUser"
                            @keypress="validateEditInputPhone"
                          />
                          <b-row class="justify-content-between">
                            <small class="text-primary ml-1 mt-50">{{ errors[0] }}</small>
                            <small class="mr-1 mt-50">
                              <small
                                v-if="messageErrorPhone"
                                class="text-primary"
                              >
                                *minimal 9 digit dan hanya berupa angka.
                              </small>
                            </small>
                          </b-row>
                        </validation-provider>
                      </div>
                      <div v-else>
                        <b-form-input
                          v-model="data.phone"
                          disabled
                        />
                      </div>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col
                  v-if="editMode === true && editIdAddress === data.address_id"
                  md="12"
                  class="ml-16 pl-50"
                >
                  <b-form-group
                    label-cols-md="4"
                  >
                    <b-form-checkbox
                      v-model="isDefault"
                      @change="changeDefaultAddress"
                    >
                      <span class="text-black">Jadikan sebagai alamat utama</span>
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <transition name="fade">
                  <b-col
                    v-if="editMode === true && editIdAddress === data.address_id"
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
                      :disabled="invalid || messageErrorPhone === true"
                      @click.prevent="submitUpdateAddress"
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
      </b-row>

      <!-- Add Address -->
      <transition name="fade">
        <b-row
          v-if="formAddAddress === true"
          class="mt-3 ml-50"
        >
          <b-col
            cols="11"
            class="border"
          >
            <b-row class="d-flex mt-50 mb-1">
              <b-col md="6">
                <h4 class="text-black">
                  <strong>Tambah Alamat</strong>
                </h4>
              </b-col>
            </b-row>

            <validation-observer
              ref="formRulesAdd"
              #default="{invalid}"
            >
              <b-form class="">
                <b-row>
                  <b-col
                    cols="12"
                    class="mb-1 ml-16 pl-50"
                  >
                    <b-row>
                      <b-col
                        cols="4"
                      >
                        <label>
                          <h4 class="text-black">
                            Nama Tempat<span class="text-primary">*</span>
                          </h4>
                        </label>
                      </b-col>
                      <b-col
                        cols="7"
                      >
                        <validation-provider
                          #default="{errors}"
                          name="Nama Alamat"
                          rules="required"
                        >
                          <b-form-input
                            v-model="fieldAddAddressName"
                            placeholder="Contoh: Gudang Jawa Barat"
                            :state="errors.length > 0 ? false:null"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-col>
                    </b-row>
                  </b-col>

                  <b-col
                    cols="12"
                    class="mb-1 ml-16 pl-50"
                  >
                    <b-row>
                      <b-col
                        cols="4"
                      >
                        <label>
                          <h4 class="text-black">
                            Kelurahan/Kecamatan<span class="text-primary">*</span>
                          </h4>
                        </label>
                      </b-col>
                      <b-col
                        cols="7"
                      >
                        <validation-provider
                          #default="{errors}"
                          name="Kelurahan/Kecamatan"
                          rules="required"
                        >
                          <v-select
                            v-model="fieldAddOrigin"
                            :options="itemsOriginEdit"
                            label="label"
                            :state="errors.length > 0 ? false:null"
                            placeholder="Masukkan Kelurahan/Kecamatan"
                            @search="onSearchOrigin"
                          />
                          <small class="text-danger">{{ errors[0] }}</small>
                        </validation-provider>
                      </b-col>
                    </b-row>
                  </b-col>

                  <b-col
                    cols="12"
                    class="mb-3 ml-16 pl-50"
                  >
                    <b-row>
                      <b-col
                        cols="4"
                      >
                        <label>
                          <h4 class="text-black">
                            Alamat Detail<span class="text-primary">*</span>
                          </h4>
                          <small>
                            Alamat ini akan jadi petunjuk kurir saat mau jemput barang. Pastikan kamu isi dengan detail ya.
                          </small>
                        </label>
                      </b-col>
                      <b-col
                        cols="7"
                      >
                        <validation-provider
                          #default="{errors}"
                          name="Alamat Detail"
                          rules="required"
                        >
                          <b-form-textarea
                            v-model="fieldAddAddressDetail"
                            placeholder="Contoh: Jl. Raya Tamansari, Kompleks Karangwuni, Desa, Dusun I, Tamansari, Karangmoncol, Kabupaten Purbalingga, Jawa Tengah 53355"
                            rows="3"
                            :state="errors.length > 0 ? false:null"
                            :formatter="formatDetailAddress"
                            @keypress="validateInputDetail"
                          />
                          <b-row class="justify-content-between">
                            <small class="text-primary ml-1 mt-50">{{ errors[0] }}</small>
                            <small class="mr-1 mt-50">
                              <small
                                v-if="messageErrorLengthAddress"
                                class="text-primary"
                              >
                                *hindari menggunakan simbol (/) (=) (:) (;)
                              </small>
                              {{ fieldAddAddressDetail.length }}/85
                            </small>
                          </b-row>
                        </validation-provider>
                      </b-col>
                    </b-row>
                  </b-col>

                  <b-col
                    cols="12"
                    class="mb-2"
                  >
                    <h4 class="text-black">
                      <strong>
                        Penanggung Jawab
                      </strong>
                    </h4>
                  </b-col>

                  <b-col
                    cols="12"
                    class="mb-1 ml-16 pl-50"
                  >
                    <b-row>
                      <b-col
                        cols="4"
                      >
                        <label for="name-product">
                          <h4 class="text-black">
                            Nama
                          </h4>
                        </label>
                      </b-col>
                      <b-col
                        cols="7"
                      >
                        <b-form-input
                          v-model="fieldAddPicName"
                          placeholder="Masukkan Nama Penanggung Jawab Gudang"
                          :formatter="formatName"
                          @keypress="validateInputName"
                        />
                        <b-row class="justify-content-end">
                          <small class="mr-1 mt-50">
                            <small
                              v-if="messageErrorLengthName"
                              class="text-primary"
                            >
                              *hindari menggunakan simbol (/) (=) (:) (;)
                            </small>
                            {{ fieldAddPicName.length }}/30
                          </small>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>

                  <b-col
                    cols="12"
                    class="ml-16 pl-50"
                  >
                    <b-row>
                      <b-col
                        cols="4"
                      >
                        <label for="name-product">
                          <h4 class="text-black">
                            No. HP<span class="text-primary">*</span>
                          </h4>
                          <small>
                            Kurir yang jemput akan menghubungi nomor ini
                          </small>
                        </label>
                      </b-col>
                      <b-col
                        cols="7"
                      >
                        <validation-provider
                          #default="{errors}"
                          name="No. HP"
                          rules="required"
                        >
                          <b-form-input
                            v-model="fieldAddPhoneUser"
                            placeholder="Masukkan Nomor HP Penanggung Jawab Gudang"
                            type="number"
                            :state="errors.length > 0 ? false:null"
                            @input="formatPhoneUser"
                            @keypress="validateInputPhone"
                          />
                          <b-row class="justify-content-between">
                            <small class="text-primary ml-1 mt-50">{{ errors[0] }}</small>
                            <small class="mr-1 mt-50">
                              <small
                                v-if="messageErrorPhone"
                                class="text-primary"
                              >
                                *minimal 9 digit dan hanya berupa angka.
                              </small>
                            </small>
                          </b-row>
                        </validation-provider>
                      </b-col>
                    </b-row>
                  </b-col>

                  <b-col
                    md="12"
                    class="ml-16 pl-50"
                  >
                    <b-form-group
                      label-cols-md="4"
                    >
                      <b-form-checkbox
                        v-model="isDefault"
                        @change="changeDefaultAddress"
                      >
                        <span class="text-black">Jadikan sebagai alamat utama</span>
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>

                  <transition name="fade">
                    <b-col
                      md="12"
                      class="d-flex justify-content-end mt-1 pb-1"
                    >
                      <b-button
                        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                        type="submit"
                        variant="outline-primary"
                        class="mr-1"
                        @click.prevent="removeFormAddress"
                      >
                        Hapus
                      </b-button>
                      <b-button
                        v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                        type="reset"
                        variant="primary"
                        class="mr-1"
                        :disabled="invalid || messageErrorPhone === true"
                        @click.prevent="submitAddress"
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
        </b-row>
      </transition>

      <b-row class="mt-1">
        <b-col md="10">
          <div class="demo-inline-spacing">
            <b-button
              block
              variant="outline-primary"
              @click="addAddress"
            >
              <feather-icon
                icon="PlusIcon"
                class="mr-50"
                style="display: inline-block"
              />
              <span class="align-middle">Tambahkan Alamat</span>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-card>

    <!-- confirm Delete Address -->
    <b-modal
      ref="modal-confirm-delete-address"
      no-close-on-backdrop
      hide-header-close
      hide-header
      modal-class="modal-primary"
      centered
      title="Primary Modal"
    >
      <b-col
        md="12"
        class="d-flex justify-content-center pt-3"
      >
        <b-img
          width="100"
          src="@core/assets/image/icon-popup-warning.png"
        />
      </b-col>

      <b-col class="text-center mt-1">
        <h4>
          Ingin hapus Alamat ini ?
        </h4>
      </b-col>

      <template #modal-footer>
        <b-col
          md="12"
          class="d-flex justify-content-center pb-2"
        >
          <b-button
            variant="primary"
            class="mr-50"
            @click="deleteAddress"
          >
            Hapus
          </b-button>
          <b-button
            variant="flat-primary"
            @click="closeConfirmDelete"
          >
            Batal
          </b-button>
        </b-col>
      </template>
    </b-modal>

    <b-modal
      ref="modal-validate-address"
      no-close-on-backdrop
      hide-header-close
      hide-header
      modal-class="modal-primary"
      centered
      title="Primary Modal"
    >
      <b-col
        md="12"
        class="d-flex justify-content-center pt-3"
      >
        <b-img
          width="100"
          src="@core/assets/image/icon-popup-warning.png"
        />
      </b-col>

      <b-col class="text-center mt-1">
        <h4>
          Kamu tidak dapat menghapus alamat penjemputan yang menjadi alamat utama.
        </h4>
      </b-col>

      <template #modal-footer>
        <b-col
          md="12"
          class="d-flex justify-content-center pb-2"
        >
          <b-button
            variant="primary"
            class="mr-50"
            @click="closeAlertCannotDelete"
          >
            Oke
          </b-button>
        </b-col>
      </template>
    </b-modal>

    <!-- Modal can't delete address still in use -->
    <b-modal
      ref="modal-validate-address-stilluse"
      hide-header-close
      hide-header
      modal-class="modal-primary"
      centered
      title="Primary Modal"
    >
      <b-col
        md="12"
        class="d-flex justify-content-center pt-3 mb-2"
      >
        <b-img
          width="100"
          src="@core/assets/image/icon-popup-warning.png"
        />
      </b-col>

      <b-col class="text-center">
        <h4 class="text-black">
          Kamu tidak dapat menghapus alamat penjemputan karena sudah terhubung dengan orderku.
        </h4>
      </b-col>

      <template #modal-footer>
        <b-col
          md="12"
          class="d-flex justify-content-center pb-2"
        >
          <b-button
            variant="primary"
            @click="handleCloseModal"
          >
            Oke
          </b-button>
        </b-col>
      </template>
    </b-modal>
  </b-overlay>
</template>

<script>
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BCard,
  BRow,
  BCol,
  BForm,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BButton,
  BOverlay,
  BFormCheckbox,
  BSpinner,
  BModal,
  BImg,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from './http_komship'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    vSelect,
    BButton,
    BOverlay,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    BSpinner,
    BModal,
    BImg,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      isDefault: false,
      dataAddress: [],
      itemsOrigin: [],
      codeOrigin: [],
      fieldOrigin: '',
      formAddAddress: false,

      // Edit Mode
      editMode: false,
      editIdAddress: null,
      originValue: '',

      addressName: '',
      codeOriginEdit: [],
      itemsOriginEdit: [],
      addressDetail: '',
      picName: '',
      phoneUser: '',

      // Add Address
      fieldAddAddressName: '',
      fieldAddAddressDetail: '',
      fieldAddPicName: '',
      fieldAddPhoneUser: '',
      fieldAddOrigin: '',

      tes: [],
      dataDelete: null,

      // Validation
      required,

      dataIsDefault: 0,

      handleOldOrigin: false,

      messageErrorLengthAddress: false,
      messageErrorLengthName: false,
      messageErrorPhone: false,
    }
  },
  mounted() {
    this.getAddress()
  },
  methods: {
    getAddress() {
      this.loading = true
      httpKomship.get('/v1/address', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(async response => {
        const { data } = response.data
        data.forEach(this.myLoop)
        this.dataAddress = data
        this.loading = false
        return this.dataAddress
      }).catch(() => {
        this.loading = false
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    myLoop(data) {
      httpKomship.get(`/v1/destination?destination_id=${data.destination_id}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        if (response.data.data !== null) {
          this.tes.push(response.data.data)
          const seen = new Set()

          this.tes = this.tes.filter(el => {
            const duplicate = seen.has(el.id)
            seen.add(el.id)
            return !duplicate
          })
        }
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal load data, silahkan coba lagi!',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    submitAddress() {
      this.loadingSubmit = true
      this.$refs.formRulesAdd.validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('_method', 'post')
          formData.append('address_name', this.fieldAddAddressName)
          formData.append('origin_code', this.fieldAddOrigin.origin_code)
          formData.append('address_detail', this.fieldAddAddressDetail)
          formData.append('pic', this.fieldAddPicName)
          formData.append('zip_code', this.fieldAddOrigin.zip_code)
          formData.append('destination_id', this.fieldAddOrigin.id)
          formData.append('phone', this.fieldAddPhoneUser)
          formData.append('is_default', this.dataIsDefault)

          httpKomship.post('/v1/address/store', formData, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(response => {
            if (response.data.code !== 400) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Success menambahkan alamat pickup',
                  variant: 'success',
                },
              }, 2000)
              this.loadingSubmit = false
              this.formAddAddress = false
              this.getAddress()
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Gagal',
                  icon: 'AlertCircleIcon',
                  text: 'Gagal menambahkan alamat pickup, silahkan coba lagi!',
                  variant: 'danger',
                },
              }, 2000)
              this.loadingSubmit = false
              this.formAddAddress = false
              this.getAddress()
            }
          }).catch(() => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal menambahkan alamat, silahkan coba lagi',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    checkAddressIsDefault(data) {
      let result = false
      if (data.is_default > 0) {
        result = true
      }
      return result
    },
    addAddress() {
      this.fieldAddAddressName = ''
      this.fieldAddOrigin = ''
      this.fieldAddAddressDetail = ''
      this.fieldAddPicName = ''
      this.fieldAddPhoneUser = ''
      this.isDefault = false
      this.formAddAddress = true
      this.editMode = false
    },
    removeFormAddress() {
      this.formAddAddress = false
    },
    submitUpdateAddress() {
      this.loadingSubmit = true
      // eslint-disable-next-line dot-notation
      this.$refs['formRulesEdit'][0].validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('_method', 'put')
          formData.append('address_name', this.addressName)
          if (this.originValue !== null || this.originValue !== '') {
            formData.append('origin_code', this.originValue.origin_code)
            formData.append('destination_id', this.originValue.id)
            formData.append('zip_code', this.originValue.zip_code)
          }
          formData.append('address_detail', this.addressDetail)
          formData.append('pic', this.picName)
          formData.append('phone', this.phoneUser)
          formData.append('is_default', this.dataIsDefault)
          httpKomship.post(`/v1/address/update/${this.editIdAddress}`, formData, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(() => {
            this.tes = []
            this.handleOldOrigin = false
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Success update satu alamat pickup',
                variant: 'success',
              },
            })
            this.editMode = false
            this.getAddress()
          }).catch(() => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Failed',
                icon: 'AlertCircleIcon',
                text: 'Gagal update alamat pickup, silahkan coba lagi!',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    editAddress(data) {
      this.editMode = true
      this.editIdAddress = data.address_id
      this.addressName = data.address_name
      this.addressDetail = data.address_detail
      // eslint-disable-next-line array-callback-return
      this.tes.map(items => {
        if (items.id === data.destination_id) {
          this.originValue = items
        }
      })
      if (data.destination_id === 0) {
        this.handleOldOrigin = true
        this.originValue = null
      }
      this.picName = data.pic
      this.phoneUser = data.phone
      if (data.is_default === 0) {
        this.isDefault = false
      } else {
        this.isDefault = true
      }
    },
    confirmDelete(data) {
      this.dataDelete = data
      this.$refs['modal-confirm-delete-address'].show()
    },
    deleteAddress() {
      if (this.dataDelete.is_default !== 1) {
        httpKomship.delete(`/v1/address/delete/${this.dataDelete.address_id}`, {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        })
          .then(response => {
            this.$refs['modal-confirm-delete-address'].hide()
            this.getAddress()
            if (response.data.code === 400) {
              this.$refs['modal-validate-address-stilluse'].show()
            }
          }).catch(() => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal hapus alamat, silahkan coba lagi',
                variant: 'danger',
              },
            })
          })
      } else {
        this.$refs['modal-confirm-delete-address'].hide()
        this.$refs['modal-validate-address'].show()
      }
    },
    onSearchOrigin(search, loading) {
      if (search.length) {
        this.searchOrigin(loading, search, this)
      }
    },
    searchOrigin: _.debounce((loading, search, that) => {
      loading(true)
      that.loadOrigin(search).finally(() => loading(false))
    }, 500),
    loadOrigin(search) {
      return httpKomship.get(`/v1/destination?search=${search}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.itemsOriginEdit = response.data.data.data
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
    },
    changeDefaultAddress() {
      if (this.isDefault === false) {
        this.dataIsDefault = 0
      } else {
        this.dataIsDefault = 1
      }
    },
    changeEditMode() {
      this.editMode = false
    },
    closeConfirmDelete() {
      this.$refs['modal-confirm-delete-address'].hide()
    },
    closeAlertCannotDelete() {
      this.$refs['modal-validate-address'].hide()
    },
    handleCloseModal() {
      this.$refs['modal-validate-address-stilluse'].hide()
    },
    handleSelectOrigin(data) {
      this.originValue = data
    },
    formatDetailAddress(e) {
      return String(e).substring(0, 85)
    },
    formatName(e) {
      return String(e).substring(0, 30)
    },
    formatEditPhoneUser() {
      if (this.phoneUser.length < 9) {
        this.messageErrorPhone = true
      } else {
        this.messageErrorPhone = false
      }
    },
    formatPhoneUser() {
      if (this.fieldAddPhoneUser.length < 9) {
        this.messageErrorPhone = true
      } else {
        this.messageErrorPhone = false
      }
    },
    validateInputDetail(e) {
      if (e.keyCode === 47 || e.keyCode === 61 || e.keyCode === 58 || e.keyCode === 59) {
        e.preventDefault()
        this.messageErrorLengthAddress = true
      } else {
        this.messageErrorLengthAddress = false
      }
    },
    validateInputName(e) {
      if (e.keyCode === 47 || e.keyCode === 61 || e.keyCode === 58 || e.keyCode === 59) {
        e.preventDefault()
        this.messageErrorLengthName = true
      } else {
        this.messageErrorLengthName = false
      }
    },
    validateInputPhone(e) {
      if (e.keyCode === 46) {
        e.preventDefault()
      }
    },
    validateEditInputPhone(e) {
      if (e.keyCode === 46) {
        e.preventDefault()
      }
    },
  },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
