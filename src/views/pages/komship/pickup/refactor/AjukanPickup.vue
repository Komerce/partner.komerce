<template>
  <b-card>
    <h3 class="text-black">
      <strong>
        Pengajuan Pickup
      </strong>
    </h3>

    <b-row class="mt-3 justify-content-center">
      <b-col cols="11">
        <h4 class="text-black">
          <strong>
            Penjemputan
          </strong>
        </h4>
      </b-col>
      <b-col cols="11">
        <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
      </b-col>
    </b-row>
    <b-form @submit.prevent>
      <b-row class="justify-content-center mb-1">
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Alamat"
            label-for="h-first-name"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <b-row class="">
              <b-col md="auto">
                <h5 class="text-black">
                  <strong>
                    {{ addressName }}
                  </strong>
                </h5>
                <p>
                  {{ addressDetail }}
                </p>
              </b-col>
              <b-col cols="2">
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  class="btn-icon"
                  variant="flat-primary"
                  @click="openPopUpAddress"
                >
                  Pilih
                </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Tanggal"
            label-for="h-email"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <div class="add-pickup-input-date-label mt-50">
              {{ dateLabel }}
            </div>
            <b-form-datepicker
              id="input-pickup-date"
              ref="dp1"
              v-model="dateValue"
              class="add-pickup-date-button mt-50"
              button-only
              @context="onChangeDate"
            >
              <template v-slot:button-content>
                <img src="@/assets/images/icons/date-picker-icon.svg">
              </template>
            </b-form-datepicker>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Waktu Jemput"
            label-for="h-number"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <b-form-timepicker
              ref="dt1"
              v-model="timeValue"
              button-only
              no-close-button
              right
              hide-header
              locale="en"
              :hour12="false"
              button-variant="flat-dark"
              @context="onChangeTime"
            >
              <template v-slot:button-content>
                <b-form-input
                  id="input-pickup-time"
                  v-model="timeValueText"
                  type="text"
                />
              </template>
            </b-form-timepicker>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Kendaraan"
            label-for="h-password"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
          >
            <div
              id="input-pickup-vehicle"
              class="add-pickup-input-vehicle-btn-wrapper"
            >
              <b-button
                v-if="profile && profile.vehicle && profile.vehicle.indexOf('MOTOR') > -1"
                :class="`vehicle-button-content ${chosenVehicle === 'MOTOR' ? 'vehicle-selected white-button mr-1' : 'vehicle-button mr-1'}`"
                @click="() => onChooseVehicle('MOTOR')"
              >
                <img src="@/assets/images/icons/motor.png">
                <span>Motor</span>
              </b-button>
              <b-button
                v-if="profile && profile.vehicle && profile.vehicle.indexOf('MOBIL') > -1"
                :class="`vehicle-button-content ${chosenVehicle === 'MOBIL' ? 'vehicle-selected white-button mr-1' : 'vehicle-button mr-1'}`"
                @click="() => onChooseVehicle('MOBIL')"
              >
                <img src="@/assets/images/icons/mobil.png">
                <span>Mobil</span>
              </b-button>
              <b-button
                v-if="profile && profile.vehicle && profile.vehicle.indexOf('TRUCK') > -1"
                :class="`vehicle-button-content vehicle-button-content-truk ${chosenVehicle === 'TRUCK' ? 'vehicle-selected white-button' : 'vehicle-button'}`"
                @click="() => onChooseVehicle('TRUCK')"
              >
                <img src="@/assets/images/icons/truk.png">
                <span>Truk</span>
              </b-button>
            </div>
          </b-form-group>
        </b-col>
        <b-col
          cols="11"
          class="mb-50"
        >
          <b-form-group
            label="Orderan"
            label-for="h-password"
            label-cols-md="2"
            label-class="text-black font-weight-bold"
            class="mb-0"
          >
            <b-button
              variant="primary"
              class="mt-50"
              @click="chooseOrder"
            >
              Pilih orderan
            </b-button>
          </b-form-group>
          <b-col
            class="pl-0 pr-2"
            cols="2"
          >
            <small>
              Pilih orderan yang akan di pickup
            </small>
          </b-col>
        </b-col>
      </b-row>

      <div v-if="selectedOrderToStore === []">
        <b-row class="justify-content-center mt-1">
          <b-col
            cols="11"
            class="d-flex justify-content-between"
          >
            <div>
              <h5 class="text-black">
                <strong>
                  Produk
                </strong>
              </h5>
            </div>
            <div>
              <h5 class="text-black">
                <strong>
                  Jumlah
                </strong>
              </h5>
            </div>
          </b-col>
          <b-col cols="11">
            <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
          </b-col>
        </b-row>
      </div>

      <div v-if="selectedOrderToStore[0] !== undefined">
        <b-row class="justify-content-center">
          <b-col cols="11">
            <b-table
              hover
              responsive
              class="position-relative"

              :fields="fieldsPreviewProductOrder"
              :items="itemsPreviewProductOrder"
            >
              <template #cell(product)="data">
                <div
                  v-for="(items, index) in data.item.product"
                  :key="index+1"
                >
                  <b-row class="mb-2">
                    <b-container
                      fluid
                      class="d-flex"
                    >
                      <div>
                        <b-avatar
                          variant="light-primary"
                          square
                          size="50px"
                          :src="items.product_image"
                        />
                      </div>
                      <div class="ml-1">
                        <h5 class="text-black">
                          <strong>{{ items.product_name }}</strong>
                        </h5>
                        <div v-if="items.variant_name !== '0' && items.variant_name !== ''">
                          <span class="text-black"><strong>{{ items.variant_name }}</strong></span>
                        </div>
                        <div v-else>
                          <span class="text-black">
                            <strong>
                              Tidak ada variasi
                            </strong>
                          </span>
                        </div>
                      </div>
                    </b-container>
                  </b-row>
                </div>
              </template>

              <template #cell(total)="data">
                <div
                  v-for="(items, index) in data.item.product"
                  :key="index+1"
                >
                  <h5 class="mb-3 text-black">
                    <strong>{{ items.qty }}</strong>
                  </h5>
                </div>
              </template>

            </b-table>
          </b-col>
        </b-row>
      </div>

      <div v-if="selectedOrderToStore[0] !== undefined">
        <b-row class="justify-content-center mb-1">
          <b-col
            cols="11"
            class="d-flex justify-content-between"
          >
            <div>
              <b-button
                class="btn-icon"
                variant="flat-info"
                tag="router-link"
                :to="{ name: $route.meta.routeDetailBefore, params: { selected_order: selectedOrderToStore } }"
              >
                Lihat detail...
              </b-button>
            </div>
            <div>
              <span class="text-black">
                <strong>
                  Total produk: {{ getTotalProductOrder(itemsPreviewProductOrder) }}
                </strong>
              </span>
            </div>
          </b-col>
          <b-col cols="11">
            <hr style="height:1px;border-width:0;color:#C2C2C2;background-color:#C2C2C2">
          </b-col>
        </b-row>
      </div>

      <b-row class="mb-1 ml-3 pl-50">
        <p class="text-primary p-50 border-2 border-red-400 rounded-lg bg-red-50">
          *Pastikan produk yang kamu masukan sudah tepat sebelum di ajukan
        </p>
      </b-row>

      <b-row class="justify-content-center">
        <b-col
          cols="11"
          class="d-flex justify-content-end"
        >
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="outline-primary"
            class="mr-1"
          >
            Batal
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            variant="primary"
            :disabled="chosenVehicle === '' || selectedOrderToStore[0] === undefined"
            @click="submitPickup"
          >
            Ajukan Pickup
          </b-button>
        </b-col>
      </b-row>
    </b-form>

    <!-- Pop Address -->
    <b-modal
      ref="popup-address"
      hide-footer
      modal-class="modal-primary"
      centered
    >

      <div
        v-for="(items, index) in itemsAddress"
        :key="index+1"
      >
        <b-form-radio
          v-model="valueAddressIsActive"
          name="some-radios"
          :value="items.address_id"
          @change="handleSelectedAddress(items)"
        >
          <div class="d-flex">
            <h5 class="mr-1">
              <strong>
                {{ items.address_name }}
              </strong>
            </h5>
            <span
              v-if="items.is_default === 1"
              class="text-primary"
            >
              [ Alamat Utama ]
            </span>
          </div>
          <p>
            {{ items.address_detail }}
          </p>
        </b-form-radio>
      </div>
    </b-modal>

    <!-- Popup order -->
    <b-modal
      id="popupOrder"
      ref="popup-order"
      hide-footer
      modal-class="modal-primary"
      centered
      size="xl"
    >
      <data-order
        :pass-address-id="addressId"
        @passDataToParent="getDataOrderToStore"
      />
    </b-modal>

    <!-- Modal Success Pickup -->
    <b-modal
      ref="modal-success-request-pickup"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/assets/images/icons/success.svg">
        </div>
        <div class="text-wrapper mb-3">
          Pengajuan Pickup Berhasil
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeDetailAfter, params: { selected_order: selectedOrderToStore } }"
        >
          Oke
        </b-button>
      </div>
    </b-modal>

    <!-- Modal Failed Pickup -->
    <b-modal
      ref="modal-failed-request-pickup"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/assets/images/icons/fail.svg">
        </div>
        <div class="text-wrapper mb-3 px-2">
          Mohon maaf , ekpedisi sedang terkendala.
          Silahkan refresh halaman
        </div>
        <b-button
          class="org-button"
          @click="closePopupFailedPickup"
        >
          Oke
        </b-button>
      </div>
    </b-modal>

    <!-- Modal validate expedition -->
    <b-modal
      ref="modal-validate-expedition"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success">
        <div class="image-wrapper">
          <img src="@/@core/assets/image/icon-popup-warning.png">
        </div>
        <div class="text-wrapper mb-3 px-1">
          Aktifkan minimal 1 ekspedisi untuk melanjutkan proses Pick Up
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeToActiveExpedition }"
        >
          Aktifkan Ekspedisi
        </b-button>
      </div>
    </b-modal>

  </b-card>
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
  BFormDatepicker,
  BInputGroup,
  BInputGroupAppend,
  BFormTimepicker,
  BIconChevronExpand,
  BModal,
  BFormRadio,
  BTable,
  BAvatar,
  BContainer,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import httpKomship from '../../setting-kompship/http_komship'
import dataOrder from './DataOrder.vue'

export default {

  components: {
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BFormDatepicker,
    // BInputGroup,
    // BInputGroupAppend,
    BFormTimepicker,
    // BIconChevronExpand,
    BModal,
    BFormRadio,
    dataOrder,
    BTable,
    BAvatar,
    BContainer,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      addressName: '',
      addressDetail: '',
      dateValue: new Date(),
      dateLabel: '',

      timeValueText: '09 : 00',
      timeValue: '09:00',

      profile: null,
      chosenVehicle: '',

      itemsAddress: [],
      selectedOrderToStore: [],
      selectedAddress: '',

      fieldsPreviewProductOrder: [
        {
          key: 'product',
          label: 'Produk',
          thClass: 'bg-white border-top-0 text-black pl-0 ml-0',
          tdClass: 'text-black pl-0 ml-0',
        },
        {
          key: 'total',
          label: 'Jumlah',
          tdClass: 'text-center text-black',
          thClass: 'text-center bg-white border-top-0 text-black',
          class: 'col-action',
        },
      ],
      itemsPreviewProductOrder: [],
      selectedOrdersId: [],

      namePic: '',
      picPhone: '',
      addressId: '',

      valueAddressIsActive: 0,

      selectedOrderFromDetail: this.$route.params.selected_order_from_detail,
    }
  },
  mounted() {
    this.cekExpedition()
    this.$http_komship.post('v1/my-profile', {
      headers: { Authorization: `Bearer ${useJwt.getToken()}` },
    }).then(response => {
      this.userData = response.data.data
      this.profile = response.data.data
    }).catch(() => {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Gagal',
          icon: 'AlertCircleIcon',
          text: 'Gagal meload data, silahkan refresh halaman!',
          variant: 'danger',
        },
      })
    })
    if (this.selectedOrderFromDetail) {
      this.selectedOrderToStore = this.selectedOrderFromDetail
      this.itemsPreviewProductOrder = this.selectedOrderFromDetail
    }
    this.getAddress()
    // this.$refs['popup-order'].show()
  },
  methods: {
    getDataOrderToStore(data, dataItems) {
      this.selectedOrderToStore = data
      this.itemsPreviewProductOrder = data
      this.$refs['popup-order'].hide()
    },
    changeDate(dateString, type) {
      if (dateString && dateString !== '') {
        let today = new Date(dateString)
        const dd = today.getDate()
        const monthArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const mm = today.getMonth()
        const yyyy = today.getFullYear()
        today = `${dd} ${monthArr[mm]} ${yyyy}`
        if (type && type === 2) {
          today = `${yyyy}-${mm + 1}-${dd}`
        }
        return today
      }
      return dateString
    },
    onChangeDate(ctx) {
      if (ctx && ctx.activeYMD) {
        this.dateLabel = this.changeDate(ctx.activeYMD)
      }
    },
    onChangeTime(ctx) {
      if (ctx && ctx.formatted) this.timeValueText = this.getTimeFormatted(ctx.formatted)
    },
    getTimeFormatted(timeText) {
      if (timeText) {
        const splitTime = timeText.split(':')
        return `${splitTime[0]} : ${splitTime[1]}`
      }
      return timeText
    },
    getAddress() {
      this.$http_komship.get('/v1/address', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.itemsAddress = data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.itemsAddress.length; x++) {
          if (this.itemsAddress[x].is_default === 1) {
            this.addressName = this.itemsAddress[x].address_name
            this.addressDetail = this.itemsAddress[x].address_detail
            this.selectedAddress = this.itemsAddress[x].is_default
            this.namePic = this.itemsAddress[x].pic
            this.addressId = this.itemsAddress[x].address_id
            this.picPhone = this.itemsAddress[x].phone
            this.valueAddressIsActive = this.itemsAddress[x].address_id
          }
        }
      })
    },
    openPopUpAddress() {
      this.$refs['popup-address'].show()
    },
    getDefaultAddress(data) {
      return data.is_default === 1
    },
    handleSelectedAddress(data) {
      this.addressName = data.address_name
      this.addressDetail = data.address_detail
      this.namePic = data.pic
      this.addressId = data.address_id
      this.picPhone = data.phone
      this.valueAddressIsActive = data.address_id
    },
    onChooseVehicle(vehicle) {
      if (vehicle) this.chosenVehicle = vehicle
    },
    chooseOrder() {
      this.$bvModal.show('popupOrder')
    },
    getListOrderByPartner() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/order/${partnerId}`, {
        params: {
          is_komship: this.profile.is_komship,
          order_status: 0,
        },
      }).then(response => {
        const { data } = response.data.data
        this.listOrder = data
      }).catch(() => {
        // handle error
      })
    },
    submitPickup() {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.selectedOrderToStore.length; x++) {
        this.selectedOrdersId.push(this.selectedOrderToStore[x].order_id)
      }
      const params = {
        partner_name: this.profile.user_fullname,
        pickup_date: this.changeDate(this.dateValue, 2),
        pickup_time: this.timeValue,
        pic: this.namePic,
        pic_phone: this.picPhone,
        vehicle: this.chosenVehicle,
        address_id: this.addressId,
        address_detail: this.addressDetail,
        orders: this.selectedOrdersId,
      }

      httpKomship.post(`/v1/pickup/${this.profile.partner_id}/store`, params)
        .then(response => {
          if (response.data.code !== 500) {
            this.$refs['modal-success-request-pickup'].show()
          } else {
            this.$refs['modal-failed-request-pickup'].show()
          }
        }).catch(() => {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Gagal',
              icon: 'AlertCircleIcon',
              text: 'Gagal mengajukan pickup, silahkan coba lagi!',
              variant: 'danger',
            },
          })
        })
    },
    handleSubmitPopUpSuccess() {
      this.$refs['modal-success-request-pickup'].hide()
    },
    detailOrder(data) {
      // handle error
    },
    getTotalProductOrder(data) {
      let value = null
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < data.length; x++) {
        if (data[x].product !== undefined) {
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < data[x].product.length; y++) {
            value += data[x].product[y].qty
          }
        }
      }
      return value
    },
    closePopupFailedPickup() {
      this.$refs['modal-failed-request-pickup'].hide()
    },
    cekExpedition() {
      httpKomship.get('/v1/partner/shipment/not-active',
        {
          headers: { Authorization: `Bearer ${useJwt.getToken()}` },
        }).then(response => {
        const { data } = response.data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < data.length; x++) {
          if (!data[x].is_active === true) {
            this.$refs['modal-validate-expedition'].show()
          }
        }
      })
    },
  },
}
</script>

<style>

</style>
<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import '../add-pickup.scss';
</style>
