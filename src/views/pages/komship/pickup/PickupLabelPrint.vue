<template>
  <div
    id="pickupLabelContent"
    :class="`pickup-label-container ${selectedOptions === 1 ? 'pickup-label-container-1' : (selectedOptions === 2 ? 'pickup-label-container-2' : (selectedOptions === 4 ? 'pickup-label-container-4' : 'pickup-label-container-full'))}`"
  >
    <div
      v-for="(item, itemIndex) in listOrder"
      :key="`pickupLabelWrapperKey${itemIndex}`"
      :class="`pickup-label-wrapper ${selectedOptions === 1 || selectedOptions === 2 ? 'pickup-label-wrapper-2' : (selectedOptions === 150 ? 'pickup-label-wrapper-150' : (selectedOptions === 100 ? 'pickup-label-wrapper-100' : ''))} ${selectedOptions === 1 ? 'pickup-label-wrapper-1' : ''}`"
    >
      <div class="pickup-label-receiver-wrapper">
        <div class="pickup-label-title">
          Penerima
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Nama Penerima
          </div>
          <div class="pickup-label-value">
            {{ item.customer_name }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Alamat
          </div>
          <div class="pickup-label-value">
            {{ item.detail_address }}
          </div>
        </div>
      </div>
      <div class="pickup-label-sender-wrapper">
        <div class="pickup-label-title">
          Pengirim
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Nama Pengirim
          </div>
          <div class="pickup-label-value">
            {{ profile.user_name }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Kota / Kabupaten
          </div>
          <div class="pickup-label-value">
            {{ profile.user_address }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            No HP
          </div>
          <div class="pickup-label-value">
            {{ profile.user_phone }}
          </div>
        </div>
      </div>
      <div class="pickup-label-details-wrapper">
        <div class="pickup-label-title">
          Detail Pengiriman
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            No Resi
          </div>
          <div class="pickup-label-value">
            {{ item.airway_bill }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Nama Ekspedisi
          </div>
          <div class="pickup-label-value">
            {{ item.shipping }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            No Orderan
          </div>
          <div class="pickup-label-value">
            {{ item.order_no }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            SKU
          </div>
          <div class="pickup-label-value">
            {{ item.product[0].product_sku }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Variasi
          </div>
          <div class="pickup-label-value">
            {{ item.product[0].variant_name }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Kuantiti
          </div>
          <div class="pickup-label-value">
            {{ item.product[0].qty }}
          </div>
        </div>
        <div class="pickup-label-txt-wrapper">
          <div class="pickup-label-key">
            Metode Pembayaran
          </div>
          <div class="pickup-label-value">
            {{ item.payment_method }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js'

export default {
  props: {
    printOption: {
      type: Number,
      default: 1,
    },
    profile: {
      type: Object,
      default: () => {},
    },
    listOrder: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedOptions: this.printOption,
    }
  },
  methods: {
    changePrintOption(printOption) {
      if (printOption) this.selectedOptions = printOption
    },
    handleAfterPrint() {
      this.$emit('onAfterPrintLabel')
    },
    printContent() {
      printJS({
        printable: 'pickupLabelContent',
        type: 'html',
        style: this.getStyle(),
        scanStyles: false,
        honorMarginPadding: false,
        onError: () => {
          // handle error
        },
      })
      this.handleAfterPrint()
    },
    getStyle() {
      return `
        .pickup-label-container {
          padding: 2rem;
          height: fit-content;
        }
        .pickup-label-wrapper {
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          color: #222222;
          font-size: 16px;
          text-align: left;
          border: 1px solid #E2E2E2;
          border-radius: 12px;
          padding: 8px;
        }
        .pickup-label-title {
          font-size: 20px;
          margin-bottom: 11px;
        }
        .pickup-label-receiver-wrapper, .pickup-label-sender-wrapper {
          margin-bottom: 5rem;
        }
        .pickup-label-txt-wrapper {
          padding: 8px 0;
          border-top: 1px solid #E2E2E2;
        }
        .pickup-label-value, .pickup-label-key {
          display: inline-block;
          vertical-align: top;
        }
        .pickup-label-key {
          font-weight: 400;
          color: #151515;
          width: 227px;
        }
        .pickup-label-value {
          width: calc(100% - 227px);
        }

        .pickup-label-container-2 {
          padding: 2rem;
        }
        .pickup-label-wrapper-2 {
          display: grid;
          grid-template-columns: auto auto;
          margin-bottom: 4rem;
          height: 447.375px; // A4 height divide by 2
        }
        .pickup-label-wrapper-2 .pickup-label-key {
          width: 160px;
        }
        .pickup-label-wrapper-2 .pickup-label-value {
          width: calc(100% - 160px);
        }
        .pickup-label-wrapper-2 .pickup-label-receiver-wrapper, .pickup-label-wrapper-2 .pickup-label-sender-wrapper {
          margin-bottom: 0rem;
        }
        .pickup-label-wrapper-2 > div {
          padding-right: 1.5rem;
        }
        .pickup-label-wrapper-2 .pickup-label-sender-wrapper {
          width: 100%;
        }

        .pickup-label-container-1 {
          padding: 2rem;
        }
        .pickup-label-wrapper-1 {
          margin-bottom: 1342.125px;
        }

        .pickup-label-container-4 {
          display: grid;
          grid-template-columns: auto auto;
          grid-gap: 1.6rem;
          padding: 0rem;
        }
        .pickup-label-container-4 .pickup-label-receiver-wrapper, .pickup-label-container-4 .pickup-label-sender-wrapper {
          margin-bottom: 8px;
        }
        .pickup-label-container-4 .pickup-label-key {
          width: 140px;
        }
        .pickup-label-container-4 .pickup-label-value {
          width: calc(100% - 140px);
        }
        .pickup-label-container-4 .pickup-label-txt-wrapper {
          padding: 4px 0;
        }

        .pickup-label-container-full {
          padding: 0rem;
        }

        .pickup-label-wrapper-100 {
          font-size: 8px;
          padding: 8px;
          margin-bottom: 11px;
          margin-bottom: 4rem;
          height: 350.95275591px; // 10cm
        }
        .pickup-label-wrapper-100 .pickup-label-title {
          font-size: 12px;
          margin-bottom: 6px;
        }
        .pickup-label-wrapper-100 .pickup-label-key {
          width: 100px;
        }
        .pickup-label-wrapper-100 .pickup-label-value {
          width: calc(100% - 100px);
        }
        .pickup-label-wrapper-100 .pickup-label-receiver-wrapper, .pickup-label-wrapper-100 .pickup-label-sender-wrapper {
          margin-bottom: 8px;
        }
        .pickup-label-wrapper-100 .pickup-label-txt-wrapper {
          padding: 4px 0;
        }

        .pickup-label-wrapper-150 {
          font-size: 14px;
          padding: 8px;
          margin-bottom: 4rem;
          height: 526.429133865; // 15cm
        }
        .pickup-label-wrapper-150 .pickup-label-title {
          font-size: 18px;
          margin-bottom: 11px;
        }
        .pickup-label-wrapper-150 .pickup-label-key {
          width: 140px;
        }
        .pickup-label-wrapper-150 .pickup-label-value {
          width: calc(100% - 140px);
        }
        .pickup-label-wrapper-150 .pickup-label-receiver-wrapper, .pickup-label-wrapper-150 .pickup-label-sender-wrapper {
          margin-bottom: 12px;
        }
        .pickup-label-wrapper-150 .pickup-label-txt-wrapper {
          padding: 8px 0;
        }
      `
    },
  },
}
</script>

<style lang="scss">
  .pickup-label-container {
    display: none;
  }
</style>
