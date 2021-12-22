<template>
  <div class="add-pickup-table-wrapper">
    <b-modal
      id="modal-6"
      hide-footer
      hide-header
      centered
    >
      <b-icon-x-circle
        class="close-button-on-popup-pickup"
        @click="handleClosePopUp"
      />
      <div class="title-on-popup-pickup mt-2 mb-2">
        Pilih Orderan
      </div>
      <data-order-table
        ref="tableDataOrderOne2"
        :fields="fields"
        :items="dataOrders"
        :current-view="'send'"
        table-ref-name="tableDataOrder2"
        @onSelectOrder="onSelectOrder"
      />
      <b-button
        class="submit-button-on-popup-pickup org-button"
        @click="handleSubmit"
      >
        Simpan
      </b-button>
    </b-modal>
  </div>
</template>

<script>
import {
  BModal,
  BButton,
  BIconXCircle,
} from 'bootstrap-vue'
import DataOrderTable from '../order/DataOrderTable.vue'

export default {
  components: {
    BModal,
    BButton,
    BIconXCircle,
    DataOrderTable,
  },
  props: {
    dataOrders: {
      type: Array,
      default: () => [],
    },
    selectedOrderParent: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedOrder: [],
      fields: [
        { key: 'order_date', label: 'Tanggal Order' },
        { key: 'customer_name', label: 'Pelanggan' },
        { key: 'product', label: 'Produk' },
        { key: 'grand_total', label: 'Total Pembayaran' },
        { key: 'district', label: 'Alamat' },
      ],
    }
  },
  methods: {
    showModal() {
      this.$root.$emit('bv::show::modal', 'modal-6')
    },
    onSelectOrder(arrValue) {
      if (arrValue) this.selectedOrder = arrValue
    },
    handleClosePopUp() {
      this.selectedOrder = this.selectedOrderParent
      this.handleHidePopup()
    },
    handleSubmit() {
      this.$emit('onSelectOrder', this.selectedOrder)
      this.handleHidePopup()
    },
    handleHidePopup() {
      this.$root.$emit('bv::hide::modal', 'modal-6')
    },
  },
}
</script>

<style lang="scss">
  @import '../order/data-order.scss';
</style>
