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
                style="width: 24px; height: 24px; cursor: pointer; "
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
                  <date-range-picker
                    ref="picker"
                    v-model="dateRange"
                    :opens="opens"
                    :locale-data="{
                      direction: 'ltr',
                      format: 'mm/dd/yyyy',
                      separator: ' - ',
                      applyLabel: 'Simpan',
                      cancelLabel: 'Batal',
                      weekLabel: 'M',
                      customRangeLabel: 'Custom Range',
                      daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
                      monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                      firstDay: 0
                    }"
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
                    <template #ranges="ranges">
                      <div class="ranges">
                        <ul>
                          <li @click="ranges[0].clickRange(ranges[0].range)">
                            <b>Hari ini</b>
                          </li>
                          <li @click="ranges[0].clickRange(ranges[0].range)">
                            <b>7 hari terakhir</b>
                          </li>
                          <li @click="ranges[0].clickRange(ranges[0].range)">
                            <b>30 hari terakhir</b>
                          </li>
                          <li @click="ranges[0].clickRange(ranges[0].range)">
                            <b>Custom Tanggal</b>
                          </li>
                        <!-- <li
                              v-for="(range, name, index) in ranges.ranges"
                              :key="name"
                              @click="ranges.clickRange(range)"
                            >
                              <b v->{{ getLabelDateRange(index) }}</b>
                            </li> -->
                        </ul>
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
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        class="text-left"
                        value="accepted"
                        unchecked-value="not_accepted"
                      >
                        COD
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        class="text-left"
                        value="accepted"
                        unchecked-value="not_accepted"
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
                      id="checkbox-1"
                      v-model="status"
                      name="checkbox-1"
                      class="text-left"
                      value="accepted"
                      unchecked-value="not_accepted"
                    >
                      Order Dibuat
                    </b-form-checkbox>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        class="text-left"
                        name="checkbox-1"
                        value="accepted"
                        unchecked-value="not_accepted"
                      >
                        Dipacking
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        class="text-left"
                        value="accepted"
                        unchecked-value="not_accepted"
                      >
                        Dikirim
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        class="text-left"
                        value="accepted"
                        unchecked-value="not_accepted"
                      >
                        Diterima
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        class="text-left"
                        value="accepted"
                        unchecked-value="not_accepted"
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
                      id="checkbox-1"
                      v-model="status"
                      name="checkbox-1"
                      class="text-left"
                      value="accepted"
                      unchecked-value="not_accepted"
                    >
                      JNE
                    </b-form-checkbox>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        class="text-left"
                        name="checkbox-1"
                        value="accepted"
                        unchecked-value="not_accepted"
                      >
                        SiCepat
                      </b-form-checkbox>
                    </div>
                    <div class="my-1">
                      <b-form-checkbox
                        id="checkbox-1"
                        v-model="status"
                        name="checkbox-1"
                        class="text-left"
                        value="accepted"
                        unchecked-value="not_accepted"
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
  BCard, BTabs, BTab, BButton, BBadge, BCol, BRow, BContainer, BIconXCircle,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import DateRangePicker from 'vue2-daterange-picker'
import All from './List/All.vue'
import Created from './List/Created.vue'
import Packing from './List/Packing.vue'
import Send from './List/Send.vue'
import Received from './List/Received.vue'
import Retur from './List/Retur.vue'

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
    const startDate = new Date()
    const endDate = new Date()
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
      // ranges: [
      //   {
      //     name: 'Real Time',
      //   },
      //   {
      //     name: '7 hari terakhir',
      //   },
      //   {
      //     name: '30 hari terakhir',
      //   },
      //   {
      //     name: 'Custom Tanggal',
      //   },
      // ],
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
  padding: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-black {
  color: #000;
}
</style>
