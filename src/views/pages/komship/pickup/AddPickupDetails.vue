<template>
  <div class="add-pickup-details-main-wrapper">
    <b-button
      class="org-button no-mg mb-4"
      @click="onUpdateScreenViewParent"
    >
      <b-icon-chevron-left
        aria-hidden="true"
      />
    </b-button>

    <div class="add-pickup-details-title">
      Detail Orderan Pickup
    </div>

    <b-button
      class="org-button floating-print-button mt-2"
      @click="onShowModalPrint"
    >
      + Print Semua Label
    </b-button>

    <div class="add-pickup-input-notice-notif mt-2">
      <b-badge variant="light-warning">
        *Pastikan produk yang kamu masukan sudah tepat sebelum di ajukan
      </b-badge>
    </div>

    <data-order-table
      ref="pickupDetailsAdd"
      :items="listSelected"
      :fields="fields"
      table-ref-name="pickupDetailsAdd"
      :is-use-detail-address="true"
    />

    <add-pickup-popup-print
      ref="addPickupPopUpPrint"
      :selected-option="printOption"
      @onChangeOption="handleChangeOption"
      @onSubmitOption="onSubmitPrint"
    />

    <pickup-label-print
      ref="printLabelContent"
      :print-option="printOption"
      :profile="profile"
      :list-order="listSelected"
      @onAfterPrintLabel="handleAfterPrintLabel"
    />
  </div>
</template>

<script>
import {
  BButton,
  BIconChevronLeft,
  BBadge,
} from 'bootstrap-vue'
import DataOrderTable from '../order/DataOrderDetail.vue'
import AddPickupPopupPrint from './AddPickupPopupPrint.vue'
import PickupLabelPrint from './PickupLabelPrint.vue'

export default {
  components: {
    BButton,
    BIconChevronLeft,
    BBadge,
    DataOrderTable,
    AddPickupPopupPrint,
    PickupLabelPrint,
  },
  props: {
    listSelected: {
      type: Array,
      default: () => [],
    },
    profile: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      printOption: 1,
      fields: [
        { key: 'order_date', label: 'Tanggal Order' },
        { key: 'customer_name', label: 'Pelanggan' },
        { key: 'product', label: 'Produk' },
        { key: 'district', label: 'Alamat' },
        { key: 'airway_bill', label: 'No Resi' },
      ],
    }
  },
  methods: {
    onUpdateScreenViewParent() {
      this.$emit('onBackButtonClicked')
    },
    onShowModalPrint() {
      this.$refs.addPickupPopUpPrint.showModal()
    },
    handleChangeOption(values) {
      if (values) {
        this.printOption = values
        this.$refs.printLabelContent.changePrintOption(this.printOption)
      }
    },
    onSubmitPrint(values) {
      if (values) this.$refs.printLabelContent.printContent()
    },
    handleAfterPrintLabel() {
      if (this.profile.is_onboarding) {
        this.$emit('onBoardingShow')
      } else {
        this.$router.push('history-pickup')
      }
    },
  },
}
</script>

<style lang="scss">
  @import '../order/data-order.scss';
  @import './add-pickup-detail.scss';
</style>
