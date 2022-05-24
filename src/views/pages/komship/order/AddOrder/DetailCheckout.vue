<template>
  <b-card>
    <b-button
      variant="primary"
      class="rounded-lg mb-2"
      size="sm"
      to="/add-order"
    >
      <b-icon-chevron-left />
    </b-button>
    <div class="d-flex justify-between mb-2">
      <h3 class="font-bold">
        Tambah Order
      </h3>
      <span
        v-if="profile.is_komship === 1"
        class="d-flex my-auto"
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
    </div>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Tanggal</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold text-lg"
      >
        {{ moment(orderDate) }}
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Nama Pelanggan</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <b-form-input
          v-model="customerName"
          list="customerList"
          placeholder="Masukkan Nama"
          autocomplete="off"
          @keydown="getCustomer($event)"
        />
        <datalist id="customerList">
          <option
            v-for="item in listCustomer"
            :key="item.customer_id"
            :value="item.name"
          >
            {{ item.name }}, {{ item.phone }}, {{ item.address }}
          </option>
        </datalist>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >No Telepon</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <b-input-group>
          <template #prepend>
            <b-form-select
              :options="['+62']"
              value="+62"
            />
          </template>
          <b-form-input v-model="customerPhone" />
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="mb-1 align-items-center">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Masukan Kelurahan/Kecamatan</label>
      </b-col>
      <b-col md="5">
        <v-select
          ref="selectDestination"
          v-model="destination"
          :options="listDestination"
          placeholder="Masukan Kelurahan/Kecamatan"
          @search="getDestination"
          @input="getShippingType"
        >
          <span
            slot="no-options"
            @click="$refs.selectDestination.open = false"
          >
            Tidak ada data untuk ditampilkan.
          </span>
        </v-select>
      </b-col>
      <b-spinner
        v-if="loadingSearch"
        small
        variant="primary"
      />
    </b-row>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Alamat Detail</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <b-form-textarea
          v-model="detailAddress"
          placeholder="Masukkan Alamat Lengkap"
        />
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Metode Pembayaran</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <b-form-select
          v-model="paymentMethod"
          :options="listPayment"
          @input="getShippingType"
        />
      </b-col>
      <b-col
        v-if="paymentMethod === 'BANK TRANSFER'"
        md="4"
      >
        <v-select
          v-model="rekening"
          :options="listRekening"
          label="account_name"
          placeholder="Pilih Rekening"
          @input="validateRekening"
        >
          <template #option="{ account_name, bank_name, account_no }">
            <span class="font-bold text-lg">{{ account_name }}</span><br>
            <em>{{ bank_name }} - {{ account_no }}</em>
          </template>
        </v-select>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Ekspedisi</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <b-form-select
          v-model="shipping"
          :options="listShipping"
          @input="getShippingType"
        />
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <v-select
          ref="selectTypeShipping"
          v-model="typeShipping"
          :options="listTypeShipping"
          placeholder="Opsi Pengiriman"
          :disabled="!isTypeShipping"
          @input="calculate"
        >
          <span
            slot="no-options"
            @click="$refs.selectTypeShipping.open = false"
          >
            Tidak ada data untuk ditampilkan.
          </span>
        </v-select>
      </b-col>
    </b-row>
    <div
      v-if="isCalculate"
      class="p-1 mt-2"
      style="border: 1px solid #E2E2E2;border-radius:16px;"
    >
      <b-row
        class="mb-1"
      >
        <b-col md="3">
          <label
            class="text-lg"
            style="color:#828282;"
          >Gunakan Potongan Saldo</label><br>
          <span class="text-muted text-sm">Total tagihan akan dikurangi untuk biaya ini</span>
        </b-col>
        <b-col
          md="4"
          class="font-bold"
        >
          <b-form-checkbox
            v-model="potonganSaldo"
            :value="true"
            :unchecked-value="false"
            @input="getAdditionalCost"
          />
        </b-col>
      </b-row>
      <b-collapse
        v-model="potonganSaldo"
        class="mt-2"
      >
        <b-row class="mb-1">
          <b-col md="3">
            <label
              class="text-lg"
              style="color:#828282;"
            >Nominal Potongan</label>
          </b-col>
          <b-col
            md="4"
            class="font-bold"
          >
            <b-form-input
              v-model="discount"
              type="number"
              @input="getAdditionalCost"
            />
          </b-col>
        </b-row>
      </b-collapse>
    </div>
    <div
      v-if="isCalculate"
      class="p-1 mt-2"
      style="border: 1px solid #E2E2E2;border-radius:16px;"
    >
      <b-row
        class="mb-1"
      >
        <b-col md="3">
          <label
            class="text-lg"
            style="color:#828282;"
          >Biaya Tambahan Lain</label><br>
          <span class="text-muted text-sm">Total tagihan akan ditambahkan dengan biaya ini</span>
        </b-col>
        <b-col
          md="4"
          class="font-bold"
        >
          <b-form-checkbox
            v-model="biayaLain"
            :value="true"
            :unchecked-value="false"
            @change="getAdditionalCost"
          />
        </b-col>
      </b-row>
      <b-collapse
        v-model="biayaLain"
        class="mt-2"
      >
        <b-row class="mb-1">
          <b-col md="3">
            <label
              class="text-lg"
              style="color:#828282;"
            >Jenis Biaya Lain</label>
          </b-col>
          <b-col md="8">
            <div
              v-if="paymentMethod === 'COD'"
              class="d-flex"
            >
              <b-form-radio
                v-model="jenisBiayaLain"
                value="0"
                @change="getAdditionalCost"
              >
                Bebankan biaya COD ke customer
              </b-form-radio>
              <b-form-input
                v-if="jenisBiayaLain === '0'"
                v-model="bebankanCustomer"
                type="number"
                class="ml-1"
                style="width:80px;height:20px;"
                disabled
              />
            </div>
            <b-form-radio
              v-model="jenisBiayaLain"
              class="mt-1"
              value="1"
              @change="getAdditionalCost"
            >
              Sesuai Nominal
            </b-form-radio>
            <b-form-input
              v-if="jenisBiayaLain === '1'"
              v-model.number="sesuaiNominal"
              type="number"
              class="mt-1"
              style="width:250px;"
              @input="getAdditionalCost"
            />
          </b-col>
        </b-row>
      </b-collapse>
    </div>
    <hr>
    <h3 class="font-bold mt-3 mb-1">
      Data Pembelian
    </h3>
    <b-table
      responsive
      show-empty
      empty-text="Tidak ada data untuk ditampilkan."
      :items="itemsOrder"
      :fields="fieldsOrder"
    >
      <template #cell(no)="data">
        {{ data.index + 1 }}
      </template>
      <template #cell(product_name)="data">
        <div class="d-flex">
          <div v-if="data.item.product_image === ''">
            <img
              style="width:50px;height:50px;"
              :src="require('@/assets/images/avatars/image-null.png')"
            >
          </div>
          <div v-else>
            <img
              style="width:50px;height:50px;"
              :src="data.item.product_image"
              :alt="data.item.product_image"
            >
          </div>
          <div
            class="ml-1"
            style="width:70%;"
          >
            <span class="font-bold">{{ data.item.product_name }}</span><br>
            <span v-if="data.item.variant_id === 0">Tidak Ada Variasi</span>
            <span v-else>{{ data.item.variant_name }}</span>
          </div>
        </div>
      </template>
      <template #cell(product_price)="data">
        <span>
          Rp {{ formatNumber(data.item.product_price) }}
        </span>
      </template>

      <template #cell(subtotal)="data">
        <span>
          Rp {{ formatNumber(data.item.subtotal) }}
        </span>
      </template>
    </b-table>
    <div
      v-if="isCalculate"
      class="mb-3"
    >
      <hr>
      <b-row class="mb-1 text-lg">
        <b-col lg="5" />
        <b-col lg="5">
          Total Harga Produk
        </b-col>
        <b-col
          lg="2"
          class="d-flex justify-end"
        >
          Rp {{ formatNumber(subTotal) }}
        </b-col>
      </b-row>
      <b-row class="mb-1 text-lg">
        <b-col lg="5" />
        <b-col lg="5">
          Ongkos Kirim ({{ weight }} kg)
        </b-col>
        <b-col
          lg="2"
          class="d-flex justify-end"
        >
          Rp {{ formatNumber(shippingCost) }}
        </b-col>
      </b-row>
      <b-row
        v-if="potonganSaldo"
        class="mb-1 text-lg"
      >
        <b-col lg="5" />
        <b-col lg="5">
          Potongan Harga
        </b-col>
        <b-col
          lg="2"
          class="d-flex justify-end"
        >
          <b-spinner
            v-if="loadingCalculate"
            class="mr-1 my-auto"
            small
            variant="primary"
          />
          <span v-else>- Rp {{ formatNumber(discount) }}</span>
        </b-col>
      </b-row>
      <b-row
        v-if="biayaLain"
        class="mb-1 text-lg"
      >
        <b-col lg="5" />
        <b-col lg="5">
          Biaya Lain
        </b-col>
        <b-col
          lg="2"
          class="d-flex justify-end"
        >
          Rp {{ formatNumber(additionalCost) }}
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="5" />
        <b-col lg="7">
          <hr><span />
        </b-col>
      </b-row>
      <b-row class="text-xl font-bold mb-1">
        <b-col lg="5" />
        <b-col lg="5">
          Total Pembayaran ({{ paymentMethod }})
        </b-col>
        <b-col
          lg="2"
          class="text-primary d-flex justify-end"
        >
          <b-spinner
            v-if="loadingCalculate"
            class="mr-1 my-auto"
            small
            variant="primary"
          />
          <span v-else>Rp {{ formatNumber(grandTotal) }}</span>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="5" />
        <b-col lg="5">
          <hr><span />
        </b-col>
        <b-col
          lg="2"
          class="d-flex justify-end"
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
        <b-row
          v-if="paymentMethod === 'COD'"
          class="mb-1 text-lg"
        >
          <b-col lg="5" />
          <b-col lg="5">
            Biaya COD ({{ serviceFeePercentage }}% sudah termasuk PPN)
          </b-col>
          <b-col
            lg="2"
            class="d-flex justify-end"
          >
            <b-spinner
              v-if="loadingCalculate"
              class="mr-1 my-auto"
              small
              variant="primary"
            />
            <span v-else>- Rp {{ formatNumber(serviceFee) }}</span>
          </b-col>
        </b-row>
        <b-row class="mb-1 text-lg">
          <b-col lg="5" />
          <b-col lg="5">
            Ongkos Kirim (dipotong cashback {{ cashbackPercentage }}%)
          </b-col>
          <b-col
            lg="2"
            class="d-flex justify-end"
          >
            <b-spinner
              v-if="loadingCalculate"
              class="mr-1 my-auto"
              small
              variant="primary"
            />
            <span v-else>- Rp {{ formatNumber(shippingCost - cashback) }}</span>
          </b-col>
        </b-row>
        <b-row class="mb-1 text-lg">
          <b-col lg="5" />
          <b-col lg="5">
            Penghasilan bersih yang kamu dapatkan
          </b-col>
          <b-col
            lg="2"
            class="d-flex justify-end text-success"
          >
            <b-spinner
              v-if="loadingCalculate"
              class="mr-1 my-auto"
              small
              variant="primary"
            />
            <span
              v-else
              class="text-primary"
            >Rp {{ formatNumber(netProfit) }}</span>
          </b-col>
        </b-row>
      </b-collapse>
    </div>
    <hr>
    <b-row>
      <b-col lg="3" />
      <b-col
        lg="6"
        class="font-bold text-2xl"
      >
        <span v-if="isCalculate">Total Pembayaran:
          <b-spinner
            v-if="loadingCalculate"
            class="ml-1"
            variant="primary"
          />
          <span
            v-else
            class="text-primary"
          > Rp {{ formatNumber(grandTotal) }}</span>
        </span>
      </b-col>
      <b-col lg="3">
        <b-button
          variant="primary"
          :disabled="!isCalculate"
          @click="submit"
        >
          Submit
        </b-button>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import {
  BCard, BButton, BIconChevronLeft, BRow, BCol, BFormInput, BInputGroup, BFormSelect, BFormTextarea, BCollapse, BTable, VBToggle, BFormRadio,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import '@core/scss/vue/libs/vue-select.scss'
import moment from 'moment'

export default {
  components: {
    BCard, BButton, BIconChevronLeft, BRow, BCol, BFormInput, BInputGroup, vSelect, BFormSelect, BFormTextarea, BCollapse, BTable, BFormRadio,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      loadingSearch: false,
      loadingCalculate: false,
      profile: null,
      addressId: null,
      arrayCart: [],
      cartId: null,
      isCalculate: false,
      isTypeShipping: false,
      orderDate: null,
      customerName: null,
      listCustomer: [],
      customerId: 0,
      customerPhone: null,
      detailAddress: null,
      destination: null,
      listDestination: [],
      paymentMethod: null,
      listPayment: ['COD', 'BANK TRANSFER'],
      rekening: null,
      listRekening: [],
      totalRekening: 0,
      bankName: null,
      bankAccountName: null,
      bankAccountNo: null,
      shipping: null,
      listShipping: ['JNE'],
      typeShipping: null,
      listTypeShipping: [],
      shippingCost: null,
      serviceFee: null,
      serviceFeePercentage: null,
      weight: null,
      cashback: null,
      cashbackPercentage: null,
      potonganSaldo: false,
      discount: 0,
      biayaLain: false,
      jenisBiayaLain: '0',
      sesuaiNominal: 0,
      bebankanCustomer: 0,
      additionalCost: 0,
      subTotal: null,
      netProfit: null,
      grandTotal: null,
      fieldsOrder: [
        {
          key: 'no', label: 'No', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'product_name', label: 'Nama Produk', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'product_price', label: 'Harga Satuan', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'qty', label: 'Jumlah', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'subtotal', label: 'Subtotal', thClass: 'align-middle', tdClass: 'align-top',
        },
      ],
      itemsOrder: [],
    }
  },
  created() {
    this.addressId = this.$route.query.address_id
    this.orderDate = this.$route.query.date
    this.getProfile()
    this.getRekening()
    this.getDestination()
  },
  methods: {
    formatNumber: value => (`${value}`).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    moment(date) {
      const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const day = moment(date).format('DD')
      const month = moment(date).format('M')
      const year = moment(date).format('YYYY')
      return `${day} ${monthName[month - 1]} ${year}`
    },
    async getProfile() {
      await this.$http_komship.post('v1/my-profile')
        .then(res => {
          this.profile = res.data.data
          this.getCart()
        })
    },
    async getCart() {
      await this.$http_komship.get('v1/cart')
        .then(res => {
          const { data } = res.data
          this.itemsOrder = data
          this.cartId = data.map(items => items.cart_id)
        })
        .catch(() => {
          // handle error
        })
    },
    async getCustomer(e) {
      const event = e.key ? 'input' : 'list'
      if (event === 'list') {
        return this.listCustomer.forEach(element => {
          if (element.name === this.customerName) {
            this.customerId = element.customer_id
            this.customerPhone = element.phone
            this.detailAddress = element.address
          }
        })
      }
      await this.$http_komship.get('v1/customer', {
        params: { search: this.customerName },
      })
        .then(response => {
          const { data } = response.data
          this.listCustomer = data
        }).catch(() => {
          // handle error
        })
      return this.listCustomer
    },
    async getDestination(search) {
      this.loadingSearch = true
      setTimeout(() => {
        this.$http_komship.get('v1/destination', {
          params: { search },
        })
          .then(res => {
            const { data } = res.data.data
            this.listDestination = data
            this.loadingSearch = false
          })
          .catch(() => {
            this.loadingSearch = false
          })
      }, 2000)
    },
    async getRekening() {
      await this.$http_komship.get('v1/bank-account')
        .then(res => {
          const { data } = res.data
          this.listRekening = data
          this.totalRekening = data.length
        })
        .catch(() => {
          // handle erro
        })
    },
    async validateRekening() {
      if (this.paymentMethod === 'BANK TRANSFER' && this.totalRekening === 0) {
        this.$swal({
          title: '<span class="font-weight-bold h4">Kamu belum menambahkan rekening, silahkan tambahkan rekening terlebih dahulu.</span>',
          imageUrl: require('@/@core/assets/image/icon-popup-warning.png'), // eslint-disable-line
          confirmButtonText: 'Tambah Rekening',
          confirmButtonClass: 'btn btn-primary',
        }).then(result => {
          if (result.isConfirmed) {
            this.$router.push('/setting-kompship/rekening-bank')
          }
        })
      }
    },
    async getShippingType() {
      if (this.potonganSaldo === false || this.discount === null) {
        this.discount = 0
      }
      if (this.destination && this.shipping && this.profile && this.paymentMethod !== null) {
        await this.$http_komship.get('v1/calculate', {
          params: {
            partner_id: this.profile.partner_id,
            tariff_code: this.destination.value,
            payment_method: this.paymentMethod,
            shipping: this.shipping,
            discount: this.discount,
            partner_address_id: this.addressId,
            cart: this.cartId.toString(),
          },
        })
          .then(res => {
            const { data } = res.data
            this.isTypeShipping = true
            this.listTypeShipping = data.map(items => ({
              shipping_type: items.shipping_type,
              label: this.nameTypeShipping(items.shipping_type),
            }))
          })
          .catch(() => {
            this.$swal({
              title: '<span class="font-weight-bold h4">Mohon maaf, perhitungan biaya terjadi kesalahan Silahkan pilih ulang ekspedisi anda atau refresh halaman.</span>',
              imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
              confirmButtonText: 'Oke',
              confirmButtonClass: 'btn btn-primary',
            })
          })
      } else {
        this.typeShipping = null
        this.isTypeShipping = false
        this.isCalculate = false
        this.listTypeShipping = []
      }
      return this.listTypeShipping
    },
    async getAdditionalCost() {
      this.loadingCalculate = true
      if (this.biayaLain && this.jenisBiayaLain === '1') {
        this.additionalCost = this.sesuaiNominal
      } else if (this.biayaLain && this.jenisBiayaLain === '0') {
        this.additionalCost = this.bebankanCustomer
      } else {
        this.additionalCost = 0
      }
      await this.$http_komship.get('v1/calculate', {
        params: {
          partner_id: this.profile.partner_id,
          tariff_code: this.destination.value,
          payment_method: this.paymentMethod,
          shipping: this.shipping,
          discount: this.discount,
          additional_cost: this.additionalCost,
          partner_address_id: this.addressId,
          cart: this.cartId.toString(),
        },
      })
        .then(res => {
          const { data } = res.data
          const result = data.find(element => element.shipping_type === this.typeShipping.shipping_type)
          this.subTotal = result.subtotal
          this.shippingCost = result.shipping_cost
          this.netProfit = result.net_profit
          this.serviceFee = Math.round(result.service_fee)
          this.serviceFeePercentage = result.service_fee_percentage
          this.weight = result.weight
          this.grandTotal = result.grandtotal
          this.cashback = result.cashback
          this.cashbackPercentage = result.cashback_percentage
          this.additionalCost = result.additional_cost
          this.isCalculate = true
          this.loadingCalculate = false
        })
        .catch(() => {
          // handle error
        })
    },
    async calculate() {
      if (this.potonganSaldo === false || this.discount === null) {
        this.discount = 0
      }
      if (this.typeShipping !== null) {
        this.loadingCalculate = true
        await this.$http_komship.get('v1/calculate', {
          params: {
            partner_id: this.profile.partner_id,
            tariff_code: this.destination.value,
            payment_method: this.paymentMethod,
            shipping: this.shipping,
            discount: this.discount,
            additional_cost: this.additionalCost,
            partner_address_id: this.addressId,
            cart: this.cartId.toString(),
          },
        })
          .then(res => {
            const { data } = res.data
            const result = data.find(element => element.shipping_type === this.typeShipping.shipping_type)
            this.subTotal = result.subtotal
            this.shippingCost = result.shipping_cost
            this.netProfit = result.net_profit
            this.serviceFee = Math.round(result.service_fee)
            this.serviceFeePercentage = result.service_fee_percentage
            this.weight = result.weight
            this.grandTotal = result.grandtotal
            this.cashback = result.cashback
            this.cashbackPercentage = result.cashback_percentage
            this.sesuaiNominal = Math.round(result.service_fee)
            this.bebankanCustomer = Math.round(result.service_fee)
            this.additionalCost = result.additional_cost
            this.isCalculate = true
            this.loadingCalculate = false
          })
          .catch(() => {
            // handle error// handle error
          })
      } else {
        this.isCalculate = false
      }
      return this.isCalculate
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
    async submit() {
      if (this.paymentMethod === 'BANK TRANSFER' && this.rekening) {
        this.bankName = this.rekening.bank_name
        this.bankAccountName = this.rekening.account_name
        this.bankAccountNo = this.rekening.account_no
      } else {
        this.bankName = 0
        this.bankAccountName = 0
        this.bankAccountNo = 0
      }
      const formData = {
        date: this.orderDate,
        tariff_code: this.destination.value,
        subdistrict_name: this.destination.subdistrict_name,
        zip_code: this.destination.zip_code,
        district_name: this.destination.district_name,
        city_name: this.destination.city_name,
        is_komship: this.profile.is_komship,
        customer_id: this.customerId,
        customer_name: this.customerName,
        customer_phone: this.customerPhone,
        detail_address: this.detailAddress,
        shipping: this.shipping,
        shipping_type: this.typeShipping.shipping_type,
        payment_method: this.paymentMethod,
        bank: this.bankName,
        partner_address_id: this.addressId,
        bank_account_name: this.bankAccountName,
        bank_account_no: this.bankAccountNo,
        subtotal: this.subTotal,
        grandtotal: this.grandTotal,
        shipping_cost: this.shippingCost,
        service_fee: this.serviceFee,
        discount: this.discount,
        additional_cost: this.additionalCost,
        shipping_cashback: this.cashback,
        net_profit: this.netProfit,
        cart: this.cartId,
      }
      if (this.paymentMethod === 'BANK TRANSFER' && this.rekening && this.customerName && this.customerPhone && this.detailAddress) {
        await this.$http_komship.post(`v1/order/${this.profile.partner_id}/store`, formData)
          .then(() => {
            this.$swal({
              title: '<span class="font-weight-bold h4">Berhasil Tambah Order</span>',
            imageUrl: require('@/assets/images/icons/success.svg'), // eslint-disable-line
              confirmButtonText: 'Oke',
              confirmButtonClass: 'btn btn-primary',
            }).then(() => {
              this.$router.push('/data-order')
            })
          })
      } else if (this.paymentMethod === 'COD' && this.customerName && this.customerPhone && this.detailAddress) {
        await this.$http_komship.post(`v1/order/${this.profile.partner_id}/store`, formData)
          .then(() => {
            this.$swal({
              title: '<span class="font-weight-bold h4">Berhasil Tambah Order</span>',
            imageUrl: require('@/assets/images/icons/success.svg'), // eslint-disable-line
              confirmButtonText: 'Oke',
              confirmButtonClass: 'btn btn-primary',
            }).then(() => {
              this.$router.push('/data-order')
            })
          })
      } else {
        this.$swal({
          title: '<span class="font-weight-bold h4">Tidak Boleh Ada Field Yang Kosong!</span>',
          imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
          confirmButtonText: 'Oke',
          confirmButtonClass: 'btn btn-primary',
        })
      }
    },
  },
}
</script>
<style>
.collapsed > .when-open,
.not-collapsed > .when-closed {
  display: none;
}
</style>
