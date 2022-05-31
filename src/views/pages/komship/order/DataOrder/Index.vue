<template>
  <b-card>
    <div class="d-flex justify-between mb-2">
      <b-container>
        <b-row>
          <b-col>
            <h3 class="font-bold">
              Data Order
            </h3>
          </b-col>
          <b-col>
            <div class="d-flex justify-content-end">
              <b-button
                v-if="tabIndex === 1"
                variant="primary"
                size="md"
                class="mr-1"
                to="ajukan-pickup"
              >
                Ajukan Pickup
              </b-button>
              <b-button
                id="btn-export"
                v-b-modal.modalExport
                variant="outline-primary"
                size="md"
                right
              >
                Download
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <b-row>
      <b-modal
        id="modalExport"
        ref="modalExport"
        centered
        :size="'lg'"
        no-close-on-backdrop
        :header-bg-variant="'white'"
        :header-class="'no-border'"
        ok-title="Download"
        ok-variant="primary"
        cancel-title="Batalkan"
        cancel-variant="outline-primary"
        :footer-class="'no-border'"
        :content-class="'no-border'"
        hide-header
      >
        <template>
          <b-container class="text-center col">
            <b-row class="justify-content-end">
              <b-icon-x-circle
                style="width: 1.5rem; height: 1.5rem; cursor: pointer; "
                class="close-button-on-popup-pickup text-right"
                end
                @click="handleClosePopUp"
              />
            </b-row>
            <b-row class="mt-2 justify-content-center">
              <h3>
                Download Data Order
              </h3>
            </b-row>
            <b-row class="justify-content-center">
              Kustomisasi data order yang ingin kamu download
            </b-row>
            <b-row class="mt-2">
              <b-col
                sm="12"
                md="3"
              >
                <b-row class="border-b-2 pb-1 font-weight-bold">
                  Tanggal Order
                </b-row>
                <b-row class="my-1 mr-0 mr-md-2">
                  <!-- <date-range-picker
                    ref="picker"
                    v-model="rangeDate"
                    :locale-data="locale"
                    :ranges="ranges"
                    :date-format="disabledDate"
                  >
                    <template
                      v-slot:input="picker"
                      class="h-auto"
                    >
                      <div
                        class="d-flex h-auto justify-content-between align-items-center"
                      >
                        <span
                          class="mr-2"
                        >{{ formatDate(picker.startDate) }} -
                          {{ formatDate(picker.endDate) }}</span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 2V5"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16 2V5"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M3.5 9.08984H20.5"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15.6947 13.7002H15.7037"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15.6947 16.7002H15.7037"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.9955 13.7002H12.0045"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.9955 16.7002H12.0045"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.29431 13.7002H8.30329"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.29431 16.7002H8.30329"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </template>
                  </date-range-picker> -->
                  <date-range-picker
                    ref="picker"
                    v-model="rangeDate"
                    :opens="'rtl'"
                    :locale-data="locale"
                    :ranges="ranges"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :single-date-picker="singleDatePicker"
                    :time-picker="timePicker"
                    :time-picker24hour="timePicker24Hour"
                    :show-week-numbers="showWeekNumbers"
                    :show-dropdowns="showDropdowns"
                    :auto-apply="autoApply"
                    :linked-calendars="linkedCalendars"
                    :date-format="dateFormat"
                    @update="updateValues"
                    @toggle="logEvent('event: open', $event)"
                    @start-selection="logEvent('event: startSelection', $event)"
                    @finish-selection="logEvent('event: finishSelection', $event)"
                  >
                    <template
                      v-slot:input="picker"
                      class="h-auto"
                    >
                      <div
                        class="d-flex h-auto justify-content-between align-items-center"
                      >
                        <span
                          class="mr-2"
                        >{{ formatDate(picker.startDate) }} -
                          {{ formatDate(picker.endDate) }}</span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 2V5"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16 2V5"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M3.5 9.08984H20.5"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                            stroke="#222222"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15.6947 13.7002H15.7037"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M15.6947 16.7002H15.7037"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.9955 13.7002H12.0045"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.9955 16.7002H12.0045"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.29431 13.7002H8.30329"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.29431 16.7002H8.30329"
                            stroke="#222222"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </template>
                  </date-range-picker>
                </b-row>
              </b-col>
              <b-col
                sm="12"
                md="3"
              >
                <b-row class="border-b-2 pb-1 mt-2 mt-md-0 font-weight-bold">
                  Metode Pembayaran
                </b-row>
                <b-row>
                  <div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="chcekedCod"
                        v-model="paymentMethod"
                        name="chcekedCod"
                        value="COD"
                        class="text-left"
                      >
                        COD
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="chcekedBankTransfer"
                        v-model="paymentMethod"
                        name="chcekedBankTransfer"
                        class="text-left"
                        value="BANK TRANSFER"
                      >
                        Bank Transfer
                      </b-form-checkbox>
                    </div>
                  </div>
                </b-row>
              </b-col>
              <b-col
                sm="12"
                md="3"
              >
                <b-row class="border-b-2 pb-1  mt-2 mt-md-0 font-weight-bold">
                  Status
                </b-row>
                <b-row>
                  <div class="my-1">
                    <b-form-checkbox
                      id="checkedOrderDibuat"
                      v-model="orderStatus"
                      name="checkedOrderDibuat"
                      class="text-left"
                      value="Dibuat"
                    >
                      Order Dibuat
                    </b-form-checkbox>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkedOrderPacked"
                        v-model="orderStatus"
                        class="text-left"
                        name="checkedOrderPacked"
                        value="Dipacking"
                      >
                        Dipacking
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkedOrderSent"
                        v-model="orderStatus"
                        name="checkedOrderSent"
                        class="text-left"
                        value="Dikirim"
                      >
                        Dikirim
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkedOrderDeliver"
                        v-model="orderStatus"
                        name="checkedOrderDeliver"
                        class="text-left"
                        value="Diterima"
                      >
                        Diterima
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkedOrderRetur"
                        v-model="orderStatus"
                        name="checkedOrderRetur"
                        class="text-left"
                        value="Retur"
                      >
                        Retur
                      </b-form-checkbox>
                    </div>
                  </div>
                </b-row>
              </b-col>
              <b-col
                sm="12"
                md="3"
              >
                <b-row class="border-b-2 pb-1  mt-2 mt-md-0 font-weight-bold">
                  Expedisi
                </b-row>
                <b-row>
                  <div class="my-1">
                    <b-form-checkbox
                      id="chcekedJNE"
                      v-model="shipping"
                      name="chcekedJNE"
                      class="text-left"
                      value="JNE"
                    >
                      JNE
                    </b-form-checkbox>
                    <div class="my-1">
                      <b-form-checkbox
                        id="chcekedSiCepat"
                        v-model="shipping"
                        class="text-left"
                        name="chcekedSiCepat"
                        value="SICEPAT"
                      >
                        SiCepat
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="chcekedIDExpress"
                        v-model="shipping"
                        name="chcekedIDExpress"
                        class="text-left"
                        value="IDEXPRESS"
                      >
                        IDExpress
                      </b-form-checkbox>
                    </div>
                  </div>
                </b-row>
              </b-col>
            </b-row>
          </b-container>
        </template>
        <template #modal-footer>
          <button
            class="btn btn-outline-primary m-1"
            @click="closeModalExport"
          >
            Batalkan
          </button>
          <button
            class="btn btn-primary m-1"
            @click="downloadCsv"
          >
            Download
            <span class="ml-1">
              <b-spinner
                v-if="loading"
                small
                label="Loading..."
              />
            </span>
          </button>
        </template>
      </b-modal>
    </b-row>
    <b-tabs
      v-model="tabIndex"
      fill
    >
      <b-tab
        title="Semua"
        lazy
      >
        <all />
      </b-tab>
      <b-tab lazy>
        <template slot="title">
          <b-badge
            class="mr-1"
            variant="primary"
            pill
          >
            {{ totalAjukan }}
          </b-badge>
          Order Dibuat
        </template>
        <created />
      </b-tab>
      <b-tab lazy>
        <template slot="title">
          <b-badge
            class="mr-1"
            variant="primary"
            pill
          >
            {{ totalPacking }}
          </b-badge>
          Dipacking
        </template>
        <packing />
      </b-tab>
      <b-tab lazy>
        <template slot="title">
          <b-badge
            class="mr-1"
            variant="primary"
            pill
          >
            {{ totalKirim }}
          </b-badge>
          Dikirim
        </template>
        <send />
      </b-tab>
      <b-tab
        title="Diterima"
        lazy
      >
        <received />
      </b-tab>
      <b-tab
        title="Retur"
        lazy
      >
        <retur />
      </b-tab>
    </b-tabs>
  </b-card>
</template>
<script>
import {
  BCard, BSpinner, BTabs, BTab, BButton, BBadge, BCol, BRow, BContainer, BIconXCircle,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import DateRangePicker from 'vue2-daterange-picker'
import moment from 'moment'
import All from './List/All.vue'
import Created from './List/Created.vue'
import Packing from './List/Packing.vue'
import Send from './List/Send.vue'
import Received from './List/Received.vue'
import Retur from './List/Retur.vue'
import '../../../../../index.css'

export default {
  components: {
    BCard, BTabs, BTab, All, Created, Packing, Send, Received, Retur, BButton, BBadge, BCol, BContainer, BRow, BIconXCircle, DateRangePicker,
  },
  filters: {
    dateCell(value) {
      const dt = new Date(value)

      return dt.getDate()
    },
    date(val) {
      return val ? val.toLocaleString() : ''
    },
  },
  data() {
    const today = new Date()
    today.setHours(23, 59, 59, 0)
    const startDate = new Date()
    const endDate = new Date()
    const checked = false
    endDate.setDate(endDate.getDate() + 6)
    const tabs = ['semua', 'order-dibuat', 'dipacking', 'dikirim', 'diterima', 'retur']
    return {
      tabIndex: tabs.indexOf(this.$route.query.tab),
      tabs,
      profile: JSON.parse(localStorage.userData),
      totalAjukan: null,
      totalPacking: null,
      totalKirim: null,
      dateRange: { startDate, endDate },
      orderDate: '',
      loading: false,
      paymentMethod: [],
      orderStatus: [],
      shipping: [],
      chcekedJNE: false,
      chcekedSiCepat: false,
      chcekedIDExpress: false,
      locale: {
        format: 'dd/mm/yyyy',
        daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      },
      ranges: {
        'Hari Ini': [this.$moment().subtract(7, 'days').startOf('day').toDate(), today],
        'Minggu Terakhir': [this.$moment().subtract(30, 'days').startOf('day').toDate(), today],
        'Bulan Terakhir': [this.$moment().subtract(60, 'days').startOf('day').toDate(), today],
        'Bulan Ini': [this.$moment().startOf('month').toDate(), today],
      },
      rangeDate: {
        startDate: this.$moment().subtract(30, 'days').startOf('day').toDate(),
        endDate: today,
      },
    }
  },
  watch: {
    tabIndex(newValue) {
      const tab = this.tabs[newValue]
      this.$router.replace({ query: { tab } }).catch(() => {})
    },
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatDate(d) {
      return moment(d).format('D MMM YYYY')
    },
    fetchData() {
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: { order_status: 'Diajukan' },
      }).then(res => {
        const { data } = res.data
        this.totalAjukan = data.total
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: { order_status: 'Dipacking' },
      }).then(res => {
        const { data } = res.data
        this.totalPacking = data.total
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: { order_status: 'Dikirim' },
      }).then(res => {
        const { data } = res.data
        this.totalKirim = data.total
      }).catch(err => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Gagal',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        })
      })
    },
    handleClosePopUp() {
      this.$root.$emit('bv::hide::modal', 'modalExport')
    },
    getLabelDateRange(index) {
      if (index === 0) {
        return 'Real Time'
      }

      if (index === 1) {
        return '7 hari terakhir'
      }

      if (index === 2) {
        return '30 hari terakhir'
      }

      if (index === 3) {
        return 'Custom Tanggal'
      }

      return ''
    },
    downloadCsv() {
      const formData = {
        order_date: this.orderDate.toString(),
        payment_method: this.paymentMethod.toString(),
        order_status: this.orderStatus.toString(),
        shipping: this.shipping.toString(),
      }
      this.loading = true
      console.log(formData)

      this.$http_komship.get(`v1/export/order/${this.profile.partner_detail.id}`, {
        params: formData,
      }, { responseType: 'blob' }).then(result => {
        const binary = atob(result.data.replace(/\s/g, ''))
        const len = binary.length
        const buffer = new ArrayBuffer(len)
        const view = new Uint8Array(buffer)
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i)
        }
        const file = new Blob([view], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileURL
        const fileName = `${+new Date()}.csv`// whatever your file name .
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    closeModalExport() {
      this.$refs.modalExport.hide()
    },
    // showModalExport() {
    //   this.$bvModal.msgBoxOk('Data was submitted successfully', {
    //   //   title: <div>
    //   //   <b-icon-x-circle
    //   //   class="close-button-on-popup-pickup"
    //   //   @click="handleClosePopUp"
    //   // /></div>,
    //     title: 'Export',

    //     size: 'sm',
    //     buttonSize: 'sm',
    //     okVariant: 'success',

    //     headerCloseLabel: 'Close',
    //     bodyClass: 'end',
    //     headerClass: 'p-2 border-bottom-0 bg-white',
    //     footerClass: 'p-2 border-top-0',
    //     centered: true,
    //   })
    //     .then(value => {
    //       // this.boxTwo = value
    //     })
    //     .catch(err => {
    //       // An error occurred
    //     })
    // },
  },
}
</script>
<style lang="scss" scoped>
.slot {
  background-color: #aaa;
  padding: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-black {
  color: #000;
}

</style>
