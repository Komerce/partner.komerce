<template>
  <div class="add-pickup-input-main-wrapper">
    <b-card-title class="mb-4">
      Pengajuan Pickup
    </b-card-title>
    <div class="add-pickup-input-title mb-4">
      Penjemputan
    </div>
    <section class="add-pickup-input-form-wrapper">
      <b-form-group
        class="add-pickup-input-label mb-2"
        label="Alamat"
        label-cols-md="3"
        label-for="input-pickup-address"
      >
        <div
          id="input-pickup-address"
          class="add-pickup-input-address-wrapper"
        >
          <div
            v-if="!isEditAddress"
            class="add-pickup-input-address-name-wrapper"
          >
            <div class="add-pickup-input-address-name">
              {{ addressText }}
            </div>
            <div class="add-pickup-input-address-desc">
              {{ addressDetailText }}
            </div>
          </div>
          <div
            v-else
            class="add-pickup-input-address-name-wrapper"
          >
            <b-form-input
              v-model="addressText"
              type="text"
              class="add-pickup-input-address-input"
            />
            <b-form-input
              v-model="addressDetailText"
              type="text"
              class="add-pickup-input-address-input add-pickup-input-address-input-details"
            />
          </div>
          <div
            class="add-pickup-input-address-icon"
            @click="onEditAddress"
          >
            <b-icon-pencil-square aria-hidden="true" />
          </div>
        </div>
      </b-form-group>
      <b-form-group
        class="add-pickup-input-label mb-2"
        label="Tanggal"
        label-cols-md="3"
        label-for="input-pickup-date"
      >
        <div class="add-pickup-input-date-label">
          {{ dateLabel }}
        </div>
        <b-form-datepicker
          id="input-pickup-date"
          ref="dp1"
          v-model="dateValue"
          class="add-pickup-date-button"
          button-only
          @context="onChangeDate"
        >
          <template v-slot:button-content>
            <img src="@/assets/images/icons/date-picker-icon.svg">
          </template>
        </b-form-datepicker>
      </b-form-group>
      <b-form-group
        class="add-pickup-input-label add-pickup-time-picker mb-2"
        label="Waktu Jemput"
        label-cols-md="3"
        label-for="input-pickup-time"
      >
        <b-input-group>
          <b-form-input
            id="input-pickup-time"
            v-model="timeValueText"
            type="text"
            placeholder="09 : 00"
          />
          <b-input-group-append>
            <b-form-timepicker
              ref="dt1"
              v-model="timeValue"
              button-only
              right
              aria-controls="example-input"
              locale="en"
              :hour12="false"
              @context="onChangeTime"
            >
              <template v-slot:button-content>
                <b-icon-chevron-expand aria-hidden="true" />
              </template>
            </b-form-timepicker>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-form-group
        class="add-pickup-input-label mb-2"
        label="Kendaraan"
        label-cols-md="3"
        label-for="input-pickup-vehicle"
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
            v-if="profile && profile.vehicle && profile.vehicle.indexOf('TRUK') > -1"
            :class="`vehicle-button-content vehicle-button-content-truk ${chosenVehicle === 'TRUK' ? 'vehicle-selected white-button' : 'vehicle-button'}`"
            @click="() => onChooseVehicle('TRUK')"
          >
            <img src="@/assets/images/icons/truk.png">
            <span>Truk</span>
          </b-button>
        </div>
      </b-form-group>

      <add-pickup-table
        :fields="fields"
        :items="selectedOrder"
        @onChooseOrder="onChooseOrder"
      />

      <div class="add-pickup-input-notice-notif">
        <b-badge variant="light-danger">
          *Pastikan produk yang kamu masukan sudah tepat sebelum di ajukan
        </b-badge>
      </div>
    </section>

    <section class="add-pickup-input-submit-wrapper">
      <b-button
        class="white-button mr-1"
        @click="onResetForm"
      >
        Batal
      </b-button>
      <b-button
        :class="`org-button ${selectedOrder.length === 0 ? 'add-pickup-submit-button-disabled' : ''}`"
        :disabled="selectedOrder.length === 0 || isSubmitting"
        @click="onSubmitForm"
      >
        {{ isSubmitting ? 'Please wait..' : 'Ajukan Pickup' }}
      </b-button>
    </section>

    <add-pickup-popup
      ref="addPickupPopUP"
      :selected-orders="selectedOrder"
      :data-orders="dataOrder"
      @onSelectOrder="onSelectOrder"
    />

    <b-modal
      id="modal-7"
      ref="modalAddPickupPopUp"
      hide-footer
      hide-header
      centered
      @hide="handleSubmitPopUpSuccess"
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
          @click="handleSubmitPopUpSuccess"
        >
          Oke
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCardTitle,
  BFormGroup,
  BFormDatepicker,
  BFormInput,
  BInputGroup,
  BInputGroupAppend,
  BFormTimepicker,
  BButton,
  BBadge,
  BModal,
  BIconPencilSquare,
  BIconChevronExpand,
} from 'bootstrap-vue'

import useJwt from '@/auth/jwt/useJwt'
import AddPickupTable from './AddPickupTable.vue'
import AddPickupPopup from './AddPickupPopup.vue'

export default {
  components: {
    BCardTitle,
    BFormGroup,
    BFormDatepicker,
    BFormInput,
    BInputGroup,
    BInputGroupAppend,
    BFormTimepicker,
    BButton,
    BBadge,
    BModal,
    BIconPencilSquare,
    BIconChevronExpand,
    AddPickupTable,
    AddPickupPopup,
  },
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
    dataOrder: {
      type: Array,
      default: () => [],
    },
    listSelected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedOrder: this.listSelected,
      selectedOrderId: this.genOrderId(this.listSelected),
      dateValue: new Date(),
      dateLabel: '',
      userData: {},
      isEditAddress: false,
      addressText: 'Gudang XYZ',
      addressDetailText: 'Jalan Raya Melebar penuh dengan sabar Aamiin',
      timeValue: '09:00',
      timeValueText: '09 : 00',
      chosenVehicle: '',
      isSubmitting: false,
      fields: [
        { key: 'product', label: 'Produk' },
        { key: 'qty', label: 'Jumlah' },
      ],
      items: [],
    }
  },
  mounted() {
    this.$http_komship.post('v1/my-profile', {
      headers: { Authorization: `Bearer ${useJwt.getToken()}` },
    }).then(response => {
      this.userData = response.data.data
    })
  },
  methods: {
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
    onEditAddress(events) {
      if (events) this.isEditAddress = !this.isEditAddress
    },
    onChooseVehicle(vehicle) {
      if (vehicle) this.chosenVehicle = vehicle
    },
    onChooseOrder() {
      this.$refs.addPickupPopUP.showModal()
    },
    onResetForm() {
      this.selectedOrder = []
    },
    onSubmitForm() {
      if (this.chosenVehicle && this.chosenVehicle === '') {
        this.alertFail('Please choose your vehicle to pickup your order')
      } else if (this.addressDetailText && this.addressDetailText === '') {
        this.alertFail('Please enter a valid address')
      } else { /* call the api if the form is already correct */
        this.storePickup()
      }
    },
    handleSubmitPopUpSuccess() {
      this.$root.$emit('bv::hide::modal', 'modal-7')
      this.handleOpenDetailView()
      // this.$router.push('history-pickup')
    },
    onSelectOrder(arrValue) {
      if (arrValue) {
        this.selectedOrder = arrValue
        this.selectedOrderId = this.genOrderId(arrValue)
      }
    },
    genOrderId(listData) {
      const container = []
      if (listData && listData.length && listData.length > 0) {
        for (let i = 0; i < listData.length; i += 1) {
          if (listData[i] && listData[i].order_id) {
            container.push(listData[i].order_id)
          }
        }
      }
      return container
    },
    handleOpenDetailView() {
      this.$emit('onSubmitInputForm', this.selectedOrder, this.selectedOrderId)
    },
    alertFail(textWarn, isReload) {
      this.$swal({
        title: `<span class="font-weight-bold h4">${textWarn}</span>`,
        imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
        showCloseButton: false,
        focusConfirm: true,
        confirmButtonText: 'Oke',
        customClass: {
          confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
        },
        buttonsStyling: false,
      }).then(() => {
        if (isReload) this.$forceUpdate()
      })
    },
    async storePickup() {
      const formData = {
        partner_name: this.profile && this.profile.partner_name ? this.profile.partner_name : 'Tata Usaha',
        pickup_date: this.changeDate(this.dateValue, 2),
        pickup_time: this.timeValue,
        // pickup_time: '10:00',
        pic: 'joko',
        pic_phone: '099229',
        vehicle: this.chosenVehicle,
        address_id: this.profile && this.profile.user_address_default && this.profile.user_address_default.address_id ? this.profile.user_address_default.address_id : 2,
        address_detail: this.addressDetailText,
        orders: this.selectedOrderId,
      }
      if (this.$route.name === 'ajukan-pickup') {
        await this.storePickupReq(formData)
      } else {
        await this.storePickupReqOb(formData)
      }
    },
    storePickupReqOb(formData) {
      this.isSubmitting = true
      return this.$http_komship.post(`v1/ob/pickup/${this.profile.partner_id}/store`, formData).then(response => {
        const { data } = response
        if (data) {
          this.isSubmitting = false
          this.$root.$emit('bv::show::modal', 'modal-7')
        }
      }).catch(() => {
        this.isSubmitting = false
        this.alertFail('Unable to Request a Pickup. Please and try again later or contact support.', true)
      })
    },
    storePickupReq(formData) {
      this.isSubmitting = true
      return this.$http_komship.post(`v1/pickup/${this.profile.partner_id}/store`, formData).then(response => {
        const { data } = response
        if (data) {
          this.isSubmitting = false
          this.$root.$emit('bv::show::modal', 'modal-7')
        }
      }).catch(() => {
        this.isSubmitting = false
        this.alertFail('Unable to Request a Pickup. Please and try again later or contact support.', true)
      })
    },
  },
}
</script>
