<template>
  <div>
    <b-modal
      id="modal-3"
      title="Tambah Resi"
      :ok-title="okTitleButton"
      :ok-disabled="isOnProccess"
      :cancel-title="cancelTitleButton"
      body-class="modal-on-detail-data-order"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOkModal"
      @cancel="handleCancelModalInputResi"
    >
      <template v-slot:modal-header-close>
        <b-icon-x-circle
          class="close-button-on-popup-input-resi"
        />
      </template>
      <div
        v-if="modalState === 'default'"
      >
        <b-form-group
          class="data-order-modal-input-label"
          label="No Resi"
          label-cols-md="5"
          label-for="modal-input-resi"
        >
          <b-form-input
            id="modal-input-resi"
            v-model="inputtedResi"
            class="modal-input-resi"
            type="text"
          />
        </b-form-group>
        <b-form-group
          v-if="warnTextModal !== ''"
          class="data-order-modal-input-label"
          label-cols-md="5"
          label-for="modal-input-resi-warn"
        >
          <div
            id="modal-input-resi-warn"
            class="modal-resi-danger-text"
          >
            {{ warnTextModal }}
          </div>
        </b-form-group>
      </div>
      <div
        v-else
        class="resi-receipt-modal-popup-wrapper"
      >
        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="No Resi"
          label-cols-md="4"
          label-for="resi-order-popup"
        >
          <div
            id="resi-order-popup"
            class="data-order-detail-text"
          >
            {{ inputtedResi }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Nama Penerima"
          label-cols-md="4"
          label-for="penerima-order-popup"
        >
          <div
            id="penerima-order-popup"
            class="data-order-detail-text"
          >
            {{ detailOrder.customer_name }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="No Hp"
          label-cols-md="4"
          label-for="phone-order-popup"
        >
          <div
            id="phone-order-popup"
            class="data-order-detail-text"
          >
            {{ detailOrder.customer_phone }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Alamat"
          label-cols-md="4"
          label-for="address-order-popup"
        >
          <div
            id="address-order-popup"
            class="data-order-detail-text"
          >
            {{ detailOrder.customer_address }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Ekspedisi"
          label-cols-md="4"
          label-for="expedisi-order-popup"
        >
          <div
            id="expedisi-order-popup"
            class="data-order-detail-text"
          >
            {{ detailOrder.shipping }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Tanggal Resi"
          label-cols-md="4"
          label-for="date-order-popup"
        >
          <div
            id="date-order-popup"
            class="data-order-detail-text"
          >
            {{ detailOrder.order_date }}
          </div>
        </b-form-group>
      </div>
    </b-modal>

    <b-modal
      id="modal-4"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-order-popup-success">
        <div class="image-wrapper">
          <img src="@/assets/images/icons/success.svg">
        </div>
        <div class="text-wrapper">
          No Resi Berhasil di Tambahkan
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BFormGroup,
  BFormInput,
  BModal,
  BIconXCircle,
} from 'bootstrap-vue'

export default {
  components: {
    BFormGroup,
    BFormInput,
    BModal,
    BIconXCircle,
  },
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
    detailOrder: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      inputtedResi: '',
      warnTextModal: '',
      okTitleButton: 'Cek Resi',
      cancelTitleButton: 'Batal',
      modalState: 'default',
      isOnProccess: false,
    }
  },
  methods: {
    getDate(dateVal) {
      if (dateVal) {
        let today = dateVal.split(' ')
        const month = today[1]
        today = `${today[0]} ${month} ${today[2]}`
        return today
      }
      return dateVal
    },
    showModalInputResi() {
      this.$root.$emit('bv::show::modal', 'modal-3')
    },
    handleCancelModalInputResi(bvModalEvt) {
      if (this.modalState === 'default') {
        this.$root.$emit('bv::hide::modal', 'modal-3')
        this.resetModal()
      } else {
        this.handleBackModalInputResi(bvModalEvt)
      }
    },
    handleBackModalInputResi(bvModalEvt) {
      this.okTitleButton = 'Cek Resi'
      this.cancelTitleButton = 'Batal'
      this.modalState = 'default'
      this.warnTextModal = ''
      bvModalEvt.preventDefault()
    },
    resetModal() {
      this.inputtedResi = ''
      this.warnTextModal = ''
      this.okTitleButton = 'Cek Resi'
      this.cancelTitleButton = 'Batal'
      this.modalState = 'default'
    },
    handleOkModal(bvModalEvt) {
      if (this.modalState === 'receipt') {
        this.triggerUpdateAirwayBill(this.inputtedResi)
      } else if (this.modalState !== 'receipt') {
        bvModalEvt.preventDefault()
        this.checkFormValidity(bvModalEvt)
      }
    },
    handleShowSuccesModal() {
      this.$root.$emit('bv::show::modal', 'modal-4')
    },
    handleOkModalShowReceipt(bvModalEvt) {
      this.okTitleButton = 'Simpan'
      this.cancelTitleButton = 'Kembali'
      this.modalState = 'receipt'
      bvModalEvt.preventDefault()
    },
    handleSuccessUpdateAirwayBill(airwayBillText) {
      this.$emit('onUpdateAirwayBill', airwayBillText)
    },
    async checkFormValidity(bvModalEvt) {
      await this.checkAirwayBill(bvModalEvt)
    },
    async triggerUpdateAirwayBill() {
      await this.updateAirwayBill()
    },
    checkAirwayBill(bvModalEvt) {
      this.isOnProccess = true
      this.okTitleButton = 'Please wait'
      return this.$http_komship.get(`v1/check-awb/${this.inputtedResi}/${this.detailOrder.order_id}`).then(response => {
        const { data } = response
        // console.log('checkAirwayBill', data)
        if (data && data.status === 'success') {
          this.warnTextModal = ''
          this.handleOkModalShowReceipt(bvModalEvt)
        } else {
          this.warnTextModal = data && data.status === 'failed' && data.message && data.message !== '' ? data.message : 'No resi tidak valid'
          this.okTitleButton = 'Cek Resi'
        }
        this.isOnProccess = false
      }).catch(response => {
        const { data } = response
        console.log('failed to checkAirwayBill', data)
        this.warnTextModal = data && data.status === 'failed' && data.message && data.message !== '' ? data.message : 'failed to check no resi'
        this.isOnProccess = false
        this.okTitleButton = 'Cek Resi'
      })
    },
    updateAirwayBill(airwayBillText) {
      this.isOnProccess = true
      this.okTitleButton = 'Please wait'
      const newAirwayBill = {
        airway_bill: airwayBillText,
      }
      return this.$http_komship.put(`v1/order/${this.profile.partner_id}/update/${this.detailOrder.order_id}`, newAirwayBill).then(response => {
        const { data } = response.data
        // console.log('updateAirwayBill', data)
        if (data) {
          this.handleSuccessUpdateAirwayBill(airwayBillText)
          this.handleShowSuccesModal()
          this.isOnProccess = false
          this.okTitleButton = 'Simpan'
        }
      }).catch(() => {
        console.log('failed to updateAirwayBill')
        this.isOnProccess = false
        this.okTitleButton = 'Simpan'
      })
    },
  },
}
</script>
