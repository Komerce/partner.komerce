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
    <vue-html2pdf
      ref="html2Pdf"
      :enable-download="false"
      :show-layout="false"
      :float-layout="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"

      pdf-content-width="100%"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
    >
      <section slot="pdf-content">
        <div
          class="w-full h-full"
          style="padding-left: 20px; padding-right: 20px; padding-top:24px"
        >
          <div
            class="flex flex-col w-full space-y-4 border border-black"
            style="padding-left: 12px; padding-right:12px; padding-top:8px; padding-bottom:16px"
          >
            <div class="grid grid-cols-3 gap-8 ">
              <div class="col-span-1 items-center justify-center flex flex-col space-y-2">
                <div class="font-bold">
                  Nomor Resi
                </div>
                <barcode
                  :value="item.airway_bill"
                  height="32"
                >
                  Show this if the rendering fails.
                </barcode>
              </div>
              <div class="col-span-1 flex items-center justify-center ">
                <b-img

                  height="24"
                  src="@/assets/images/expedisi/logo-jne.png"
                  alt="ekspedisi"
                />
              </div>
              <div class="col-span-1 flex  justify-center items-center">
                <img
                  height="24"
                  src="@/assets/images/logo.png"
                  alt=""
                >
              </div>
            </div>
            <div
              style="margin-top: 9px"
              class="grid grid-cols-2 gap-2"
            >
              <div class="col-span-1 px-2 py-1 border border-black flex flex-col space-y-1">
                <h3 class="text-lg w-full justify-center text-black flex center">
                  PENGIRIM
                </h3>
                <div class="flex  flex-row space-x-2">
                  <feather-icon icon="user-icon" />
                  <div class="text-base text-black font-light">
                    {{ profile.user_name }}
                  </div>
                </div>
                <div class="flex  flex-row space-x-2">
                  <feather-icon icon="user-icon" />
                  <div class="text-base text-black font-light">
                    {{ profile.user_phone }}
                  </div>
                </div>
                <div class="flex  flex-row space-x-2">
                  <feather-icon icon="user-icon" />
                  <div class="text-base text-black font-light">
                    {{ profile.user_address }}
                  </div>
                </div>
              </div>
              <div class="col-span-1 px-2 py-1 border border-black">
                <h3 class="text-lg w-full justify-center text-black flex center">
                  PENERIMA
                </h3>
                <div class="flex  flex-row space-x-2">
                  <feather-icon icon="user-icon" />
                  <div class="text-base text-black font-light">
                    Example12345
                  </div>
                </div>
                <div class="flex  flex-row space-x-2">
                  <feather-icon icon="user-icon" />
                  <div class="text-base text-black font-light">
                    082134567890
                  </div>
                </div>
                <div class="flex  flex-row space-x-2">
                  <feather-icon icon="user-icon" />
                  <div class="text-base text-black font-light">
                    Rumah depan masjid Al-Fatah No.03 Jalan jendral sudirman RT 10 RW 03 Desa Tunjungmuli
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-1 border-black text-6xl py-2 px-2  border flex justify-center text-black font-black">
                COD
              </div>
              <div class="col-span-2 border-black px-2 py-2 items-center justify-center border flex flex-row space-x-2">
                <div class="font-bold text-black">
                  Order ID
                </div>
                <div class="flex flex-col justify-center">
                  <barcode
                    value="102838912790929781"
                    height="33"
                  >
                    Show this if the rendering fails.
                  </barcode>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div class="col-span-1 border-black text-xl py-2 px-2  border flex text-black font-black">
                Kuantitas : 4
              </div>
              <div class="col-span-2 border-black px-2 py-2 items-center  border flex flex-row space-x-2">
                <div class="text-xl text-black font-black">
                  ISI PAKET :
                </div>
                <div class="text-xl text-black font-medium">
                  1 Kaos merah, 1 kaos hijau
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import {
  BButton,
  BIconChevronLeft,
  BBadge,
} from 'bootstrap-vue'
import VueHtml2pdf from 'vue-html2pdf'
import VueBarcode from 'vue-barcode'
import { $themeConfig } from '@themeConfig'
import AddPickupPopupPrint from './AddPickupPopupPrint.vue'
import PickupLabelPrint from './PickupLabelPrint.vue'

export default {
  components: {
    BButton,
    BIconChevronLeft,
    BBadge,
    AddPickupPopupPrint,
    VueHtml2pdf,
    barcode: VueBarcode,
    PickupLabelPrint,
  },
  setup() {
    // App Name
    const { appName, appLogoImage } = $themeConfig.app
    return {
      appName,
      appLogoImage,
    }
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
      // this.$refs.addPickupPopUpPrint.showModal()
      this.$refs.html2Pdf.generatePdf()
    },
    handleChangeOption(values) {
      if (values) {
        this.printOption = values
        this.$refs.printLabelContent.changePrintOption(this.printOption)
      }
    },
    onSubmitPrint() {
      // if (values) this.$refs.printLabelContent.printContent()

      this.$refs.html2Pdf.generatePdf()
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
