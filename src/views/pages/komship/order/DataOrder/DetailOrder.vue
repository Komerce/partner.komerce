<template>
  <b-card>
    <div v-if="editMode === false">
      <b-row class="mb-4 px-1">
        <b-button
          variant="primary"
          class="rounded-lg"
          size="sm"
          to="/data-order"
        >
          <b-icon-chevron-left />
        </b-button>
      </b-row>
      <b-row class="justify-content-between">
        <div>
          <h3 class="font-bold mb-3 ml-1">
            Detail Order
          </h3>
        </div>
        <div class="mr-2">
          <b-button
            v-if="orderData.order_status === 'Diajukan'"
            variant="flat-primary"
            size="sm"
            class="my-auto text-primary font-bold mr-50"
            @click="cancelOrder"
          >
            Batal
          </b-button>
          <b-button
            v-if="orderData.order_status === 'Diajukan'"
            variant="primary"
            size="sm"
            class="btn-icon mr-50"
            @click="changeEditMode"
          >
            Edit
          </b-button>
          <b-button
            v-if="orderData.order_status === 'Dipacking'"
            variant="flat-primary"
            size="sm"
            class="btn-icon mr-50"
            @click="cancelPickup"
          >
            <b-spinner
              v-if="loadingCancelPickup"
              small
            />
            Batalkan
          </b-button>
        </div>
      </b-row>

      <b-overlay
        :show="loadingDetailOrder"
        spinner-variant="primary"
        variant="light"
        blur="0"
        opacity="0.3"
      >
        <b-container>
          <h4 class="font-bold mb-1">
            Informasi Order
          </h4>
          <div class="border px-2 pt-2">
            <b-row class="mb-1">
              <b-col cols="6">
                No Order
              </b-col>
              <b-col
                cols="6"
                class="font-bold"
              >
                {{ orderData.order_no }}
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="6">
                Tanggal Order
              </b-col>
              <b-col
                cols="6"
                class="font-bold"
              >
                {{ moment(orderData.order_date) }}
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="6">
                Gudang
              </b-col>
              <b-col
                v-if="orderData.address_partner && orderData.address_partner !== []"
                cols="6"
                class="font-bold"
              >
                {{ orderData.address_partner[0].name }}
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="6">
                Metode Pembayaran
              </b-col>
              <b-col
                cols="6"
                class="font-bold"
              >
                {{ orderData.payment_method }}
              </b-col>
            </b-row>
            <b-row class="mb-1 flex-wrap">
              <b-col cols="6">
                Status
              </b-col>
              <b-col
                cols="6"
                class="font-bold"
              >
                <b-alert
                  show
                  :variant="statusOrder"
                  class="px-1 w-36 text-center wrapper__status__order"
                  :style="orderData.order_status === 'Hilang' ? 'padding: 5px 0; background-color: #FCBEBE!important; color: #E31A1A!important' : 'padding: 5px 0;' "
                >
                  <span v-if="orderData.order_status === 'Diajukan'">Order Dibuat</span>
                  <span v-else>{{ orderData.order_status === 'Hilang' ? 'Paket Hilang' : orderData.order_status }}</span>
                </b-alert>
                <b-badge
                  show
                  :variant="statusOrderMobile"
                  class="wrapper__status__order__mobile"
                >
                  <span v-if="orderData.order_status === 'Diajukan'">Order Dibuat</span>
                  <span v-else>{{ orderData.order_status === 'Hilang' ? 'Paket Hilang' : orderData.order_status }}</span>
                </b-badge>
              </b-col>
            </b-row>
            <span class="d-flex mt-20">Telah ditambahkan oleh ‘{{ profile.user_fullname }}’ pada {{ postDate(orderData.order_date) }} WIB</span>
            <span
              v-if="editBy !== null || editDate !== null"
              class="d-flex mb-1"
            >Telah diedit oleh ‘{{ editBy }}’ pada {{ postDate(editDate) }} WIB</span>
          </div>
          <h4 class="font-bold mt-2 mb-1">
            Informasi Pengiriman
          </h4>
          <div class="border px-2 pt-2 pb-1">
            <b-row class="mb-1">
              <b-col
                cols="12"
                md="6"
                class="mb-1"
              >
                <div class="d-flex">
                  <img
                    src="@/assets/images/icons/profile-placehold.svg"
                  >
                  <div class="ml-1 my-auto">
                    <span class="font-bold">{{ orderData.customer_name }}</span><br>
                    <span v-if="orderData.customer_phone && `${orderData.customer_phone}`.charAt(0) !== '0'">
                      0{{ orderData.customer_phone }}
                    </span>
                    <span v-else>{{ orderData.customer_phone }}</span>
                  </div>
                </div>
              </b-col>
              <b-col>
                <span
                  v-if="profile.is_komship === 1"
                  class="d-flex my-auto justify-center sm:justify-end"
                >
                  Pengiriman via
                  <div>
                    <b-img
                      src="@/assets/images/logo/Komship.png"
                      style="margin-left:5px;"
                      alt="Komship"
                      fluid
                    />
                  </div>
                </span>
                <span v-else>
                  Pengiriman Non Komship
                </span>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="6"
                md="6"
              >
                Ekspedisi
              </b-col>
              <b-col
                class="font-bold d-flex"
              >
                <img
                  :src="orderData.shipment_image_path"
                  style="width: 45px"
                ><span
                  class="my-auto"
                  style="margin-left:5px"
                >{{ shippingTypeLabel(orderData.shipping_type) }}</span>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="6"
                md="6"
              >
                No Resi
              </b-col>
              <b-col
                class="font-bold d-flex"
              >
                {{ orderData.airway_bill }}
                <img
                  v-if="orderData.airway_bill"
                  src="@/assets/images/icons/copy.png"
                  class="copy-resi"
                  @click.prevent="copyResi(orderData.airway_bill)"
                >
                <span v-if="orderData.airway_bill === null">-</span>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col
                cols="6"
                md="6"
              >
                Detail Alamat
              </b-col>
              <b-col
                class="font-bold"
              >
                {{ orderData.customer_address }}
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col class="d-flex justify-content-end">
                <button
                  class="btn btn-outline-primary"
                  @click="lacakresi()"
                >
                  Lacak resi
                </button>
                <b-modal
                  id="bv-modal-cek-resi"
                  ref="bv-modal-cek-resi"
                  size="lg"
                  hide-header
                  hide-footer
                >
                  <div
                    class="d-flex justify-between"
                  >
                    <div class="d-flex">
                      <span
                        class="font-bold my-auto"
                        style="font-size: 20px;"
                      >Riwayat Perjalanan</span>
                      <img
                        :src="orderData.shipment_image_path"
                        style="height: 45px"
                      >
                    </div>
                    <img
                      src="@/assets/images/icons/close-circle.svg"
                      style="cursor:pointer"
                      @click="$bvModal.hide('bv-modal-cek-resi')"
                    >
                  </div>
                  <b-row class="my-8 overflow-auto h-50">
                    <div
                      v-if="itemAwb.length > 0"
                    >
                      <div
                        class="px-1"
                        style="max-height: 80vh;width: 100%;"
                        v-html="listAwb"
                      />
                    </div>
                    <b-col v-else>
                      <div
                        v-if="isLoading===false"
                        class="d-block mt-5 mb-5 align-content-center text-center"
                      >
                        Data riwayat perjalan tidak ditemukan. <b>Bisa jadi</b> sudah request pickup/dijemput kurir saat pickup namun <b>belum discan</b> QR code untuk memulai perjalanan di kantor cabang. Harap menunggu
                      </div>
                      <div
                        v-if="isLoading===true"
                        class="d-block mt-5 mb-5 align-content-center text-center"
                      >
                        <div
                          class="spinner-border text-primary"
                          role="status"
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </b-modal>
              </b-col>
            </b-row>
          </div>
          <h4 class="font-bold mt-2 mb-1">
            Informasi Penjualan
          </h4>
          <div class="border pb-2">
            <b-table
              responsive
              :fields="fieldOrder"
              :items="itemOrder"
            >
              <template #cell(no)="data">
                {{ data.index + 1 }}
              </template>

              <template #cell(product_name)="data">
                <h5 class="text-black">
                  <strong>
                    {{ data.item.product_name }}
                  </strong>
                </h5>
                <h4 class="text-primary">
                  <strong>
                    {{ data.item.variant_name }}
                  </strong>
                </h4>
              </template>
              <template #cell(price)="data">
                Rp {{ formatNumber(data.item.price) }}
              </template>
              <template #cell(subtotal)="data">
                Rp {{ formatNumber(data.item.price * data.item.qty) }}
              </template>
            </b-table>
            <hr>
            <b-row class="mt-3">
              <b-col
                lg="5"
                offset-lg="3"
              >
                Total Harga Produk
              </b-col>
              <b-col
                class="d-flex justify-start sm:justify-end"
                lg="3"
              >
                Rp {{ formatNumber(orderData.subtotal) }}
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col
                lg="5"
                offset-lg="3"
              >
                Ongkos Kirim ({{ orderData.total_weight }} Kg)
              </b-col>
              <b-col
                lg="3"
                class="d-flex justify-start sm:justify-end"
              >
                Rp {{ formatNumber(orderData.shipping_cost) }}
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col
                lg="5"
                offset-lg="3"
              >
                Potongan Harga
              </b-col>
              <b-col
                lg="3"
                class="d-flex justify-start sm:justify-end"
              >
                - Rp {{ formatNumber(orderData.discount) }}
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col
                lg="5"
                offset-lg="3"
              >
                Biaya Lain
              </b-col>
              <b-col
                lg="3"
                class="d-flex justify-start sm:justify-end"
              >
                Rp {{ formatNumber(orderData.additional_cost) }}
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col
                lg="8"
                offset-lg="3"
              >
                <hr><span />
              </b-col>
            </b-row>
            <b-row
              class="mt-1"
              :class="orderData.order_status === 'Retur' ? 'line-through' : ''"
            >
              <b-col
                lg="5"
                class="d-flex justify-end sm:justify-start font-bold text-xl"
                offset-lg="3"
              >
                Total Pembayaran ({{ orderData.payment_method }}) :
              </b-col>
              <b-col
                lg="3"
                class="d-flex justify-start sm:justify-end font-bold text-primary text-xl"
              >
                Rp {{ formatNumber(orderData.grandtotal) }}
              </b-col>
            </b-row>
            <b-row
              v-if="orderData.grandtotal !== orderData.old_grandtotal || orderData.is_mass_order === 1"
              class="mt-1"
            >
              <b-col
                lg="5"
                class="font-bold text-sm text-primary"
                offset-lg="3"
              >
                {{ orderData.notes }}
              </b-col>
            </b-row>
            <b-row class="mt-1">
              <b-col
                lg="7"
                offset-lg="3"
              >
                <hr><span />
              </b-col>
              <b-col
                lg="2"
                class="d-flex justify-start"
              >
                <b-button
                  v-b-toggle="'collapse-1'"
                  class="buttonCollapse px-0"
                  variant="none"
                  size="sm"
                >
                  <span class="when-open">Tutup <b-icon-chevron-up /></span>
                  <span class="when-closed">Buka <b-icon-chevron-down /></span>
                </b-button>
              </b-col>
            </b-row>
            <b-collapse id="collapse-1">
              <b-row class="mt-1">
                <b-col
                  lg="5"
                  offset-lg="3"
                >
                  Biaya {{ orderData.payment_method }} ({{ orderData.service_fee_to }}% sudah termasuk PPN)
                </b-col>
                <b-col
                  lg="3"
                  class="d-flex justify-start sm:justify-end"
                >
                  <span>- Rp {{ formatNumber(orderData.service_fee) }}</span>
                </b-col>
              </b-row>
              <b-row class="mt-1">
                <b-col
                  lg="5"
                  offset-lg="3"
                >
                  Ongkos Kirim (dipotong Cashback {{ orderData.cashback_to }}%)
                </b-col>
                <b-col
                  lg="3"
                  class="d-flex justify-start sm:justify-end"
                >
                  - Rp {{ formatNumber(orderData.shipping_cost - orderData.shipping_cashback) }}
                </b-col>
              </b-row>
              <b-row
                v-if="orderData.order_status === 'Retur'"
                class="mt-1"
              >
                <b-col
                  lg="5"
                  offset-lg="3"
                >
                  Ongkos Kirim Pengembalian (diskon {{ orderData.percentage_cost_retur }}%)
                </b-col>
                <b-col
                  lg="3"
                  class="d-flex justify-start sm:justify-end"
                >
                  - Rp {{ formatNumber(orderData.shipping_retur) }}
                </b-col>
              </b-row>
            </b-collapse>
            <b-row class="mt-1">
              <b-col
                lg="5"
                offset-lg="3"
                class="font-bold"
              >
                Penghasilan bersih yang kamu dapatkan
              </b-col>
              <b-col
                v-if="statusNetProfit === '-'"
                lg="3"
                class="d-flex justify-start sm:justify-end text-primary font-bold"
              >
                - Rp {{ formatNumber(orderData.net_profit) }}
              </b-col>
              <b-col
                v-else
                lg="3"
                class="d-flex justify-start sm:justify-end text-success font-bold"
              >
                Rp {{ formatNumber(orderData.net_profit) }}
              </b-col>
            </b-row>
          </div>
        </b-container>
      </b-overlay>

      <!-- Popup success cancel pickup -->
      <b-modal
        ref="popup-success-cancel-pickup"
        hide-footer
        hide-header
        no-close-on-backdrop
        no-close-on-esc
        centered
      >
        <b-row class="justify-content-center mb-2 pt-2">
          <b-img src="@/assets/images/icons/success.svg" />
        </b-row>

        <b-row class="justify-content-center">
          <h4 class="text-black text-center">
            <strong>
              Order Berhasil Dibatalkan
            </strong>
          </h4>
        </b-row>

        <b-row class="justify-content-center mb-1">
          <span class="text-black text-center">
            Order dan pengajuan pickup berhasil dibatalkan.
          </span>
        </b-row>

        <b-row class="justify-content-center pb-1">
          <b-button
            variant="primary"
            class="btn-icon"
            @click="fetchData"
          >
            Oke
          </b-button>
        </b-row>
      </b-modal>
    </div>

    <!-- Edit Order -->
    <edit-order
      v-if="editMode"
      :id-order="orderData.order_id"
      @changeValueEditMode="applyUpdateEditMode"
    />

  </b-card>
</template>
<script>
/* eslint-disable global-require */
import {
  BCard, BRow, BButton, BIconChevronLeft, BContainer, BCol, BAlert, VBModal, BTable, BCollapse, BBadge, BImg,
} from 'bootstrap-vue'
import moment from 'moment'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import EditOrder from '../EditOrder/EditOrder.vue'
import httpKomship2 from '../../setting-kompship/http_komship2'

export default {
  components: {
    BCard, BRow, BButton, BIconChevronLeft, BContainer, BCol, BAlert, BTable, BCollapse, EditOrder, BBadge, BImg,
  },
  directives: { VBModal },
  data() {
    return {
      profile: {},
      orderData: [],
      statusOrder: null,
      fieldOrder: [
        { key: 'no', label: 'No' },
        { key: 'product_name', label: 'Nama Produk' },
        { key: 'price', label: 'Harga Satuan' },
        { key: 'qty', label: 'Jumlah' },
        { key: 'subtotal', label: 'Sub Total' },
      ],
      itemOrder: [],
      itemAwb: [],
      isLoading: false,
      statusNetProfit: null,
      idEditOrder: 0,

      loadingDetailOrder: false,
      loadingCancelPickup: false,

      // Edit data order
      editMode: false,

      editBy: null,
      editDate: null,
      listAwb: '',
    }
  },
  async created() {
    const profile = await this.$http_komship.post('v1/my-profile')
    const dataProfile = await profile.data.data
    this.profile = await dataProfile
    this.fetchData()
  },
  mounted() {
    this.idEditOrder = this.$route.params.order_id
  },
  methods: {
    lacakresi() {
      this.isLoading = true
      const modal = new Promise((resolve, reject) => {
        this.$refs['bv-modal-cek-resi'].show()
        resolve(true)
      })

      modal.then(() => {
        this.getHistoryPackage()
      })
    },
    formatNumber: value => (`${value}`).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    moment(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const day = moment(date).format('DD')
        const month = moment(date).format('M')
        const year = moment(date).format('YYYY')
        return `${day} ${monthName[month - 1]} ${year}`
      }
      return ''
    },
    postDate(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        return moment(date).format('DD MMMM YYYY HH:mm')
      }
      return date
    },
    async fetchData() {
      try {
        this.loadingDetailOrder = true
        this.$refs['popup-success-cancel-pickup'].hide()
        const order = await httpKomship2.get(`v1/order/${this.profile.partner_id}/detail/${this.$route.params.order_id}`)
        const { data } = await order.data
        this.orderData = await data
        this.editBy = data.user_name_edited
        this.editDate = data.order_edited_date
        this.statusNetProfit = data.net_profit.toString().charAt(0)
        this.itemOrder = await data.product
        this.statusOrder = await this.setAlert(data.order_status)
        this.statusOrderMobile = await this.setAlertMobile(data.order_status)
        this.loadingDetailOrder = false
      } catch (err) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Failure',
            icon: 'AlertCircleIcon',
            text: err,
            variant: 'danger',
          },
        }, 2000)
        this.loadingDetailOrder = false
      }
    },
    async getHistoryPackage() {
      const body = {
        data: this.orderData.airway_bill,
      }
      await httpKomship2.post('v2/bulk-check-awb', body).then(res => {
        const { data } = res.data
        this.itemAwb = data.history
        this.isLoading = false
        this.getElementAwb()
      }).catch(err => {
        this.isLoading = false
      })
    },
    setAlertMobile(status) {
      if (status === 'Diajukan') {
        this.statusOrderMobile = 'light-primary'
      } else if (status === 'Dipacking') {
        this.statusOrderMobile = 'light-info'
      } else if (status === 'Dikirim') {
        this.statusOrderMobile = 'light-warning'
      } else if (status === 'Diterima') {
        this.statusOrderMobile = 'light-success'
      } else if (status === 'Retur') {
        this.statusOrderMobile = 'light-danger'
      } else if (status === 'Batal') {
        this.statusOrderMobile = 'light-dark'
      } else if (status === 'Hilang') {
        this.statusOrderMobile = 'light-danger'
      }
      return this.statusOrderMobile
    },
    setAlert(status) {
      if (status === 'Diajukan') {
        this.statusOrder = 'primary'
      } else if (status === 'Dipacking') {
        this.statusOrder = 'info'
      } else if (status === 'Dikirim') {
        this.statusOrder = 'warning'
      } else if (status === 'Diterima') {
        this.statusOrder = 'success'
      } else if (status === 'Retur') {
        this.statusOrder = 'danger'
      } else if (status === 'Batal') {
        this.statusOrder = 'dark'
      } else if (status === 'Hilang') {
        this.statusOrder = 'danger'
      }
      return this.statusOrder
    },
    cancelOrder() {
      // eslint-disable-next-line global-require
      const logoWarning = require('@/assets/images/icons/popup-warning.png')
      this.$swal.fire({
        title: 'Kamu yakin ingin<br>menghapus Order?',
        imageUrl: logoWarning,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        cancelButtonColor: '#FFFFFF',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-outline-primary text-primary',
      }).then(isConfirm => {
        if (isConfirm.value === true) {
          this.$http_komship.delete(`v1/order/${this.profile.partner_id}/delete/${this.$route.params.order_id}`)
            .then(() => {
              this.$router.push('/data-order')
            })
        }
      })
    },
    async copyResi(resi) {
      try {
        await navigator.clipboard.writeText(resi)
        const Toast = this.$swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          didOpen: toast => {
            toast.addEventListener('mouseenter', this.$swal.stopTimer)
            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
          },
        })

        Toast.fire({
          icon: 'success',
          title: '<span class="text-success">Success copy to clipboard</span>',
          showCloseButton: true,
        })
      // eslint-disable-next-line no-empty
      } catch ($e) {
      }
    },
    shippingTypeLabel(value) {
      if (value === 'REG19' || value === 'SIUNT' || value === 'STD' || value === 'IDlite' || value === 'CTC19') {
        return 'Reguler'
      } if (value === 'GOKIL') {
        return 'Cargo'
      }
      return value
    },
    cancelPickup() {
      this.loadingCancelPickup = true
      this.$http_komship.put(`/v2/order/${this.profile.partner_id}/cancel/${this.idEditOrder}`)
        .then(() => {
          this.loadingCancelPickup = false
          this.$refs['popup-success-cancel-pickup'].show()
        })
        .catch(err => {
          this.loadingCancelPickup = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Failure',
              icon: 'AlertCircleIcon',
              text: err,
              variant: 'danger',
            },
          }, 2000)
        })
    },

    // Edit Order
    changeEditMode() {
      this.editMode = true
    },
    applyUpdateEditMode() {
      this.editMode = false
    },
    getElementAwb() {
      const formatDate = date => {
        const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const day = moment(date).format('DD')
        const month = moment(date).format('M')
        const year = moment(date).format('YYYY')
        const time = moment(date).format('HH.mm')
        return `${day} ${monthName[month - 1]} ${year} - ${time}`
      }
      this.listAwb = ''
      this.itemAwb.forEach(items => {
        this.listAwb += '<div class="icon-awb d-inline-block">'
        if (items.status === 'Pickup') {
          this.listAwb += `<img src="${require('@/assets/images/icons/resi-pickup.svg')}">`
        } else if (items.status === 'Process') {
          this.listAwb += `<img src="${require('@/assets/images/icons/resi-kirim.svg')}">`
        } else if (items.status === 'Problem') {
          this.listAwb += `<img src="${require('@/assets/images/icons/resi-problem.svg')}">`
        } else if (items.status === 'Delivered') {
          this.listAwb += `<img src="${require('@/assets/images/icons/resi-terima.svg')}">`
        } else if (items.status === 'Retur') {
          this.listAwb += `<img src="${require('@/assets/images/icons/resi-retur.svg')}">`
        }
        this.listAwb += '</div>'
        this.listAwb += '<div style="font-size: 16px;display: inline-block;">'
        this.listAwb += `<span>${formatDate(items.date)}</span><br>`
        this.listAwb += `<span class="font-bold">${items.desc}</span>`
        this.listAwb += '</div><br>'
        if (items.send_wa === 1) {
          this.listAwb += '<div class="d-flex relative p-1" style="margin-left:50px;border:1px solid #E2E2E2;border-radius:4px;margin-bottom:-50px;max-width:400px">'
          this.listAwb += `<img src="${require('@/assets/images/icons/whatsapp-notif.svg')}">`
          this.listAwb += '<span class="my-auto" style="margin-left:6px">Pemberitahuan pemberangkatan telah terkirim ke WA Pelanggan</span>'
          this.listAwb += '</div>'
        }
      })
    },
  },
}
</script>
<style lang="css">
.copy-resi{
  margin-left: 3px;
  height: 20px;
  width: 20px;
  cursor: pointer;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
/* Steps */
.steps {
  position: relative;
  min-height: 1em;
  color: gray;
}
.steps + .steps {
  margin-top: 1.5em
}
.steps > div:first-child {
  position: static;
  height: 0;
}
.steps > div:not(:first-child) {
  margin-left: 1.5em;
  padding-left: 1em;
}
.steps.step-actives {
  color: #333333,
}
.steps.step-actives .circles {
  background-color: #f95031;
}

/* Circle */
.circles {
  background: gray;
  position: relative;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  border-radius: 100%;
  color: #fff;
  text-align: center;
  box-shadow: 0 0 0 3px #fff;
}

/* Vertical Line */
.circles:after {
  content: ' ';
  position: absolute;
  display: block;
  top: 1px;
  right: 50%;
  bottom: 1px;
  left: 50%;
  height: 100%;
  width: 1px;
  transform: scale(1, 2);
  transform-origin: 50% -100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: -1;
}
.steps:last-child .circles:after {
  display: none
}

/* Stepper Titles */
.titles {
  line-height: 1.5em;
  font-weight: 900 !important;
  color: #333333 !important;
}
.captions {
  font-size: 0.8em;
  color: #929292;
}

.wrapper__status__order__mobile {
  display: none!important;
}

@media only screen and (max-width: 576px) {
    [dir] .wrapper__status__order {
        display: none!important;
    }

    [dir] .wrapper__status__order__mobile {
        display: inline-block!important;
    }
}
.icon-awb {
    position: relative;
    width: 50px;
    line-height: 50px;
    text-align: center;
    margin-top: 50px;
    background-color: #fff;
    z-index: 2;
}
.icon-awb:first-child {
    margin-top: 0;
}
.icon-awb:before {
    position: absolute;
    border: 1px dashed #FBA63C;
    width: 0;
    height: 50px;
    display: block;
    content: '';
    left: 47%;
    z-index: 1;
    top: -54px;
    margin-left: -1px;
}
.icon-awb:first-child:before {
    display: none;
}
</style>
