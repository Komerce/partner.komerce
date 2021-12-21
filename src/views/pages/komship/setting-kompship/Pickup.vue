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

      <h4>
        <strong>Pengaturan Alamat Penjemputan</strong>
      </h4>

      <!-- List & Edit -->
      <b-row
        v-for="(data, index) in dataAddress"
        :key="index + 1"
        class="mt-3"
      >
        <b-col
          cols="10"
          class="border"
        >

          <b-row class="d-flex mt-50 mb-1">
            <b-col md="6">
              <h5>
                <strong>Alamat {{ index+1 }}</strong>
              </h5>
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

          <validation-observer ref="formRulesEdit">
            <b-form>
              <b-row>

                <b-col cols="10">
                  <b-form-group
                    label="Nama Alamat"
                    label-cols-md="3"
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
                  </b-form-group>
                </b-col>

                <b-col cols="10">
                  <b-form-group
                    label="Kota/Kecamatan"
                    label-cols-md="3"
                  >
                    <div v-if="editMode === true && editIdAddress === data.address_id">
                      <div
                        v-for="(dataOrigin, indexOrigin) in tes"
                        :key="indexOrigin+1"
                      >
                        <v-select
                          v-if="dataOrigin.value === data.origin_code"
                          v-model="dataOrigin.label"
                          :options="itemsOriginEdit"
                          label="label"
                          @search="onSearchOrigin"
                        />
                      </div>
                    </div>
                    <div v-else>
                      <div
                        v-for="(dataOrigin, indexOrigin) in tes"
                        :key="indexOrigin+1"
                      >
                        <v-select
                          v-if="dataOrigin.value === data.origin_code"
                          v-model="dataOrigin.label"
                          label="label"
                          disabled
                        />
                      </div>
                    </div>
                  </b-form-group>
                </b-col>

                <b-col cols="10">
                  <b-form-group
                    label="Alamat Detail"
                    label-cols-md="3"
                  >
                    <div v-if="editMode === true && editIdAddress === data.address_id">
                      <b-form-textarea
                        v-model="addressDetail"
                        placeholder="Alamat Detail"
                        rows="3"
                      />
                    </div>
                    <div v-else>
                      <b-form-textarea
                        v-model="data.address_detail"
                        placeholder="Alamat Detail"
                        disabled
                        rows="3"
                      />
                    </div>
                  </b-form-group>
                </b-col>

                <b-col cols="10">
                  <b-form-group
                    label="Nama PIC"
                    label-cols-md="3"
                  >
                    <div v-if="editMode === true && editIdAddress === data.address_id">
                      <b-form-input
                        v-model="picName"
                      />
                    </div>
                    <div v-else>
                      <b-form-input
                        v-model="data.pic"
                        disabled
                      />
                    </div>
                  </b-form-group>
                </b-col>

                <b-col cols="10">
                  <b-form-group
                    label="No. HP"
                    label-cols-md="3"
                  >
                    <div v-if="editMode === true && editIdAddress === data.address_id">
                      <b-form-input
                        v-model="phoneUser"
                      />
                    </div>
                    <div v-else>
                      <b-form-input
                        v-model="data.phone"
                        disabled
                      />
                    </div>
                  </b-form-group>
                </b-col>

                <b-col
                  v-if="editMode === true && editIdAddress === data.address_id"
                  md="10"
                >
                  <b-form-group
                    label-cols-md="3"
                  >
                    <b-form-checkbox
                      v-model="isDefault"
                      @change="changeDefaultAddress"
                    >
                      Jadikan sebagai alamat utama
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
          class="mt-3"
        >
          <b-col
            cols="10"
            class="border"
          >

            <b-row class="d-flex mt-50 mb-1">
              <b-col md="6">
                <h5>
                  <strong>Tambah Alamat</strong>
                </h5>
              </b-col>
            </b-row>

            <validation-observer ref="formRulesAdd">
              <b-form>
                <b-row>

                  <b-col cols="10">
                    <b-form-group
                      label="Nama Alamat"
                      label-cols-md="3"
                    >
                      <validation-provider
                        #default="{errors}"
                        name="Nama Alamat"
                        rules="required"
                      >
                        <b-form-input
                          v-model="fieldAddAddressName"
                          :state="errors.length > 0 ? false:null"
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col cols="10">
                    <b-form-group
                      label="Kode Post/Kecamatan"
                      label-cols-md="3"
                    >
                      <validation-provider
                        #default="{errors}"
                        name="Kode Post/Kecamatan"
                        rules="required"
                      >
                        <v-select
                          v-model="fieldAddOrigin"
                          :options="itemsOriginEdit"
                          label="label"
                          :state="errors.length > 0 ? false:null"
                          @search="onSearchOrigin"
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col cols="10">
                    <b-form-group
                      label="Alamat Detail"
                      label-cols-md="3"
                    >
                      <validation-provider
                        #default="{errors}"
                        name="Alamat Detail"
                        rules="required"
                      >
                        <b-form-textarea
                          v-model="fieldAddAddressDetail"
                          placeholder="Alamat Detail"
                          rows="3"
                          :state="errors.length > 0 ? false:null"
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col cols="10">
                    <b-form-group
                      label="Nama PIC"
                      label-cols-md="3"
                    >
                      <b-form-input
                        v-model="fieldAddPicName"
                      />
                    </b-form-group>
                  </b-col>

                  <b-col cols="10">
                    <b-form-group
                      label="No. HP"
                      label-cols-md="3"
                    >
                      <b-form-input
                        v-model="fieldAddPhoneUser"
                      />
                    </b-form-group>
                  </b-col>

                  <b-col
                    md="10"
                  >
                    <b-form-group
                      label-cols-md="3"
                    >
                      <b-form-checkbox
                        v-model="isDefault"
                        @change="changeDefaultAddress"
                      >
                        Jadikan sebagai alamat utama
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
              />
              <span class="align-middle">Tambahkan Alamat</span>
            </b-button>
          </div>
        </b-col>
      </b-row>

    </b-card>
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

      tes: null,

      // Validation
      required,
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
      }).then(response => {
        const { data } = response.data
        data.forEach(this.myLoop)
        this.dataAddress = data
        this.loading = false
        return this.dataAddress
      })
    },
    myLoop(data) {
      httpKomship.get(`/v1/origin?search=${data.origin_code}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.itemsOrigin.push(response.data.data[0])
        const result = this.itemsOrigin.reduce((unique, o) => {
          if (!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
            unique.push(o)
          }
          return unique
        }, [])
        this.tes = result
      })
    },
    submitAddress() {
      this.loadingSubmit = true
      this.$refs.formRulesAdd.validate().then(success => {
        if (success) {
          const formData = new FormData()
          formData.append('_method', 'post')
          formData.append('address_name', this.fieldAddAddressName)
          formData.append('origin_code', this.fieldAddOrigin.value)
          formData.append('address_detail', this.fieldAddAddressDetail)
          formData.append('pic', this.fieldAddPicName)
          formData.append('phone', this.fieldAddPhoneUser)
          formData.append('is_default', this.isDefault)

          httpKomship.post('/v1/address/store', formData, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(() => {
            this.loadingSubmit = false
            this.formAddAddress = false
            this.getAddress()
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
            })
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    addAddress() {
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
          formData.append('origin_code', this.originValue)
          formData.append('address_detail', this.addressDetail)
          formData.append('pic', this.picName)
          formData.append('phone', this.phoneUser)
          formData.append('is_default', this.dataIsDefault)

          httpKomship.post(`/v1/address/update/${this.editIdAddress}`, formData, {
            headers: { Authorization: `Bearer ${useJwt.getToken()}` },
          }).then(() => {
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
                text: 'Gagal update alamat pickup',
                variant: 'danger',
              },
            })
          })
        }
      })
    },
    editAddress(data) {
      this.editMode = true
      this.editIdAddress = data.address_id
      this.addressName = data.address_name
      this.addressDetail = data.address_detail
      this.originValue = data.origin_code
      this.picName = data.pic
      this.phoneUser = data.phone
      if (data.is_default === 0) {
        this.isDefault = false
      } else {
        this.isDefault = true
      }
    },
    confirmDelete(data) {
      this.$swal({
        title: 'Anda yakin?',
        text: 'Ingin hapus satu Alamat ?',
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
      httpKomship.delete(`/v1/address/delete/${data.address_id}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      })
        .then(() => {
          this.getAddress()
        })
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
      return httpKomship.get(`/v1/origin?search=${search}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        this.itemsOriginEdit = response.data.data
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
  },

}
</script>

<style lang="scss">
@import '~@core/scss/vue/libs/vue-select.scss';
</style>
