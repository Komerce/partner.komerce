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
      <span class="text-primary font-bold">Pengiriman Komship</span>
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
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Masukan Kota/Kabupaten</label>
      </b-col>
      <b-col md="5">
        <v-select
          ref="selectDestination"
          v-model="destination"
          :options="listDestination"
          placeholder="Masukan Kota/Kabupaten"
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
          label="shipping_type"
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
          <template #option="{ shipping_type }">
            {{ nameTypeShipping(shipping_type) }}
          </template>
        </v-select>
      </b-col>
    </b-row>
    <b-row class="mb-1">
      <b-col md="3">
        <label
          class="text-lg"
          style="color:#828282;"
        >Gunakan Potongan Saldo</label>
      </b-col>
      <b-col
        md="4"
        class="font-bold"
      >
        <b-form-checkbox
          v-model="potonganSaldo"
          :value="true"
          :unchecked-value="false"
          @input="calculate"
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
            @input="calculate"
          />
        </b-col>
      </b-row>
    </b-collapse>
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
            <span
              v-if="data.item.is_variant === '1'"
              class="text-primary"
            >
              {{ data.item.itemSelected.variation }}
            </span>
            <span v-else>Tidak Ada Variasi</span>
          </div>
        </div>
      </template>
      <template #cell(price)="data">
        <span v-if="data.item.is_variant === '1'">
          Rp. {{ formatNumber(data.item.itemSelected.price) }}
        </span>
        <span v-else>
          Rp. {{ formatNumber(data.item.price) }}
        </span>
      </template>
      <template #cell(subtotal)="data">
        <span v-if="data.item.is_variant === '1'">
          Rp. {{ formatNumber(data.item.stockToDisplay * data.item.itemSelected.price) }}
        </span>
        <span v-else>
          Rp. {{ formatNumber(data.item.stockToDisplay * data.item.price) }}
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
          Rp. {{ formatNumber(subTotal) }}
        </b-col>
      </b-row>
      <b-row class="mb-1 text-lg">
        <b-col lg="5" />
        <b-col lg="5">
          Ongkos Kirim
        </b-col>
        <b-col
          lg="2"
          class="d-flex justify-end"
        >
          Rp. {{ formatNumber(shippingCost) }}
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
          Rp. {{ formatNumber(discount) }}
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
          Rp. {{ formatNumber(grandTotal) }}
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
            - Rp. {{ formatNumber(serviceFee) }}
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
            - Rp. {{ formatNumber(shippingCost - cashback) }}
          </b-col>
        </b-row>
        <b-row class="mb-1 text-lg text-primary">
          <b-col lg="5" />
          <b-col lg="5">
            Penghasilan bersih yang kamu dapatkan
          </b-col>
          <b-col
            lg="2"
            class="d-flex justify-end"
          >
            Rp. {{ formatNumber(netProfit) }}
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
        <span v-if="isCalculate">Total Pembayaran:<span class="text-primary"> Rp. {{ formatNumber(grandTotal) }}</span></span>
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
  BCard, BButton, BIconChevronLeft, BRow, BCol, BFormInput, BInputGroup, BFormSelect, BFormTextarea, BCollapse, BTable, VBToggle,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import '@core/scss/vue/libs/vue-select.scss'
import moment from 'moment'

export default {
  components: {
    BCard, BButton, BIconChevronLeft, BRow, BCol, BFormInput, BInputGroup, vSelect, BFormSelect, BFormTextarea, BCollapse, BTable,
  },
  directives: {
    'b-toggle': VBToggle,
  },
  data() {
    return {
      profile: null,
      addressId: null,
      arrayCart: [],
      cartId: null,
      isCalculate: false,
      isTypeShipping: false,
      orderDate: moment().format('YYYY/MM/DD'),
      customerName: null,
      listCustomer: [],
      customerId: 0,
      customerPhone: null,
      detailAddress: null,
      destination: null,
      listDestination: [],
      paymentMethod: null,
      listPayment: ['COD', 'BANK TRANSFER'],
      shipping: null,
      listShipping: ['JNE'],
      typeShipping: null,
      listTypeShipping: [],
      shippingCost: null,
      serviceFee: null,
      serviceFeePercentage: null,
      cashback: null,
      cashbackPercentage: null,
      potonganSaldo: false,
      discount: 0,
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
          key: 'price', label: 'Harga Satuan', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'stockToDisplay', label: 'Jumlah', thClass: 'align-middle', tdClass: 'align-top',
        },
        {
          key: 'subtotal', label: 'Subtotal', thClass: 'align-middle', tdClass: 'align-top',
        },
      ],
      itemsOrder: [],
    }
  },
  created() {
    this.addressId = this.$route.params.address_id
    this.getProfile()
  },
  methods: {
    formatNumber: value => (`${value}`).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    moment(date) {
      return moment(date).format('DD MMMM YYYY')
    },
    async getProfile() {
      await this.$http_komship.post('v1/my-profile')
        .then(res => {
          this.profile = res.data.data
          this.getCart()
        })
    },
    async getCart() {
      this.itemsOrder = this.$route.params.itemsOrder
      this.arrayCart = this.itemsOrder.map(val => ({
        product_id: val.product_id,
        product_name: val.product_name,
        variant_id: typeof val.product_variant[0] !== 'undefined' ? val.product_variant[0].options_id : 0,
        variant_name: typeof val.product_variant[0] !== 'undefined' ? val.product_variant[0].name : '',
        product_price: typeof val.product_variant[0] !== 'undefined' ? val.product_variant[0].price : val.price,
        qty: val.stockToDisplay,
        subtotal: val.stockToDisplay * (typeof val.product_variant[0] !== 'undefined' ? val.product_variant[0].price : val.price),
      }))
      await this.$http_komship.delete(`v1/cart/clear/${this.profile.user_id}`)
        .then(async res => {
          if (res.data.code === 200) {
            return this.$http_komship.post('v1/cart/bulk-store', this.arrayCart)
              .then(async result => {
                if (result.data.code === 200) {
                  this.cartId = result.data.data.cart_id
                }
              })
          }
          return this.cartId
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
        }).catch(err => {
          console.log(err)
        })
      return this.listCustomer
    },
    async getDestination(search) {
      await this.$http_komship.get('v1/destination', {
        params: { search },
      })
        .then(res => {
          const { data } = res.data.data
          this.listDestination = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getShippingType() {
      if (this.potonganSaldo === false && this.discount === null) {
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
            this.listTypeShipping = data
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
    async calculate() {
      if (this.potonganSaldo === false && this.discount === null) {
        this.discount = 0
      }
      if (this.typeShipping !== null) {
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
            const result = data.find(element => element.shipping_type === this.typeShipping.shipping_type)
            this.subTotal = result.subtotal
            this.shippingCost = result.shipping_cost
            this.netProfit = result.net_profit
            this.serviceFee = result.service_fee
            this.serviceFeePercentage = result.service_fee_percentage
            this.grandTotal = result.grandtotal
            this.cashback = result.cashback
            this.cashbackPercentage = result.cashback_percentage
            this.isCalculate = true
          })
          .catch(err => {
            console.log(err)
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
      if (this.customerName && this.customerPhone && this.detailAddress !== null) {
        await this.$http_komship.post(`v1/order/${this.profile.partner_id}/store`, {
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
          bank: 0,
          partner_address_id: this.addressId,
          bank_account_name: 0,
          bank_account_no: 0,
          subtotal: this.subTotal,
          grandtotal: this.grandTotal,
          shipping_cost: this.shippingCost,
          service_fee: this.serviceFee,
          discount: this.discount,
          shipping_cashback: this.cashback,
          net_profit: this.netProfit,
          cart: this.cartId,
        }).then(() => {
          this.$swal({
            title: '<span class="font-weight-bold h4">Berhasil Tambah Order</span>',
            imageUrl: require('@/assets/images/icons/success.svg'), // eslint-disable-line
            confirmButtonText: 'Oke',
            confirmButtonClass: 'btn btn-primary',
          }).then(() => {
            this.$router.push('/data-order')
          })
        })
        // .catch(() => {
        //   this.$swal({
        //     title: '<span class="font-weight-bold h4">Mohon maaf, saldo anda tidak mencukupi untuk membuat order. Silahkah cek kembali saldo anda.</span>',
        //     imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
        //     showCancelButton: true,
        //     confirmButtonText: 'Cek Saldo',
        //     confirmButtonClass: 'btn btn-primary',
        //     cancelButtonClass: 'btn btn-outline-primary text-primary',
        //     cancelButtonColor: '#FFFFFF',
        //   }).then(result => {
        //     if (result.isConfirmed) {
        //       this.$router.push({ name: 'saldo' })
        //     }
        //   })
        // })
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
