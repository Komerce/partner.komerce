<template>
  <b-card
    no-body
  >
    <b-row class="d-flex align-items-center mb-1 mt-2 px-2">
      <b-col>
        <h4 class="text-black">
          <strong>Akses Akun</strong>
        </h4>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <p class="text-black ml-2">
          Tambahkan orang untuk membantu mengelola usaha dan beri akses sesuai keinginan kamu
        </p>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-overlay
          variant="light"
          :show="loading"
          spinner-variant="primary"
          blur="0"
          opacity=".5"
          rounded="sm"
        >
          <b-table
            ref="table"
            hover
            responsive
            class="position-relative"
            empty-text="Tidak ada data untuk ditampilkan."
            :show-empty="!loading"
            :fields="fields"
            :items="tableProvider"
            :busy.sync="loading"
          >
            <template #cell(full_name)="data">
              <h5 class="text-black">
                <strong>{{ data.item.full_name }}</strong>
              </h5>
              <p>
                {{ data.item.email }}
              </p>
            </template>

            <template #cell(access_menu)="data">
              <b-row>
                <div
                  v-for="(item, index) in data.item.access_menu"
                  :key="index+1"
                  class="mr-50"
                >
                  {{ item.menu_name }},
                </div>
              </b-row>
            </template>

            <template #cell(action)="data">
              <!-- submit and reset -->
              <b-col
                md="12"
                class="d-flex justify-content-end mt-2"
              >
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  v-b-modal.modal-primary
                  type="submit"
                  variant="primary"
                  class="mr-1"
                  @click="editAccess(data)"
                >
                  Edit
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="outline-primary"
                  class="mr-1"
                  @click="confirmDelete(data)"
                >
                  Hapus
                </b-button>
              </b-col>
            </template>
          </b-table>
        </b-overlay>
      </b-col>
    </b-row>

    <b-row class="mt-2 pb-2">
      <b-button
        variant="outline-primary"
        class="ml-3"
        @click="showModalAddAccount"
      >
        Tambah Orang
      </b-button>
    </b-row>

    <b-modal
      ref="modal-add-account"
      scrollable
      :title="editMode ? 'Edit Akses' : 'Tambah Orang'"
      ok-only
      ok-title="Simpan"
      cancel-variant="outline-primary"
    >
      <validation-observer ref="formRules">
        <b-form>
          <b-row>
            <b-col
              v-if="!editMode"
              cols="10"
            >
              <b-form-group
                label="Nama"
              >
                <validation-provider
                  #default="{errors}"
                  name="Nama"
                  rules="required"
                >
                  <b-form-input
                    v-model="fullname"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              v-if="!editMode"
              cols="10"
            >
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
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              v-if="!editMode"
              cols="10"
            >
              <b-form-group
                label="Password"
              >
                <validation-provider
                  #default="{errors}"
                  name="Password"
                  rules="required"
                >
                  <b-form-input
                    v-model="password"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-primary">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col
              v-if="!editMode"
              cols="12"
            >
              <hr>
            </b-col>

            <b-col cols="12">
              <b-form-group>
                <b-form-checkbox
                  v-model="allAccessApps"
                  @change="cekAllApps"
                >
                  <h5>
                    <strong>Akses Aplikasi</strong>
                  </h5>
                </b-form-checkbox>

                <b-col
                  cols="12"
                  class="mt-1"
                >
                  <b-form-group>
                    <b-form-checkbox
                      v-model="addOrderApps"
                      @change="cekAkses"
                    >
                      Tambah Order
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="dataOrderApps"
                      @change="cekAkses"
                    >
                      Data Order
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <hr>
            </b-col>

            <b-col cols="12">
              <b-form-group>
                <b-form-checkbox
                  v-model="allAccessWeb"
                  @change="cekAllWeb"
                >
                  <h5>
                    <strong>Akses Website</strong>
                  </h5>
                </b-form-checkbox>

                <p class="mt-50 ml-1">
                  <strong>Produk</strong>
                </p>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="addProdukWeb"
                      @change="cekAkses"
                    >
                      Tambah Produk
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="dataProdukWeb"
                      @change="cekAkses"
                    >
                      Data Produk
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <p class="mt-50 ml-1">
                  <strong>Orderan</strong>
                </p>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="addOrderWeb"
                      @change="cekAkses"
                    >
                      Tambah Order
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="dataOrderWeb"
                      @change="cekAkses"
                    >
                      Data Order
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <p class="mt-50 ml-1">
                  <strong>Pickup</strong>
                </p>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="ajukanPickup"
                      @change="cekAkses"
                    >
                      Ajukan Pickup
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="historyPickup"
                      @change="cekAkses"
                    >
                      Riwayat Pickup
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <p class="mt-50 ml-1">
                  <strong>Keuangan</strong>
                </p>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="penghasilan"
                      @change="cekAkses"
                    >
                      Penghasilan
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="saldo"
                      @change="cekAkses"
                    >
                      Saldo
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <p class="mt-50 ml-1">
                  <strong>Pengaturan</strong>
                </p>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="settingProfile"
                      @change="cekAkses"
                    >
                      Edit Profile
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="accessAccount"
                      @change="cekAkses"
                    >
                      Akses Akun
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="addressPickup"
                      @change="cekAkses"
                    >
                      Alamat Pickup
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="settingRekening"
                      @change="cekAkses"
                    >
                      Rekening Bank
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="settingPin"
                      @change="cekAkses"
                    >
                      PIN
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>

                <b-col cols="12">
                  <b-form-group>
                    <b-form-checkbox
                      v-model="settingEkspedisi"
                      @change="cekAkses"
                    >
                      Ekspedisi
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-form-group>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row class="align-items-center w-100">
          <b-col
            cols="12"
            class="d-flex justify-content-end"
          >
            <b-button
              v-if="!editMode"
              variant="primary"
              :disabled="checkButtonIsActive()"
              @click="addAccount"
            >
              <b-spinner
                v-if="loadingSubmit"
                variant="light"
                small
              />
              Simpan
            </b-button>
            <b-button
              v-else
              variant="primary"
              :disabled="checkButtonIsActive()"
              @click="submitEditAccess"
            >
              <b-spinner
                v-if="loadingSubmit"
                variant="light"
                small
              />
              Update
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </b-card>
</template>

<script>
import {
  BCol,
  BRow,
  BCard,
  BTable,
  BButton,
  BModal,
  VBModal,
  BForm,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BOverlay,
  BSpinner,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { required, email } from '@validations'

export default {
  components: {
    BCol,
    BRow,
    BCard,
    BTable,
    BButton,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BOverlay,
    BSpinner,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,

      allAccessApps: false,
      allAccessWeb: false,

      addOrderApps: false,
      dataOrderApps: false,

      addProdukWeb: false,
      dataProdukWeb: false,
      addOrderWeb: false,
      dataOrderWeb: false,
      ajukanPickup: false,
      historyPickup: false,
      penghasilan: false,
      saldo: false,
      settingProfile: false,
      accessAccount: false,
      addressPickup: false,
      settingRekening: false,
      settingPin: false,
      settingEkspedisi: false,

      // Store
      accessView: 1,
      accessCreate: 2,
      accessEdit: 3,
      accessDelete: 4,
      accessSubmitPickup: 5,
      accessPickupHistory: 6,
      accessIncomeData: 7,
      accessBalanceData: 8,
      accessEditProfile: 9,
      accessHakAccount: 10,
      accessPickupAddress: 11,
      accessBankAccount: 12,
      accessPin: 13,
      accessEkspedisi: 14,
      menuPosition: [],

      fields: [
        {
          key: 'full_name',
          label: 'Nama',
          thClass: 'bg-white border-top-0 font-bold',
          class: 'text-black',
        },
        {
          key: 'access_menu',
          label: 'Akses',
          thClass: 'bg-white border-top-0 font-bold',
          class: 'text-black',
        },
        {
          key: 'action',
          label: '',
          thClass: 'bg-white border-top-0 font-bold',
          class: 'text-black',
        },
      ],

      items: [],

      name: '',
      username: '',
      password: '',
      fullname: '',
      emailUser: '',
      noPartner: '',
      menu: [],

      partnerId: JSON.parse(localStorage.getItem('userData')),

      editMode: false,
      menuAksesEdit: [],
      idEdit: '',

      // Validation
      required,
      email,
    }
  },
  mounted() {
    this.getMenuKomship()
  },
  methods: {
    refreshTable() {
      this.$refs.table.refresh()
    },
    tableProvider() {
      return this.$http.get(`/user/partner/get-komship-member/${this.partnerId.partner_detail.id}`).then(response => {
        const { data } = response.data
        return data
      }).catch(() => {
        this.loadingSubmit = false
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal me-load data, silahkan coba lagi',
            variant: 'danger',
          },
        }, 2000)
      })
    },
    addAccount() {
      this.$refs.formRules.validate().then(success => {
        if (success) {
          // Apps
          if (this.allAccessApps === true || this.addOrderApps === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'Access Application') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
            }
          }
          if (this.dataOrderApps === true && this.allAccessApps === false && this.addOrderApps === false) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'Access Application') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
              }
            }
          }

          // Web
          if (this.allAccessWeb === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PRODUCT') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
              if (this.menuPosition[i].name === 'ORDER') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
              if (this.menuPosition[i].name === 'PICKUP') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessSubmitPickup,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupHistory,
                })
              }
              if (this.menuPosition[i].name === 'FINANCE') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessIncomeData,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBalanceData,
                })
              }
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEditProfile,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessHakAccount,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupAddress,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBankAccount,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPin,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEkspedisi,
                })
              }
            }
          }

          if (this.addProdukWeb === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PRODUCT') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
            }
          }

          if (this.dataProdukWeb === true && this.addProdukWeb === false) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PRODUCT') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
              }
            }
          }

          if (this.addOrderWeb === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'ORDER') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
            }
          }

          if (this.dataOrderWeb === true && this.addOrderWeb === false) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'ORDER') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
              }
            }
          }

          if (this.ajukanPickup === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PICKUP') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessSubmitPickup,
                })
              }
            }
          }

          if (this.historyPickup === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PICKUP') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupHistory,
                })
              }
            }
          }

          if (this.penghasilan === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'FINANCE') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessIncomeData,
                })
              }
            }
          }

          if (this.saldo === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'FINANCE') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBalanceData,
                })
              }
            }
          }

          if (this.settingProfile === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEditProfile,
                })
              }
            }
          }

          if (this.accessAccount === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessHakAccount,
                })
              }
            }
          }

          if (this.addressPickup === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupAddress,
                })
              }
            }
          }

          if (this.settingRekening === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBankAccount,
                })
              }
            }
          }

          if (this.settingPin === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPin,
                })
              }
            }
          }

          if (this.settingEkspedisi === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEkspedisi,
                })
              }
            }
          }

          this.loadingSubmit = true
          this.$http.post('/user/partner/create-account', {
            password: this.password,
            full_name: this.fullname,
            email: this.emailUser,
            menu: this.menu,
            partner_id: this.partnerId.partner_detail.id,
          }).then(response => {
            const { data } = response
            if (data.code === 400) {
              this.loadingSubmit = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  icon: 'AlertCircleIcon',
                  text: 'Username or Email has already taken!',
                  variant: 'danger',
                },
              }, 2000)
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Success menambahkan akun',
                  variant: 'success',
                },
              }, 2000)
              this.loadingSubmit = false
              this.$refs['modal-add-account'].hide()
              this.refreshTable()
            }
          }).catch(() => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal menambahkan akses orang, silahkan coba lagi',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    editAccess(data) {
      this.allAccessApps = false
      this.allAccessWeb = false
      this.addOrderApps = false
      this.dataOrderApps = false
      this.addProdukWeb = false
      this.dataProdukWeb = false
      this.addOrderWeb = false
      this.dataOrderWeb = false
      this.ajukanPickup = false
      this.historyPickup = false
      this.penghasilan = false
      this.saldo = false
      this.settingProfile = false
      this.accessAccount = false
      this.addressPickup = false
      this.settingRekening = false
      this.settingPin = false
      this.settingEkspedisi = false
      this.fullname = ''
      this.emailUser = ''
      this.password = ''
      this.menuAksesEdit = []
      this.$refs['modal-add-account'].show()
      this.editMode = true
      this.idEdit = data.item.user_id
      const params = {
        user_id: data.item.user_id,
      }
      this.$http.get('user/partner/get-menu-komship-member', {
        params,
      }).then(response => {
        response.data.data.forEach(this.arrayMenuKomship)
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.menuAksesEdit.length; x++) {
          if (this.menuAksesEdit[x].menu_name === 'Access Application') {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.menuAksesEdit[x].access.length; y++) {
              if (this.menuAksesEdit[x].access[y].access_id === this.accessView) {
                this.dataOrderApps = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessCreate || this.menuAksesEdit[x].access[y].access_id === this.accessEdit || this.menuAksesEdit[x].access[y].access_id === this.accessDelete) {
                this.addOrderApps = true
              }
            }
          }
          if (this.menuAksesEdit[x].menu_name === 'PRODUCT') {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.menuAksesEdit[x].access.length; y++) {
              if (this.menuAksesEdit[x].access[y].access_id === this.accessView) {
                this.dataProdukWeb = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessCreate || this.menuAksesEdit[x].access[y].access_id === this.accessEdit || this.menuAksesEdit[x].access[y].access_id === this.accessDelete) {
                this.addProdukWeb = true
              }
            }
          }
          if (this.menuAksesEdit[x].menu_name === 'ORDER') {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.menuAksesEdit[x].access.length; y++) {
              if (this.menuAksesEdit[x].access[y].access_id === this.accessView) {
                this.dataOrderWeb = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessCreate || this.menuAksesEdit[x].access[y].access_id === this.accessEdit || this.menuAksesEdit[x].access[y].access_id === this.accessDelete) {
                this.addOrderWeb = true
              }
            }
          }
          if (this.menuAksesEdit[x].menu_name === 'PICKUP') {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.menuAksesEdit[x].access.length; y++) {
              if (this.menuAksesEdit[x].access[y].access_id === this.accessSubmitPickup) {
                this.ajukanPickup = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessPickupHistory) {
                this.historyPickup = true
              }
            }
          }
          if (this.menuAksesEdit[x].menu_name === 'FINANCE') {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.menuAksesEdit[x].access.length; y++) {
              if (this.menuAksesEdit[x].access[y].access_id === this.accessIncomeData) {
                this.penghasilan = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessBalanceData) {
                this.saldo = true
              }
            }
          }
          if (this.menuAksesEdit[x].menu_name === 'SETTING') {
            // eslint-disable-next-line no-plusplus
            for (let y = 0; y < this.menuAksesEdit[x].access.length; y++) {
              if (this.menuAksesEdit[x].access[y].access_id === this.accessEditProfile) {
                this.settingProfile = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessHakAccount) {
                this.accessAccount = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessPickupAddress) {
                this.addressPickup = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessBankAccount) {
                this.settingRekening = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessPin) {
                this.settingPin = true
              }
              if (this.menuAksesEdit[x].access[y].access_id === this.accessEkspedisi) {
                this.settingEkspedisi = true
              }
            }
          }
          if (this.addProdukWeb === true
              && this.dataProdukWeb === true
              && this.addOrderWeb === true
              && this.dataOrderWeb === true
              && this.ajukanPickup === true
              && this.historyPickup === true
              && this.penghasilan === true
              && this.saldo === true
              && this.settingProfile === true
              && this.accessAccount === true
              && this.addressPickup === true
              && this.settingRekening === true
              && this.settingPin === true
              && this.settingEkspedisi === true) {
            this.allAccessWeb = true
          }
          if (this.addOrderApps === true && this.dataOrderApps === true) {
            this.allAccessApps = true
          }
        }
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal edit alamat, silahkan coba lagi',
            variant: 'danger',
          },
        })
      })
    },
    arrayMenuKomship(data) {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.menuPosition.length; i++) {
        if (data.menu_name === this.menuPosition[i].name && data.access !== 'No Data Access.') {
          this.menuAksesEdit.push(data)
        }
      }
    },
    submitEditAccess() {
      this.menu = []
      this.$refs.formRules.validate().then(success => {
        if (success) {
          // Apps
          if (this.allAccessApps === true || this.addOrderApps === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'Access Application') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
            }
          } else if (this.dataOrderApps === true && this.allAccessApps === false && this.addOrderApps === false) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'Access Application') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
              }
            }
          }

          // Web
          if (this.allAccessWeb === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PRODUCT') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
              if (this.menuPosition[i].name === 'ORDER') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
              if (this.menuPosition[i].name === 'PICKUP') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessSubmitPickup,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupHistory,
                })
              }
              if (this.menuPosition[i].name === 'FINANCE') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessIncomeData,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBalanceData,
                })
              }
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEditProfile,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessHakAccount,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupAddress,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBankAccount,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPin,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEkspedisi,
                })
              }
            }
          }

          if (this.addProdukWeb === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PRODUCT') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
            }
          }

          if (this.dataProdukWeb === true && this.addProdukWeb === false) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PRODUCT') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
              }
            }
          }

          if (this.addOrderWeb === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'ORDER') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessCreate,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEdit,
                })
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessDelete,
                })
              }
            }
          }

          if (this.dataOrderWeb === true && this.addOrderWeb === false) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'ORDER') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessView,
                })
              }
            }
          }

          if (this.ajukanPickup === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PICKUP') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessSubmitPickup,
                })
              }
            }
          }

          if (this.historyPickup === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'PICKUP') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupHistory,
                })
              }
            }
          }

          if (this.penghasilan === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'FINANCE') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessIncomeData,
                })
              }
            }
          }

          if (this.saldo === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'FINANCE') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBalanceData,
                })
              }
            }
          }

          if (this.settingProfile === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEditProfile,
                })
              }
            }
          }

          if (this.accessAccount === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessHakAccount,
                })
              }
            }
          }

          if (this.addressPickup === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPickupAddress,
                })
              }
            }
          }

          if (this.settingRekening === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessBankAccount,
                })
              }
            }
          }

          if (this.settingPin === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessPin,
                })
              }
            }
          }

          if (this.settingEkspedisi === true) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < this.menuPosition.length; i++) {
              if (this.menuPosition[i].name === 'SETTING') {
                this.menu.push({
                  menu_position_id: this.menuPosition[i].menu_position[0].id,
                  menu_access_id: this.accessEkspedisi,
                })
              }
            }
          }

          this.loadingSubmit = true
          this.$http.put('/user/partner/update-account', {
            user_id: this.idEdit,
            menu: this.menu,
          }).then(response => {
            const { data } = response
            if (data.code === 400) {
              this.loadingSubmit = false
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Failed',
                  icon: 'AlertCircleIcon',
                  text: 'Username or Email has already taken!',
                  variant: 'danger',
                },
              }, 2000)
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Akun berhasil di update',
                  variant: 'success',
                },
              })
              this.loadingSubmit = false
              this.$refs['modal-add-account'].hide()
              this.refreshTable()
            }
          }).catch(() => {
            this.loadingSubmit = false
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Gagal',
                icon: 'AlertCircleIcon',
                text: 'Gagal update akses orang, silahkan coba lagi',
                variant: 'danger',
              },
            }, 2000)
          })
        } else {
          this.loadingSubmit = false
        }
      })
    },
    confirmDelete(data) {
      this.$swal({
        text: 'Kamu yakin ingin hapus akun ?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Batal',
        confirmButtonText: 'Hapus',
        customClass: {
          confirmButton: 'btn btn-outline-primary',
          cancelButton: 'btn btn-primary ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.delete(data)
        }
      })
    },
    delete(data) {
      this.$http.delete(`/user/partner/delete-komship-member/${data.item.user_id}`)
        .then(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              icon: 'CheckIcon',
              text: 'Success delete access',
              variant: 'success',
            },
          }, 2000)
          this.refreshTable()
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal hapus akses, silahkan coba lagi!',
              variant: 'danger',
            },
          }, 2000)
          this.refreshTable()
        })
    },
    cekAllApps() {
      if (this.allAccessApps === true) {
        this.addOrderApps = true
        this.dataOrderApps = true
      } else {
        this.addOrderApps = false
        this.dataOrderApps = false
      }
    },
    cekAllWeb() {
      if (this.allAccessWeb === true) {
        this.addProdukWeb = true
        this.dataProdukWeb = true
        this.addOrderWeb = true
        this.dataOrderWeb = true
        this.ajukanPickup = true
        this.historyPickup = true
        this.penghasilan = true
        this.saldo = true
        this.settingProfile = true
        this.accessAccount = true
        this.addressPickup = true
        this.settingRekening = true
        this.settingPin = true
        this.settingEkspedisi = true
      } else {
        this.addProdukWeb = false
        this.dataProdukWeb = false
        this.addOrderWeb = false
        this.dataOrderWeb = false
        this.ajukanPickup = false
        this.historyPickup = false
        this.penghasilan = false
        this.saldo = false
        this.settingProfile = false
        this.accessAccount = false
        this.addressPickup = false
        this.settingRekening = false
        this.settingPin = false
        this.settingEkspedisi = false
      }
    },
    cekAkses() {
      // Apps
      if (this.allAccessApps === true) {
        if (this.addOrderApps === false || this.dataOrderApps === false) {
          this.allAccessApps = false
        }
      }
      if (this.addOrderApps === true && this.dataOrderApps === true) {
        this.allAccessApps = true
      }

      // Web
      if (this.allAccessWeb === true) {
        if (this.addProdukWeb === false || this.dataProdukWeb === false
        || this.addOrderWeb === false
        || this.dataOrderWeb === false
        || this.ajukanPickup === false
        || this.historyPickup === false
        || this.penghasilan === false
        || this.saldo === false
        || this.settingProfile === false
        || this.accessAccount === false
        || this.addressPickup === false
        || this.settingRekening === false
        || this.settingPin === false
        || this.settingEkspedisi === false) {
          this.allAccessWeb = false
        }
      }
      if (this.addProdukWeb === true
        && this.dataProdukWeb === true
        && this.addOrderWeb === true
        && this.dataOrderWeb === true
        && this.ajukanPickup === true
        && this.historyPickup === true
        && this.penghasilan === true
        && this.saldo === true
        && this.settingProfile === true
        && this.accessAccount === true
        && this.addressPickup === true
        && this.settingRekening === true
        && this.settingPin === true
        && this.settingEkspedisi === true) {
        this.allAccessWeb = true
      }
    },
    showModalAddAccount() {
      this.editMode = false
      this.allAccessApps = false
      this.allAccessWeb = false
      this.addOrderApps = false
      this.dataOrderApps = false
      this.addProdukWeb = false
      this.dataProdukWeb = false
      this.addOrderWeb = false
      this.dataOrderWeb = false
      this.ajukanPickup = false
      this.historyPickup = false
      this.penghasilan = false
      this.saldo = false
      this.settingProfile = false
      this.accessAccount = false
      this.addressPickup = false
      this.settingRekening = false
      this.settingPin = false
      this.settingEkspedisi = false
      this.fullname = ''
      this.emailUser = ''
      this.password = ''
      this.$refs['modal-add-account'].show()
    },
    getMenuKomship() {
      this.$http.get('user/partner/get-menu-member').then(response => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < response.data.data.length; i++) {
          this.menuPosition.push({
            name: response.data.data[i].name,
            menu_position: response.data.data[i].menu_position,
          })
        }
      }).catch(() => {
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
    checkButtonIsActive() {
      let result = true
      if (this.addProdukWeb === true
              || this.dataProdukWeb === true
              || this.addOrderWeb === true
              || this.dataOrderWeb === true
              || this.ajukanPickup === true
              || this.historyPickup === true
              || this.penghasilan === true
              || this.saldo === true
              || this.settingProfile === true
              || this.accessAccount === true
              || this.addressPickup === true
              || this.settingRekening === true
              || this.settingPin === true
              || this.settingEkspedisi === true) {
        result = false
      }
      if (this.addOrderApps === true || this.dataOrderApps === true) {
        result = false
      }
      return result
    },
  },

}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  font-family: Poppins;
}
</style>
