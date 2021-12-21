<template>
  <b-overlay
    :show="loading"
    spinner-variant="primary"
    variant="light"
    opacity=".5"
    blur="0"
  >
    <b-card>
      <h4><strong>Detail Order</strong></h4>
      <b-col
        class="mt-2"
        cols="12"
      >
        <h5 class="ml-4">
          <strong>Informasi Order</strong>
        </h5>
      </b-col>

      <b-overlay
        :show="loading"
        spinner-variant="primary"
        variant="light"
        opacity=".5"
        blur="0"
        rounded="sm"
      >
        <b-row class="border ml-5 mr-5 mt-1 pb-2 pt-1">
          <b-col md="6">
            <b-list-group class="ml-1">
              <b-list-group-item class="border-0">
                Nomer Order
              </b-list-group-item>
              <b-list-group-item class="border-0">
                Tanggal Order
              </b-list-group-item>
              <b-list-group-item class="border-0">
                Metode Pembayaran
              </b-list-group-item>
              <b-list-group-item class="border-0">
                Status
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col
            md="6"
          >
            <b-list-group class="ml-1">
              <b-list-group-item class="border-0">
                <strong>{{ orderNomor }}</strong>
              </b-list-group-item>
              <b-list-group-item class="border-0">
                <strong>{{ orderDate }}</strong>
              </b-list-group-item>
              <b-list-group-item class="border-0">
                <strong>{{ metodePembayaran }}</strong>
              </b-list-group-item>
              <b-list-group-item class="border-0">
                <div v-if="orderStatus === 'Diajukan'">
                  <b-badge
                    variant="light-warning"
                  >
                    {{ orderStatus }}
                  </b-badge>
                </div>
                <div v-if="orderStatus === 'Dikirim'">
                  <b-badge
                    variant="light-info"
                  >
                    {{ orderStatus }}
                  </b-badge>
                </div>
                <div v-if="orderStatus === 'Diterima'">
                  <b-badge
                    variant="light-success"
                  >
                    {{ orderStatus }}
                  </b-badge>
                </div>
                <div v-if="orderStatus === 'Batal'">
                  <b-badge
                    variant="light-primary"
                  >
                    {{ orderStatus }}
                  </b-badge>
                </div>
                <div v-if="orderStatus === 'Retur'">
                  <b-badge
                    variant="light-primary"
                  >
                    {{ orderStatus }}
                  </b-badge>
                </div>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-row class="ml-3 mt-5">
            Telah ditambahkan oleh ‘{{ nameUser }}’ pada 13 Agustus 2021 16:00 WIB
          </b-row>
        </b-row>
      </b-overlay>

      <b-col
        cols="12"
        class="mt-3"
      >
        <h5 class="ml-4">
          <strong>Informasi Pengiriman</strong>
        </h5>
      </b-col>

      <b-row class="border ml-5 mr-5 mt-1 pb-2 pt-1">
        <b-col md="6">
          <b-list-group>
            <b-list-group-item class="border-0 mb-2">
              <b-col
                class="d-flex align-items-center"
              >
                <b-avatar
                  class="mr-50"
                />
                <div>
                  <h5><strong>{{ customerOrderName }}</strong></h5>
                  <span>{{ customerOrderPhone }}</span>
                </div>
              </b-col>
            </b-list-group-item>
            <b-list-group-item class="border-0 ml-1">
              Ekspedisi
            </b-list-group-item>
            <b-list-group-item class="border-0 ml-1">
              No Resi
            </b-list-group-item>
            <b-list-group-item class="border-0 ml-1">
              Detail Alamat
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col
          md="6"
        >
          <b-list-group class="ml-1 mt-2">
            <b-list-group-item class="border-0 mb-2">
              <h5 class="text-danger">
                <strong>Pengiriman Komship</strong>
              </h5>
            </b-list-group-item>
            <b-list-group-item class="border-0">
              <h5><strong>{{ ekspedisi }}</strong></h5>
            </b-list-group-item>
            <b-list-group-item class="border-0">
              <h5><strong>{{ nomorResi }}</strong></h5>
            </b-list-group-item>
            <b-list-group-item class="border-0">
              <h5><strong>{{ customerOrderAddress }}</strong></h5>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>

      <b-col
        cols="12"
        class="mt-3"
      >
        <h5 class="ml-4">
          <strong>Informasi Penjualan</strong>
        </h5>
      </b-col>

      <b-col cols="12">
        <b-card>
          <b-table
            responsive
            class="position-relative mt-2"
            empty-text="Tidak ada data untuk ditampilkan."
            :fields="fields"
            :items="items"
          >

            <template #cell(product_name)="data">
              <b-row class="d-flex align-items-center">
                <div class="d-flex align-items-center mb-1">
                  <div v-if="data.item.product.product_image[0] !== undefined">
                    <b-avatar
                      square
                      size="50px"
                      variant="light-primary"
                      :src="data.item.product.product_image[0].images_path"
                    />
                  </div>
                  <div v-else>
                    <b-avatar
                      square
                      size="50px"
                      variant="light-primary"
                    />
                  </div>
                  <div>
                    <p class="ml-1">
                      <strong> {{ data.item.product_name }} </strong>
                    </p>
                    <small class="text-danger ml-1">{{ data.item.product_variant_name }}</small>
                  </div>
                </div>
              </b-row>
            </template>

            <template #cell(product_price)="data">
              Rp. {{ data.value }}
            </template>

            <template #cell(product)="data">
              Rp. {{ data.item.product_price * data.item.qty }}
            </template>

          </b-table>

          <hr>

          <b-row class="d-flex justify-content-end">

            <b-col
              cols="12"
            >

              <b-row class="d-flex justify-content-end align-items-center mt-2">
                <b-col
                  md="8"
                >
                  <b-list-group>
                    <b-list-group-item class="border-0">
                      <span>Total Harga Produk</span>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <span>Ongkos Kirim</span>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <span>Potongan Harga</span>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
                <b-col
                  md="3"
                  class="d-flex justify-content-end"
                >
                  <b-list-group>
                    <b-list-group-item class="border-0">
                      <h5>
                        <strong>Rp. {{ totalPriceProduct }}</strong>
                      </h5>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <h5>
                        <strong>Rp. {{ serviceFee }}</strong>
                      </h5>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <h5>
                        <strong>Rp. {{ cashback }}</strong>
                      </h5>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>

              <b-row class="d-flex justify-content-end">
                <b-col cols="11">
                  <hr>
                </b-col>
              </b-row>

              <b-row class="d-flex justify-content-end align-items-center">
                <b-col
                  md="8"
                >
                  <b-list-group>
                    <b-list-group-item class="border-0">
                      <h4>
                        <strong>
                          Penghasilan bersih yang kamu dapatkan (Transfer Bank)
                        </strong>
                      </h4>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      Biaya COD (2,8 sudah termasuk PPN)
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      Cashback Ongkir (2,5%)
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <h5 class="text-danger">
                        <strong>
                          Penghasilan bersih yang kamu dapatkan
                        </strong>
                      </h5>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
                <b-col
                  md="3"
                  class="d-flex justify-content-end"
                >
                  <b-list-group>
                    <b-list-group-item class="border-0">
                      <h4 class="text-danger">
                        <strong>
                          Rp. {{ penghasilanBersih }}
                        </strong>
                      </h4>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <h5>
                        <strong>
                          Rp.  {{ shippingCost }}
                        </strong>
                      </h5>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <h5>
                        <strong>
                          Rp. {{ shippingCashback }}
                        </strong>
                      </h5>
                    </b-list-group-item>
                    <b-list-group-item class="border-0">
                      <h5 class="text-danger">
                        <strong>
                          Rp. {{ penghasilanBersih }}
                        </strong>
                      </h5>
                    </b-list-group-item>
                  </b-list-group>
                </b-col>
              </b-row>

            </b-col>
          </b-row>
        </b-card>
      </b-col>

    </b-card>
  </b-overlay>
</template>

<script>
import useJwt from '@/auth/jwt/useJwt'
import {
  BCol,
  BListGroup,
  BListGroupItem,
  BRow,
  BBadge,
  BAvatar,
  BTable,
  // BButton,
  BCard,
  BOverlay,
} from 'bootstrap-vue'
import httpKomship from '../setting-kompship/http_komship'

export default {
  components: {
    BCard,
    BCol,
    BListGroup,
    BListGroupItem,
    BRow,
    BBadge,
    BAvatar,
    BTable,
    // BButton,
    BOverlay,
  },
  data() {
    return {
      loading: false,
      id: this.$route.params.order_id,
      nameUser: '',

      // Information Order
      orderNomor: '',
      orderDate: '',
      metodePembayaran: '',
      orderStatus: null,

      // Information Delivery
      customerOrderName: '',
      customerOrderAddress: '',
      customerOrderPhone: '',
      ekspedisi: '',
      nomorResi: '',

      // Information Sale
      fields: [
        {
          key: 'id',
          label: 'No',
        },
        {
          key: 'product_name',
          label: 'Nama Produk',
        },
        {
          key: 'product_price',
          label: 'Harga Satuan',
        },
        {
          key: 'qty',
          label: 'Jumlah',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'product',
          label: 'Subtotal',
        },
      ],

      items: [],

      totalPriceProduct: '',
      serviceFee: '',
      cashback: '',
      shippingCashback: '',
      shippingCost: '',

      penghasilanBersih: '',
    }
  },
  mounted() {
    this.getDetailOrder()
    this.getPartner()
  },
  methods: {
    getDetailOrder() {
      this.loading = true
      httpKomship.get(`/v1/customers/detail-order/${this.id}`, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.orderNomor = data.order_no
        this.orderDate = data.order_date
        this.metodePembayaran = data.payment_method
        if (data.order_status === 0) {
          this.orderStatus = 'Diajukan'
        } else if (data.order_status === 1) {
          this.orderStatus = 'Dikirim'
        } else if (data.order_status === 2) {
          this.orderStatus = 'Diterima'
        } else if (data.order_status === 3) {
          this.orderStatus = 'Retur'
        } else if (data.order_status === 4) {
          this.orderStatus = 'Batal'
        }
        this.customerOrderName = data.customers.name
        this.customerOrderAddress = data.customers.address
        this.customerOrderPhone = data.customers.phone
        this.ekspedisi = data.shipping
        this.nomorResi = data.airway_bill
        this.items = data.order_detail
        this.totalPriceProduct = data.total_product_price
        this.serviceFee = data.service_fee
        if (data.cash_back === null) {
          this.cashback = 0
        } else {
          this.cashback = data.cash_back
        }
        this.shippingCashback = data.shipping_cashback
        this.shippingCost = data.shipping_cost
        this.penghasilanBersih = this.totalPriceProduct - this.serviceFee - this.shippingCost + this.shippingCashback
        this.loading = false
        return this.items
      })
    },
    getPartner() {
      httpKomship.post('/v1/my-profile', {}, {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(response => {
        const { data } = response.data
        this.nameUser = data.user_fullname
      })
    },
  },
}
</script>

<style>

</style>
