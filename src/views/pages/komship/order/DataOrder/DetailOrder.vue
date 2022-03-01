<template>
  <b-card>
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
    <div class="d-flex justify-between">
      <h3 class="font-bold mb-3">
        Detail Order
      </h3>
      <b-button
        v-if="orderData.order_status === 'Diajukan'"
        variant="default"
        size="sm"
        class="my-auto text-primary font-bold"
        @click="cancelOrder"
      >
        Batal
      </b-button>
    </div>
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
            Metode Pembayaran
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ orderData.payment_method }}
          </b-col>
        </b-row>
        <b-row class="mb-1">
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
              class="px-1 w-36 text-center"
              style="padding: 5px 0;"
            >
              {{ orderData.order_status }}
            </b-alert>
          </b-col>
        </b-row>
        <span class="d-flex mt-20 mb-1">Telah ditambahkan oleh ‘{{ profile.user_fullname }}’ pada {{ postDate(orderData.order_date) }} WIB</span>
      </div>
      <h4 class="font-bold mt-2 mb-1">
        Informasi Pengiriman
      </h4>
      <div class="border px-2 pt-2 pb-1">
        <b-row class="mb-1">
          <b-col cols="6">
            <div class="d-flex">
              <img
                src="@/assets/images/icons/profile-placehold.svg"
              >
              <div class="ml-1 my-auto">
                <span class="font-bold">{{ orderData.customer_name }}</span><br>
                <span>{{ orderData.customer_phone }}</span>
              </div>
            </div>
          </b-col>
          <b-col cols="6">
            <span
              v-if="profile.is_komship === 1"
              class="d-flex my-auto justify-end"
            >
              Pengiriman via <img
                src="@/assets/images/logo/Komship.png"
                style="margin-left:5px;"
                alt="Komship"
              >
            </span>
            <span v-else>
              Pengiriman Non Komship
            </span>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            Ekspedisi
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ `${orderData.shipping} (${nameTypeShipping(orderData.shipping_type)})` }}
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="6">
            No Resi
          </b-col>
          <b-col
            cols="6"
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
          <b-col cols="6">
            Detail Alamat
          </b-col>
          <b-col
            cols="6"
            class="font-bold"
          >
            {{ orderData.customer_address }}
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col class="d-flex justify-content-end">
            <button
              class="btn btn-outline-primary"
              @click="$bvModal.show('bv-modal-cek-resi')"
            >
              Lacak resi
            </button>
            <b-modal
              id="bv-modal-cek-resi"
              hide-footer
            >
              <template #modal-title>
                <div class="d-flex flex-row justify-content-between">
                  <div class="font-weight-bold bold">
                    Riwayat Perjalanan
                  </div>
                </div>
              </template>
              <b-row class="my-8 overflow-auto h-50">
                <b-col>
                  <div
                    class="d-block"
                  >
                    <div
                      v-for="item in itemAwb"
                      :key="item.code"
                      class="steps step-actives"
                    >
                      <div>
                        <div class="circles" />
                      </div>
                      <div>
                        <div class="titles font-weight-bold bold">
                          {{ item.desc }}
                        </div>
                        <div class="captions">
                          {{ item.date }}
                        </div>
                      </div>
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
          <b-col lg="3" />
          <b-col
            lg="5"
          >
            Total Harga Produk
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp {{ formatNumber(orderData.subtotal) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col lg="3" />
          <b-col
            lg="5"
          >
            Ongkos Kirim
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp {{ formatNumber(orderData.shipping_cost) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col lg="3" />
          <b-col
            lg="5"
          >
            Potongan Harga
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            - Rp {{ formatNumber(orderData.discount) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col lg="3" />
          <b-col
            lg="5"
          >
            Biaya Lain
          </b-col>
          <b-col
            lg="3"
            class="text-right"
          >
            Rp {{ formatNumber(orderData.additional_cost) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col lg="3" />
          <b-col lg="8">
            <hr><span />
          </b-col>
        </b-row>
        <b-row
          class="mt-1"
          :class="orderData.order_status === 'Retur' ? 'line-through' : ''"
        >
          <b-col lg="3" />
          <b-col
            lg="5"
            class="font-bold text-xl"
          >
            Total Pembayaran ({{ orderData.payment_method }}) :
          </b-col>
          <b-col
            lg="3"
            class="text-right font-bold text-primary text-xl"
          >
            Rp {{ formatNumber(orderData.grandtotal) }}
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col lg="3" />
          <b-col lg="7">
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
        <b-collapse
          id="collapse-1"
          visible
        >
          <b-row class="mt-1">
            <b-col lg="3" />
            <b-col
              lg="5"
            >
              Biaya {{ orderData.payment_method }} ({{ orderData.service_fee_to }}% sudah termasuk PPN)
            </b-col>
            <b-col
              lg="3"
              class="text-right"
            >
              <span>Rp {{ formatNumber(orderData.service_fee) }}</span>
            </b-col>
          </b-row>
          <b-row class="mt-1">
            <b-col lg="3" />
            <b-col
              lg="5"
            >
              Ongkos Kirim (dipotong Cashback {{ orderData.cashback_to }}%)
            </b-col>
            <b-col
              lg="3"
              class="text-right"
            >
              Rp {{ formatNumber(orderData.shipping_cost - orderData.shipping_cashback) }}
            </b-col>
          </b-row>
          <b-row
            v-if="orderData.order_status === 'Retur'"
            class="mt-1"
          >
            <b-col lg="3" />
            <b-col
              lg="5"
            >
              Ongkos Kirim Pengembalian (diskon {{ orderData.percentage_cost_retur }}%)
            </b-col>
            <b-col
              lg="3"
              class="text-right"
            >
              Rp {{ formatNumber(orderData.shipping_retur) }}
            </b-col>
          </b-row>
          <b-row class="mt-1">
            <b-col lg="3" />
            <b-col
              lg="5"
              class="text-primary font-bold"
            >
              Penghasilan bersih yang kamu dapatkan
            </b-col>
            <b-col
              lg="3"
              class="text-right text-primary font-bold"
            >
              Rp {{ formatNumber(orderData.net_profit) }}
            </b-col>
          </b-row>
        </b-collapse>
      </div>
    </b-container>
  </b-card>
</template>
<script>
import {
  BCard, BRow, BButton, BIconChevronLeft, BContainer, BCol, BAlert, VBModal, BTable, BCollapse,
} from 'bootstrap-vue'
import moment from 'moment'

export default {
  components: {
    BCard, BRow, BButton, BIconChevronLeft, BContainer, BCol, BAlert, BTable, BCollapse,
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
    }
  },
  async created() {
    const profile = await this.$http_komship.post('v1/my-profile')
    const dataProfile = await profile.data.data
    this.profile = await dataProfile
    this.fetchData()
  },
  methods: {
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
        return moment(date).format('DD MMMM YYYY HH:MM')
      }
      return date
    },
    async fetchData() {
      const order = await this.$http_komship.get(`v1/order/${this.profile.partner_id}/detail/${this.$route.params.order_id}`)
      const { data } = await order.data
      this.orderData = await data
      this.itemOrder = await data.product
      this.statusOrder = await this.setAlert(data.order_status)
      this.getHistoryPackage(data.airway_bill)
    },
    getHistoryPackage(awb) {
      const body = {
        data: awb,
      }
      this.$http_komship.post('v1/bulk-check-awb', body).then(res => {
        this.itemAwb = res.data.data[0].history
      })
    },
    setAlert(status) {
      if (status === 'Diajukan') {
        this.statusOrder = 'warning'
      } else if (status === 'Dikirim') {
        this.statusOrder = 'primary'
      } else if (status === 'Diterima') {
        this.statusOrder = 'success'
      } else if (status === 'Retur') {
        this.statusOrder = 'danger'
      } else if (status === 'Batal') {
        this.statusOrder = 'secondary'
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
    nameTypeShipping(data) {
      if (data === 'OKE19') {
        return 'OKE'
      } if (data === 'REG19') {
        return 'REG'
      } if (data === 'YES19') {
        return 'YES'
      } if (data === 'CTCOKE19') {
        return 'OKE'
      } if (data === 'CTCYES19') {
        return 'YES'
      } if (data === 'CTC19') {
        return 'REG'
      }
      return ''
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

</style>
