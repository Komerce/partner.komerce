<template>
  <b-card>
    <b-button
      variant="primary"
      tag="router-link"
      :to="{ name: $route.meta.routeBack, params: { selected_order_from_detail: selectedOrder } }"
    >
      <b-icon-chevron-left
        aria-hidden="true"
      />
    </b-button>
    <b-row class="justify-content-end">
      <h4 class="mr-3">
        <strong>
          Detail orderan pickup
        </strong>
      </h4>
    </b-row>
    <b-row class="justify-content-end mr-3 mt-2 mb-5">
      <b-button
        variant="primary"
        @click="onShowModalPrint"
      >
        + Print Semua Label
      </b-button>
    </b-row>

    <b-row>
      <b-table
        :fields="fields"
        :items="items"
      >
        <template #cell(date_order)="data">
          <h5>
            <strong>
              {{ data.item.order_date }}
            </strong>
          </h5>
          <p>
            {{ data.item.shipping }}
          </p>
        </template>
        <template #cell(pelanggan)="data">
          <h5>
            <strong>
              {{ data.item.customer_name }}
            </strong>
          </h5>
        </template>
        <template #cell(product)="data">
          <div
            v-for="(itemsProduct, index) in data.item.product"
            :key="index+1"
          >
            <b-row>
              <b-container
                fluid
                class="d-flex"
              >
                <div>
                  <b-avatar
                    variant="light-primary"
                    square
                    size="50px"
                  />
                </div>
                <div class="ml-1">
                  <p><strong>{{ itemsProduct.product_name }}</strong></p>
                  <p class="text-primary"><strong>{{ itemsProduct.variant_name }}</strong></p>
                </div>
              </b-container>
            </b-row>
          </div>
        </template>
        <template #cell(address)="data">
          <h5>
            <strong>
              {{ data.item.district }}
            </strong>
          </h5>
          <p>
            {{ data.item.detail_address }}
          </p>
        </template>
        <template #cell(resi)="data">
          {{ data.item.airway_bill }}
        </template>
      </b-table>

      <pickup-label-print
        ref="printLabelContent"
        :print-option="printOption"
        :profile="{profile}"
        :list-order="selectedOrder"
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
            v-for="(itemsPrint, index) in selectedOrder"
            :key="index+1"
          >
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
                      :value="itemsPrint.airway_bill"
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
                    <div class="flex flex-row space-x-2">
                      <feather-icon icon="user-icon" />
                      <div class="text-base text-black font-light">
                        {{ profile.user_name }}
                      </div>
                    </div>
                    <div class="flex flex-row space-x-2">
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
                        {{ itemsPrint.customer_name }}
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
                        {{ itemsPrint.detail_address }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="col-span-1 border-black text-4xl py-2 px-2  border flex justify-center text-black font-black">
                    {{ itemsPrint.payment_method }}
                  </div>
                  <div class="col-span-2 border-black px-2 py-2 items-center justify-center border flex flex-row space-x-2">
                    <div class="font-bold text-black">
                      Order ID
                    </div>
                    <div class="flex flex-col justify-center">
                      <barcode
                        :value="itemsPrint.order_no"
                        height="33"
                      >
                        Show this if the rendering fails.
                      </barcode>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(dataProduct, indexProduct) in itemsPrint.product"
                  :key="indexProduct+1"
                >
                  <div class="grid grid-cols-3 gap-2">
                    <div class="col-span-1 border-black text-xl py-2 px-2  border flex text-black font-black">
                      Kuantitas : {{ dataProduct.qty }}
                    </div>
                    <div class="col-span-2 border-black px-2 py-2 items-center  border flex flex-row space-x-2">
                      <div class="text-xl text-black font-black">
                        ISI PAKET : {{ dataProduct.product_name }}
                      </div>
                      <div class="text-xl text-black font-medium">
                        {{ dataProduct.variant_name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </vue-html2pdf>
    </b-row>
    <AddPickupPopupPrint
      :selected-option="printOption"
      @onSubmitOption="onSubmitOptionPrint"
      @onChangeOption="handleChangeOption"
    />
  </b-card>
</template>

<script>
import {
  BCard,
  BRow,
  BTable,
  BContainer,
  BAvatar,
  BIconChevronLeft,
  BButton,
  BImg,
} from 'bootstrap-vue'
import VueHtml2pdf from 'vue-html2pdf'
import VueBarcode from 'vue-barcode'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'
import AddPickupPopupPrint from '../AddPickupPopupPrint.vue'
import PickupLabelPrint from '../PickupLabelPrint.vue'

export default {
  components: {
    BCard,
    BRow,
    BTable,
    BContainer,
    BAvatar,
    BIconChevronLeft,
    BButton,
    VueHtml2pdf,
    barcode: VueBarcode,
    AddPickupPopupPrint,
    PickupLabelPrint,
    BImg,
  },

  data() {
    return {
      selectedOrder: this.$route.params.selected_order,

      items: [],
      fields: [
        {
          key: 'date_order',
          label: 'Tanggal Order',
        },
        {
          key: 'pelanggan',
          label: 'Pelanggan',
        },
        {
          key: 'product',
          label: 'Produk',
        },
        {
          key: 'address',
          label: 'Alamat',
        },
        {
          key: 'resi',
          label: 'resi',
          formatter(value) {
            return value === null ? '-' : value
          },
        },
      ],

      profile: [],
      printOption: 1,

      valuePrint: [],

      idOrderFromHistory: this.$route.params.selected_order.data_order,
    }
  },
  mounted() {
    this.$http_komship.post('v1/my-profile', {
      headers: { Authorization: `Bearer ${useJwt.getToken()}` },
    }).then(response => {
      this.profile = response.data.data
      console.log('profile', this.profile.partner_id)
      this.getOrder()
    }).catch(() => {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Gagal',
          icon: 'AlertCircleIcon',
          text: 'Gagal meload kendaraan, silahkan refresh halaman!',
          variant: 'danger',
        },
      })
    })
    this.items = this.selectedOrder
    console.log('idOrder', this.idOrderFromHistory)
  },
  methods: {
    getOrder() {
      this.$http_komship.get(`/v1/order/${this.profile.partner_id}`).then(response => {
        console.log('result', response)
        const { data } = response.data.data
        this.items = data
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.items.length; x++) {
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.idOrderFromHistory.length; y++) {
            if (this.items[x].order_id !== this.idOrderFromHistory[y].order_id) {
              this.items.splice(x, 1)
            }
          }
        }
        console.log('itemsResult', this.items)
        return this.items
      }).catch(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: 'Gagal meload kendaraan, silahkan refresh halaman!',
            variant: 'danger',
          },
        })
      })
    },
    onShowModalPrint() {
      this.$bvModal.show('modal-8')
      // this.$refs.addPickupPopUpPrint.showModal()
      // this.$refs.html2Pdf.generatePdf()
    },
    onUpdateScreenViewParent() {
      this.$emit('onBackButtonClicked')
    },
    handleChangeOption(values) {
      if (values) {
        this.printOption = values
        this.$refs.printLabelContent.changePrintOption(this.printOption)
      }
    },
    onSubmitOptionPrint(values) {
      console.log('opttion print view', values)
      this.$refs.html2Pdf.generatePdf()
    },
    onSubmitPrint(values) {
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
  @import '../../order/data-order.scss';
  @import '../add-pickup-detail.scss';
</style>
