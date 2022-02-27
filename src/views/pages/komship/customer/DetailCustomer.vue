<template>
  <b-overlay
    opacity=".5"
    blur="0"
    spinner-variant="primary"
    rounded="sm"
    variant="light"
    :show="loading"
  >
    <b-card>
      <h4><strong>Detail Customer</strong></h4>
      <b-row class="d-flex align-items-center justify-content-between mt-2">
        <b-col>
          <h5 class="ml-2">
            <strong>Informasi Customer</strong>
          </h5>
        </b-col>
        <b-col
          class="d-flex justify-content-end"
        >
          <b-button
            class="mr-2"
            variant="success"
            size="sm"
          >
            <b-img
              left
              class="mr-1"
              src="@core/assets/image/icon-wa.png"
              width="14"
              height="14"
            />
            <a
              class="text-white"
              :href="`https://api.whatsapp.com/send?phone=(+62) ${customerContact}` "
              target="blank"
            >
              <span class="align-middle">
                Hubungi Customer</span>
            </a>
          </b-button>
        </b-col>
      </b-row>

      <b-row class="mt-2 border ml-2 mr-2 pt-1 pb-1">
        <b-col
          md="7"
          class="d-flex align-items-center"
        >
          <div>
            <h5><strong>{{ customerName }}</strong></h5>
            <span>{{ formatphone (customerContact) }}</span>
          </div>
        </b-col>
        <b-col md="5">
          <span> {{ customerAddress }}</span>
        </b-col>
      </b-row>

      <b-col
        cols="12"
        class="mt-3"
      >
        <h5 class="ml-50">
          <strong>Laporan</strong>
        </h5>
      </b-col>

      <b-row class="border ml-2 mr-2 pt-1 pb-1">
        <b-col
          md="7"
        >
          <b-row>
            <b-col md="auto">
              <div class="mt-1">
                <strong>Terakhir Order</strong>
              </div>
              <div class="mt-1">
                <strong>Total Order</strong>
              </div>
              <div class="mt-1">
                <strong>Total Pcs</strong>
              </div>
            </b-col>
            <b-col>
              <div class="mt-1">
                {{ lastOrder }}
              </div>
              <div class="mt-1">
                {{ totalOrder }}
              </div>
              <div class="mt-1">
                {{ totalPcs }}
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="5">
          <b-row>
            <b-col md="auto">
              <div class="mt-1">
                <strong>Produk Favorit</strong>
              </div>
              <div class="mt-1">
                <strong>Uang Dihabiskan</strong>
              </div>
              <div class="mt-1">
                <strong>
                  Rata - rata Belanja</strong>
                <b-icon-info-circle
                  v-b-popover.hover.top="'Jumlah rata-rata ketika berbelanja'"
                  class="ml-1 "
                />
              </div>

            </b-col>
            <b-col>
              <div class="mt-1">
                {{ productFavorit }}
              </div>
              <div class="mt-1">
                Rp {{ formatPrice(totalSpent) }}
              </div>
              <div class="mt-1">
                Rp {{ formatPrice(averageSpent) }}
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-col
        cols="12"
        class="mt-3"
      >
        <h5 class="ml-50">
          <strong>Riwayat Order</strong>
        </h5>
      </b-col>

      <b-container fluid>
        <b-row class="mt-3">
          <b-col
            cols="2"
            class="pl-0 pr-0"
          >
            <span class="ml-2">
              <strong>
                Tanggal Order
              </strong>
            </span>
          </b-col>
          <b-col
            cols="2"
            class=""
          >
            <span>
              <strong>
                Pelanggan
              </strong>
            </span>
          </b-col>
          <b-col
            cols="3"
            class=""
          >
            <span>
              <strong>
                Produk
              </strong>
            </span>
          </b-col>
          <b-col
            cols="2"
            class=""
          >
            <span>
              <strong>
                Total Pembayaran
              </strong>
            </span>
          </b-col>
          <b-col
            cols="1"
            class="text-center"
          >
            <span class="text-center">
              <strong>
                Status
              </strong>
            </span>
          </b-col>
          <b-col
            cols="2"
            class="text-center"
          >
            <span>
              <strong>
                Rincian
              </strong>
            </span>
          </b-col>
        </b-row>
        <b-col
          class="p-0 m-0"
          cols="12"
        >
          <hr style="height:1px; background-color:#828282; color: #828282; opacity: 0.5;">
        </b-col>

        <div
          v-for="(items, index) in itemsDetailCustomer"
          :key="index+1"
        >
          <b-row class="mb-2">
            <b-col
              cols="2"
              class="p-0"
            >
              <span class="ml-2">
                {{ items.order_date }}
              </span>
            </b-col>
            <b-col
              cols="2"
              class="p-0"
            >
              <span class="ml-1">
                {{ infoCustomer.customer_name }}
              </span>
            </b-col>
            <b-col
              cols="3"
              class="p-0"
            >
              <div
                v-for="(detailOrder, indexDetail) in items.all_order_detail.slice(0, 3)"
                :key="indexDetail+1"
              >
                <b-container
                  fluid
                  class="d-flex mb-50"
                >
                  <div v-if="detailOrder.product.product_image[0] !== undefined">
                    <b-avatar
                      variant="light-primary"
                      square
                      size="50px"
                      :src="detailOrder.product.product_image[0].images_path"
                    />
                  </div>
                  <div v-else>
                    <b-avatar
                      variant="light-primary"
                      square
                      size="50px"
                    />
                  </div>
                  <div class="ml-1">
                    <b-row>
                      <b-col>
                        <small><strong>{{ detailOrder.product_name }}</strong></small>
                      </b-col>
                      <b-col>
                        <small>
                          <strong>
                            x{{ detailOrder.qty }}
                          </strong>
                        </small>
                      </b-col>
                    </b-row>
                    <p>
                      <strong class="text-primary">
                        {{ detailOrder.product_variant_name }}
                      </strong>
                    </p>
                  </div>
                </b-container>
              </div>
            </b-col>
            <b-col
              cols="2"
              class="p-0"
            >
              <span class="ml-1">
                Rp {{ formatPrice(items.grand_total) }}
              </span>
              <p class="text-primary ml-1 mt-50">
                <strong>
                  {{ items.payment_method }}
                </strong>
              </p>
            </b-col>
            <b-col
              cols="1"
              class="p-0 text-center"
            >
              {{ items.order_status }}
            </b-col>
            <b-col
              cols="2"
              class="p-0 text-center"
            >
              <b-button
                size="sm"
                variant="flat-info"
                tag="router-link"
                :to="{ name: $route.meta.routeDetailOrder, params: { order_id: items.id } }"
              >
                Lihat Detail
              </b-button>
            </b-col>
          </b-row>

          <!-- <b-row
            v-if="items.all_order_detail.length > 1"
            class="d-flex justify-content-end mb-2"
          >
            <b-col
              cols="auto"
            >
              <b-button
                v-b-toggle="`collapse-${String(index)}`"
                variant="flat-dark"
                size="sm"
              >
                Tampilkan Variasi Lainnya
                <feather-icon
                  icon="ChevronDownIcon"
                />
              </b-button>
            </b-col>
            <b-col cols="12">
              <b-collapse
                :id="`collapse-${String(index)}`"
              >
                <b-row>
                  <b-col cols="2" />
                  <b-col cols="2" />
                  <b-col
                    cols="3"
                    class="p-0"
                  >
                    <div
                      v-for="(detailOrder, indexDetail) in items.all_order_detail.slice(1, items.all_order_detail.length)"
                      :key="indexDetail+1"
                    >
                      <b-container
                        fluid
                        class="d-flex mb-50"
                      >
                        <div>
                          <b-avatar
                            variant="light-primary"
                            square
                            size="50px"
                          />
                        </div>
                        <div class="ml-1">
                          <small><strong>{{ detailOrder.product_name }}</strong></small>
                          <p>
                            <strong class="text-primary">
                              {{ detailOrder.product_variant_name }}
                            </strong>
                          </p>
                        </div>
                      </b-container>
                    </div>
                  </b-col>
                  <b-col cols="2" />
                  <b-col cols="1" />
                  <b-col cols="2" />
                </b-row>
              </b-collapse>
            </b-col>
          </b-row> -->

        </div>
      </b-container>
    </b-card>
  </b-overlay>
</template>

<script>
import {
  BRow,
  BButton,
  BCol,
  BImg,
  BAvatar,
  BOverlay,
  BIconInfoCircle,
  BCard,
  BContainer,
  BCollapse,
  VBToggle,
  VBPopover,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import Ripple from 'vue-ripple-directive'
import httpKomship from '../setting-kompship/http_komship'

export default {
  components: {
    BCard,
    BRow,
    BButton,
    BCol,
    BImg,
    BAvatar,
    BIconInfoCircle,
    BOverlay,
    BContainer,
    // BCollapse,
  },
  directives: {
    'b-toggle': VBToggle,
    'b-popover': VBPopover,
    Ripple,
  },
  data() {
    return {
      loading: false,
      customerId: this.$route.params.customer_id,
      orderId: this.$route.params.orderId,
      // Information Customer
      customerName: '',
      customerContact: '',
      customerAddress: '',

      // Report
      lastOrder: '',
      totalOrder: null,
      totalPcs: '',
      productFavorit: '',
      totalSpent: '',
      averageSpent: '',

      fields: [
        {
          key: 'order_date',
          label: 'Tanggal Order',
        },
        {
          key: 'pelanggan',
          label: 'Pelanggan',
        },
        {
          key: 'all_order_detail',
          label: 'Produk',
        },
        {
          key: 'grand_total',
          label: 'Total Pembayaran',
        },
        {
          key: 'order_status',
          label: 'Status',
        },
        {
          key: 'rincian',
          label: 'Rincian',
        },
      ],

      itemsDetailCustomer: [],
      infoCustomer: [],
    }
  },
  mounted() {
    this.getCustomerDetail()
  },
  methods: {
    getCustomerDetail() {
      this.loading = true
      httpKomship.get(`/v1/customers/${this.customerId}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data

        // Information Customer
        this.customerName = data.customer_name
        this.customerContact = data.customer_phone
        this.customerAddress = data.customer_address
        this.itemsDetailCustomer = data.customer_orders
        this.infoCustomer = data

        // report
        this.lastOrder = data.customer_report.last_order
        this.totalOrder = data.customer_report.total_order
        this.totalPcs = data.customer_report.total_pcs
        this.productFavorit = data.customer_report.customer_product_favorit
        this.totalSpent = data.customer_report.total_spent
        this.averageSpent = data.customer_report.average_spent

        this.loading = false

        // Result date

        return this.itemsDetailCustomer
      })
    },
    formatphone(nomor) {
      if (nomor !== null) {
        // eslint-disable-next-line no-param-reassign
        nomor = nomor.substring(1)
      }
      return `(+62)${nomor}`
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },

  },

}

</script>

<style>

</style>
