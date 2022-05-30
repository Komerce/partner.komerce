<template>
  <div>
    <b-row class="mb-1">
      <b-col
        lg="7"
        md="6"
      />
      <b-col
        md="4"
      >
        <b-form-input
          v-model="formSearch"
          type="search"
          class="form-search"
          placeholder="Masukkan Nama Pelanggan"
          @input="fetchData(formSearch)"
        />
        <b-icon-search class="icon-search" />
      </b-col>
      <b-col
        lg="1"
        sm="2"
      >
        <b-button
          id="buttonFilter"
          variant="primary"
          size="sm"
          class="rounded-lg"
        >
          <img
            src="@/assets/images/icons/filter-icon-kompship.png"
          >
        </b-button>
        <b-popover
          id="popoverFilter"
          target="buttonFilter"
          triggers="click"
          placement="bottomleft"
        >
          <label>Tanggal</label>
          <b-row>
            <b-col md="6">
              <flat-pickr
                v-model="startDate"
                class="form-control"
                placeholder="Start Date"
                :config="{ mode: 'single', altInput: true, altFormat: 'j/n/Y', dateFormat: 'Y-m-d',}"
              />
            </b-col>
            <b-col md="6">
              <flat-pickr
                v-model="endDate"
                class="form-control"
                placeholder="End Date"
                :config="{ mode: 'single', altInput: true, altFormat: 'j/n/Y', dateFormat: 'Y-m-d', minDate: startDate}"
              />
            </b-col>
          </b-row>
          <label class="mt-1">Produk</label>
          <v-select
            v-model="productName"
            :options="productList"
            :reduce="(option) => option.product_name"
            label="product_name"
          >
            <span
              slot="no-options"
              @click="$refs.select.open = false"
            />
          </v-select>
          <label class="mt-1">Metode Pembayaran</label>
          <v-select
            v-model="paymentMethod"
            :options="['COD', 'BANK TRANSFER']"
          />
          <b-row class="mx-auto mt-2">
            <b-button
              variant="outline-primary"
              class="mr-1"
              @click.prevent="resetFilter()"
            >
              Reset
            </b-button>
            <b-button
              variant="primary"
              @click.prevent="fetchData()"
            >
              Terapkan
            </b-button>
          </b-row>
        </b-popover>
      </b-col>
    </b-row>
    <b-overlay
      variant="light"
      :show="loadTable"
      spinner-variant="primary"
      blur="0"
      opacity=".5"
      rounded="sm"
    >
      <b-table
        id="table-order"
        responsive
        show-empty
        empty-text="Tidak ada data untuk ditampilkan."
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="0"
        :busy="loadTable"
      >
        <template #cell(order_date)="data">
          {{ moment(data.item.order_date) }}
        </template>
        <template #cell(customer_name)="data">
          <span class="font-bold">{{ data.item.customer_name }}</span><br>
          <div
            v-if="data.item.is_komship"
            class="d-flex"
          >
            <img
              :src="data.item.shipment_image_path"
              style="width:45px"
            ><span class="my-auto">{{ shippingTypeLabel(data.item.shipping_type) }}</span>
          </div>
          <span
            v-else
            class="text-muted"
          >
            Non-Komship
          </span>
        </template>
        <template #cell(product)="data">
          <div v-if="data.item.product[0]">
            <div class="d-flex">
              <div v-if="data.item.product[0].product_image === null">
                <img
                  style="width:50px;height:50px;"
                  :src="require('@/assets/images/avatars/image-null.png')"
                >
              </div>
              <div v-else>
                <img
                  style="width:50px;height:50px;"
                  :src="data.item.product[0].product_image"
                  :alt="data.item.product[0].product_image"
                >
              </div>
              <div
                class="ml-1"
                style="width:70%;"
              >
                <span class="font-bold">{{ data.item.product[0].product_name }}</span><br>
                <span
                  v-if="data.item.product[0].variant_name !== '0'"
                  class="text-primary"
                >{{ data.item.product[0].variant_name }}</span>
              </div>
              <div
                class="ml-1 font-bold"
                style="10%"
              >
                x{{ data.item.product[0].qty }}
              </div>
            </div>
            <div v-if="data.item.product.length > 1">
              <b-collapse :id="'collapse-'+data.item.order_id">
                <div
                  v-for="item in data.item.product.slice(1)"
                  :key="item.order_id"
                  class="d-flex mt-1"
                >
                  <div v-if="item.product_image === null">
                    <img
                      style="width:50px;height:50px;"
                      :src="require('@/assets/images/avatars/image-null.png')"
                    >
                  </div>
                  <div v-else>
                    <img
                      style="width:50px;height:50px;"
                      :src="item.product_image"
                      :alt="item.product_image"
                    >
                  </div>
                  <div
                    class="ml-1"
                    style="width:70%;"
                  >
                    <span class="font-bold">{{ item.product_name }}</span><br>
                    <span class="text-primary">{{ item.variant_name }}</span>
                  </div>
                  <div
                    class="ml-1 font-bold"
                    style="10%"
                  >
                    x{{ item.qty }}
                  </div>
                </div>
              </b-collapse>
            </div>
          </div>
        </template>
        <template #cell(grand_total)="data">
          Rp {{ formatNumber(data.item.grand_total) }}<br>
          <span
            v-if="data.item.payment_method === 'COD'"
            class="text-primary"
          >
            COD
          </span>
          <div
            v-else-if="data.item.payment_method === 'BANK TRANSFER'"
            class="d-flex"
          >
            <span class="text-primary">Transfer</span>
            <img
              v-if="data.item.bank !== '0'"
              :id="`iconInfo` + data.item.order_id"
              src="@/assets/images/icons/info-circle.svg"
              class="icon-info"
            >
            <b-popover
              triggers="hover"
              :target="`iconInfo` + data.item.order_id"
              placement="bottomleft"
            >
              <label>Nama Bank:</label><br>
              <span class="font-bold">{{ data.item.bank }}</span><br>
              <label>No Rekening:</label><br>
              <span class="font-bold">{{ data.item.bank_account_no }}</span><br>
              <label>Pemilik Rekening:</label><br>
              <span class="font-bold">{{ data.item.bank_account_name }}</span><br>
            </b-popover>
          </div>
        </template>
        <template #cell(order_status)="data">
          <span v-if="data.item.order_status === 'Diajukan'">Order Dibuat</span>
          <span v-else>{{ data.item.order_status }}</span>
        </template>
        <template #cell(details)="data">
          <b-button
            variant="none"
            class="button-detail d-flex"
            :to="{ name: $route.meta.routeDetail, params: { order_id: data.item.order_id } }"
          >
            Lihat Detail
          </b-button>
          <div
            v-if="data.item.product.length > 1"
          >
            <b-button
              v-b-toggle="'collapse-'+data.item.order_id"
              class="buttonCollapse px-0 text-right relative"
              variant="none"
              size="sm"
            >
              <span class="when-open">Tutup <b-icon-chevron-up /></span>
              <span class="when-closed">{{ data.item.product.length - 1 }} Produk lainnya <b-icon-chevron-down /></span>
            </b-button>
          </div>
        </template>
      </b-table>
      <div class="d-flex justify-between align-middle">
        <div>
          <span class="mr-1">List per halaman</span>
          <b-button
            v-for="page in pageOptions"
            :key="page"
            :variant="page === perPage ? 'primary' : 'light'"
            size="sm"
            class="btnPage"
            @click="setPage(page)"
          >
            {{ page }}
          </b-button>
        </div>
        <b-pagination
          v-model="currentPage"
          size="md"
          class="float-right mr-2"
          :total-rows="totalItems"
          :per-page="perPage"
          first-number
          last-number
        />
      </div>
    </b-overlay>
  </div>
</template>
<script>
import {
  BTable, BRow, BCol, BPagination, BFormInput, BIconSearch, BButton, BPopover, BCollapse, VBToggle, BIconChevronUp, BIconChevronDown, BOverlay,
} from 'bootstrap-vue'
import moment from 'moment'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import flatPickr from 'vue-flatpickr-component'
import '@/@core/scss/vue/libs/vue-flatpicker.scss'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BTable, BRow, BCol, BPagination, BFormInput, BIconSearch, BButton, BPopover, vSelect, BCollapse, BIconChevronUp, BIconChevronDown, flatPickr, BOverlay,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      profile: JSON.parse(localStorage.userData),
      items: [],
      fields: [
        {
          key: 'order_date', label: 'Tanggal Order', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'customer_name', label: 'Pelanggan', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'product', label: 'Produk', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'grand_total', label: 'Total Pembayaran', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'order_status', label: 'Status', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'details', label: 'Rincian', thClass: 'align-middle', tdClass: 'align-top',
        },
      ],
      loadTable: false,
      formSearch: null,
      paymentMethod: [],
      productList: [],
      productName: [],
      startDate: '',
      endDate: '',
      currentPage: 1,
      perPage: 50,
      pageOptions: [50, 100, 200],
      totalItems: 0,
    }
  },
  watch: {
    currentPage: {
      handler() {
        this.fetchData().catch(error => {
          console.error(error)
        })
      },
    },
  },
  mounted() {
    this.fetchData()
  },
  created() {
    window.addEventListener('click', async e => {
      if (document.getElementById('popoverFilter') !== null) {
        if (!document.getElementById('popoverFilter').contains(e.target)) {
          this.$root.$emit('bv::hide::popover')
        } else {
          e.stopPropagation()
        }
      }
    })
  },
  methods: {
    formatNumber: value => (`${value}`).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    moment(date) {
      const validDate = moment(date)
      if (validDate.isValid()) {
        return moment(date).format('DD-MM-YYYY HH:mm')
      }
      return date
    },
    fetchData(search) {
      this.loadTable = true
      this.$http_komship.get(`v1/order/${this.profile.partner_detail.id}`, {
        params: {
          customer_name: search,
          product_name: this.productName,
          payment_method: this.paymentMethod,
          start_date: this.startDate,
          end_date: this.endDate,
          page: this.currentPage,
          total_per_page: this.perPage,
        },
      })
        .then(res => {
          const { data } = res.data.data
          this.totalItems = res.data.data.total
          this.loadTable = false
          this.items = data
          this.getProduct()
          this.loadTable = false
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
          this.loadTable = false
        })
    },
    resetFilter() {
      this.startDate = null
      this.endDate = null
      this.productName = null
      this.paymentMethod = null
      this.fetchData()
    },
    getProduct() {
      this.$http_komship.get(`v1/partner-product/${this.profile.partner_detail.id}`)
        .then(response => {
          const { data } = response.data
          this.productList = data
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
    shippingTypeLabel(value) {
      if (value === 'REG19' || value === 'SIUNT' || value === 'STD' || value === 'IDlite' || value === 'CTC19') {
        return 'Reguler'
      } if (value === 'GOKIL') {
        return 'Cargo'
      }
      return value
    },
    setPage(totalPage) {
      this.perPage = totalPage
      this.fetchData()
    },
  },
}
</script>
<style>
.icon-search{
  position: absolute;
  height: 20px;
  width: 20px;
  top: 12px;
  left: 26px;
}
.form-search {
  padding-left: 40px;
  height: 45px;
  border-radius: 12px;
}
.button-detail {
  font-size: 14px;
  color: #08A0F7!important;
}
.button-detail:hover {
  color: #c3c3c3!important;
}
.icon-info {
  width: 20px;
  height: 20px;
  margin-left: 3px;
  cursor: pointer;
}
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
.buttonCollapse {
  margin-left: -50px;
  width:130px;
}
.btnPage {
  padding: 4px 7px;
  margin-right: 5px;
}
</style>
