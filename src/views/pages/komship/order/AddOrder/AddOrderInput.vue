<template>
  <div class="add-order-main-wrapper">
    <div class="d-flex justify-between mb-3">
      <h3 class="font-bold">
        Tambah Order
      </h3>
      <span
        v-if="profile && profile.is_komship === 1"
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
    <section class="add-order-form mb-4">
      <b-form-group
        class="add-order-label mb-2"
        label="Tanggal"
        label-cols-md="2"
        label-for="input-date"
      >
        <div class="add-order-date-label">
          {{ dateLabel }}
        </div>
        <b-form-datepicker
          id="input-date"
          ref="dp1"
          v-model="dateValue"
          :min="new Date()"
          class="add-order-date-button"
          locale="id"
          label-help=""
          button-only
          @context="onChangeDate"
        >
          <template v-slot:button-content>
            <feather-icon
              icon="CalendarIcon"
              size="21"
              class="text-danger stroke-current"
            />
          </template>
        </b-form-datepicker>
      </b-form-group>
      <b-form-group
        class="add-order-label"
        label="Kirim Dari"
        label-cols-md="2"
      >
        <v-select
          v-model="choosenAddres"
          class="add-order-product-input"
          :options="addressList"
        >
          <span
            v-if="addressCount === 0"
            slot="no-options"
          >

            Anda belum menambahkan Gudang, tambahkan dahulu.
          </span>
          <span
            v-else
            slot="no-options"
          >
            Sedang Memuat ...
          </span>
        </v-select>
      </b-form-group>
      <b-form-group
        class="add-order-label"
        label="Pilih Produk"
        label-cols-md="2"
      >
        <v-select
          v-model="choosenProduct"
          class="add-order-product-input"
          label="product_name"
          label-cols-md="2"
          placeholder="Tambahkan Produk"
          :options="listProduct"
          @input="onAddProduct"
        >
          <span
            v-if="productCount===0"
            slot="no-options"
          >

            Belum ada produk, tambahkan dahulu.
          </span>
          <span
            v-else
            slot="no-options"
          >
            Sedang Memuat ...
          </span>
        </v-select>
      </b-form-group>
    </section>

    <b-table
      ref="tableAddOrderOne"
      :items="itemsOrder"
      :fields="fieldsOrder"
    >
      <template #cell(no)="data">
        {{ data.index+1 }}
      </template>

      <template #cell(product_name)="data">
        <b-row class="align-items-center">
          <b-col
            cols="auto"
            class="pr-0"
          >
            <b-avatar
              variant="light-primary"
              size="50px"
              square
              :src="data.item.product_image"
            />
          </b-col>
          <b-col cols="auto">
            <h4>
              <strong>
                {{ data.value }}
              </strong>
            </h4>
          </b-col>
        </b-row>
      </template>

      <template #cell(variation)="data">
        <div
          v-if="data.item.itemsSelected !== undefined"
        >
          <b-row
            v-for="(itemVariation, indexVariation) in data.item.itemsSelected"
            :key="indexVariation+1"
            class="py-1 my-50 pl-1"
          >
            <h4 class="text-primary mt-50">
              <strong>
                {{ itemVariation.variation }}
              </strong>
            </h4>
          </b-row>
        </div>
        <div v-if="data.item.variant[0] !== undefined">
          <b-button
            variant="outline-primary"
            class="btn-icon"
            :disabled="data.item.variant[0] === undefined"
            @click="chooseVariation(data)"
          >
            Pilih
          </b-button>
        </div>
        <div v-if="data.item.variant[0] === undefined">
          <b-button
            variant="outline-primary"
            class="btn-icon"
            disabled
          >
            Pilih
          </b-button>
        </div>
      </template>

      <template #cell(jumlah)="data">
        <div v-if="data.item.itemsSelected[0] !== undefined">
          <div
            v-for="(itemsVariation, indexVariation) in data.item.itemsSelected"
            :key="indexVariation+1"
            class="mb-1"
          >
            <b-row class="justify-content-center">
              <b-button
                variant="outline-primary"
                class="minus-button mr-1"
                @click="reduceTotalToOrder(itemsVariation, data)"
              >
                -
              </b-button>
              <h4 class="mr-1 mt-50">
                <strong>
                  {{ itemsVariation.stockToDisplay }}
                </strong>
              </h4>
              <b-button
                variant="outline-primary"
                class="plus-button"
                :disabled="itemsVariation.stock === 1"
                @click="addTotalToOrder(itemsVariation, data)"
              >
                +
              </b-button>
            </b-row>
            <b-row class="justify-content-center">
              <h5 class="text-primary">
                Stock tersedia: {{ getStockToDisplay(itemsVariation.stock) }}
              </h5>
            </b-row>
          </div>
        </div>
        <div v-else-if="data.item.variant[0] === undefined">
          <b-row class="justify-content-center">
            <b-button
              variant="outline-primary"
              class="minus-button mr-1"
              @click="reduceTotalToOrder(data)"
            >
              -
            </b-button>
            <h4 class="mr-1 mt-50">
              <strong>
                {{ data.item.stockToDisplayNoVariant }}
              </strong>
            </h4>
            <b-button
              variant="outline-primary"
              class="plus-button"
              :disabled="data.item.stock === 1"
              @click="addTotalToOrder(data)"
            >
              +
            </b-button>
          </b-row>
          <b-row class="justify-content-center">
            <h5 class="text-primary">
              Stock tersedia: {{ getStockToDisplay(data.item.stock) }}
            </h5>
          </b-row>
        </div>
        <div v-else>
          <h4>
            <strong>
              0
            </strong>
          </h4>
        </div>
      </template>

      <template #cell(price)="data">
        <div v-if="data.item.itemsSelected[0] !== undefined">
          <div
            v-for="(itemsVariation, indexVariation) in data.item.itemsSelected"
            :key="indexVariation+1"
            class="mb-4"
          >
            <h4>
              <strong>
                Rp {{ formatPrice(itemsVariation.price) }}
              </strong>
            </h4>
          </div>
        </div>
        <div
          v-else-if="data.item.variant[0] === undefined"
        >
          <h4>
            <strong>
              Rp {{ formatPrice(data.item.price) }}
            </strong>
          </h4>
        </div>
        <div
          v-else
        >
          <h4>
            <strong>
              0
            </strong>
          </h4>
        </div>
      </template>

      <template #cell(subtotal)="data">
        <div
          v-if="data.item.variant[0] === undefined"
        >
          <h4>
            <strong>
              Rp {{ formatPrice(data.item.price * data.item.stockToDisplayNoVariant) }}
            </strong>
          </h4>
        </div>
        <div
          v-else-if="data.item.itemsSelected[0] !== undefined"
        >
          <div
            v-for="(itemsVariation, indexVariation) in data.item.itemsSelected"
            :key="indexVariation+1"
            class="mb-4"
          >
            <h4>
              <strong>
                Rp {{ formatPrice(itemsVariation.price * itemsVariation.stockToDisplay) }}
              </strong>
            </h4>
          </div>
        </div>
      </template>

      <template #cell(action)="data">
        <b-button
          class="btn-icon delete-product-to-order text-center"
          variant="flat-primary"
          @click="handleRemoveProductOnList(data)"
        >
          <feather-icon
            icon="Trash2Icon"
          />
        </b-button>
      </template>
    </b-table>

    <!-- Modal Choose Variation -->
    <b-modal
      id="modal-choose-variation"
      hide-footer
      modal-class="modal-danger"
      centered
    >
      <!-- Parent Variant -->
      <div v-if="itemsChooseVariation.item.variant[1] !== undefined">
        <div
          v-for="(items, index) in itemsChooseVariation.item.variant"
          :key="index+1"
        >
          <b-row class="ml-50">
            <h4>
              <strong>
                {{ getNameVariantParent(items) }}
              </strong>
            </h4>
          </b-row>
          <b-row class="ml-50">
            <div
              v-for="(itemsVariant, indexVariant) in items.variant_option"
              :key="indexVariant+1"
            >
              <div v-if="itemsChooseVariation.item.variant[1] !== undefined">
                <b-button
                  :variant="isActiveVariant === itemsVariant.option_name ? 'outline-primary' : 'outline-dark'"
                  :class="itemsVariant.option_parent === 0 ? 'btn-icon m-50' : 'd-none'"
                  :pressed="isActiveVariant === itemsVariant.option_name"
                  @click="selectParentVariation(itemsVariant, itemsChooseVariation.item)"
                >
                  {{ getNameFirstChildVariant(itemsVariant) }}
                </b-button>
              </div>
              <div v-else>
                <b-button
                  :variant="isActiveVariant === itemsVariant.name ? 'outline-primary' : 'outline-dark'"
                  :class="itemsVariant.option_parent === 0 ? 'btn-icon m-50' : 'd-none'"
                  :pressed="isActiveVariant === itemsVariant.name"
                  @click="selectParentVariation(itemsVariant, itemsChooseVariation.item)"
                >
                  {{ getNameFirstChildVariant(itemsVariant) }}
                </b-button>
              </div>
            </div>
          </b-row>
        </div>
      </div>

      <div v-else>
        <div
          v-for="(items, index) in itemsChooseVariation.item.variant"
          :key="index+1"
        >
          <b-row class="ml-50">
            <h4>
              <strong>
                {{ getNameVariantParent(items) }}
              </strong>
            </h4>
          </b-row>
          <b-row class="ml-50">
            <div
              v-for="(itemsVariant, indexVariant) in itemsChooseVariation.item.product_variant"
              :key="indexVariant+1"
            >
              <b-button
                :variant="isActiveVariant === itemsVariant.name ? 'outline-primary' : 'outline-dark'"
                class="btn-icon m-50"
                :pressed="isActiveVariant === itemsVariant.name"
                :disabled="itemsVariant.stock === 0 ? true : false || handleDisableVariation(itemsVariant, itemsChooseVariation.item)"
                @click="selectParentVariation(itemsVariant, itemsChooseVariation.item)"
              >
                {{ itemsVariant.name }}
              </b-button>
            </div>
          </b-row>
        </div>
      </div>

      <!-- First Child -->
      <div v-if="itemFirstChildVariant !== []">
        <b-row class="ml-50 mt-2">
          <h4>
            <strong>
              {{ nameFirstChildVariation }}
            </strong>
          </h4>
        </b-row>
        <b-row class="ml-50">
          <div
            v-for="(itemsVariant, indexVariant) in itemFirstChildVariant"
            :key="indexVariant+1"
          >
            <div v-if="itemsChooseVariation.item.variant.length > 2">
              <b-button
                :variant="isActiveVariantFirstChild === itemsVariant.option_name ? 'outline-primary' : 'outline-dark'"
                class="btn-icon m-50"
                :pressed="isActiveVariantFirstChild === itemsVariant.option_name"
                @click="selectVariationFirstChild(itemsVariant, itemsChooseVariation.item)"
              >
                {{ itemsVariant.option_name }}
              </b-button>
            </div>
            <div v-else>
              <b-button
                :variant="isActiveVariantFirstChild === itemsVariant.name ? 'outline-primary' : 'outline-dark'"
                class="btn-icon m-50"
                :pressed="isActiveVariantFirstChild === itemsVariant.name"
                :disabled="itemsVariant.stock === 0 ? true : false || handleDisableVariation(itemsVariant, itemsChooseVariation.item)"
                @click="selectVariationFirstChild(itemsVariant, itemsChooseVariation.item)"
              >
                {{ itemsVariant.name }}
              </b-button>
            </div>
          </div>
        </b-row>
      </div>

      <!-- Second Child -->
      <div v-if="itemSecondChildVariant !== []">
        <b-row class="ml-50 mt-2">
          <h4>
            <strong>
              {{ nameSecondChildVariation }}
            </strong>
          </h4>
        </b-row>
        <b-row class="ml-50">
          <div
            v-for="(itemsVariant, indexVariant) in itemSecondChildVariant"
            :key="indexVariant+1"
          >
            <b-button
              :variant="isActiveVariantSecondChild === itemsVariant.name ? 'outline-primary' : 'outline-dark'"
              class="btn-icon m-50"
              :pressed="isActiveVariantSecondChild === itemsVariant.name"
              :disabled="itemsVariant.stock === 0 ? true : false || handleDisableVariation(itemsVariant, itemsChooseVariation.item)"
              @click="selectVariationSecondChild(itemsVariant)"
            >
              {{ itemsVariant.name }}
            </b-button>
          </div>
        </b-row>
      </div>

      <b-row class="d-flex justify-content-end">
        <b-button
          variant="primary"
          class="btn-icon mr-3 mb-2"
          :disabled="disableButtonAddOrderToTable()"
          @click="addOrderToTable(itemsChooseVariation.item)"
        >
          Ok
        </b-button>
      </b-row>
    </b-modal>

    <section class="view-order-summary">
      <b-row>
        <b-col class="text-left">
          <div class="add-order-summary-text text-left">
            <span>{{ itemsOrder.length }}</span> Produk ditambahkan
          </div>
        </b-col>
        <b-col class="text-right">
          <div class="add-order-summary-button-wrapper text-right">
            <b-button
              v-if="itemsOrder.length > 0"
              class="cancel-button"
              variant="outline-primary"
              @click="deleteAllSelectedItems"
            >
              Batalkan
            </b-button>
            <b-button
              v-else
              class="cancel-button hide"
              variant="outline-primary"
            >
              Batalkan
            </b-button>
            <b-button
              class="next-button"
              :disabled="buttonNext"
              @click="bulkStore"
            >
              Lanjutkan
            </b-button>
          </div>
        </b-col>
      </b-row>
    </section>

    <!-- Modal validate expedition -->
    <b-modal
      ref="modal-validate-address"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success text-center pb-2">
        <b-row class="justify-content-center mb-3 pt-2">
          <img src="@/@core/assets/image/icon-popup-warning.png">
        </b-row>
        <div class="text-wrapper text-center mb-3 px-1">
          <h4 class="text-black">
            <strong>
              Tambahkan alamat Pick Up untuk melanjutan kegiatan tambah order.
            </strong>
          </h4>
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeToAddressPickup }"
        >
          Tambahkan Alamat Pick Up
        </b-button>
      </div>
    </b-modal>

    <!-- Modal validate product -->
    <b-modal
      ref="modal-validate-product"
      hide-footer
      hide-header
      centered
    >
      <div class="modal-add-pickup-popup-success text-center pb-2">
        <b-row class="justify-content-center mb-3 pt-2">
          <img src="@/@core/assets/image/icon-popup-warning.png">
        </b-row>
        <div class="text-wrapper text-center mb-3 px-1">
          <h4 class="text-black">
            <strong>
              Tambahkan produk sebelum melanjutkan tambah order.
            </strong>
          </h4>
        </div>
        <b-button
          class="org-button"
          tag="router-link"
          :to="{ name: $route.meta.routeToAddProduct }"
        >
          Tambah Produk
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import {
  BFormDatepicker,
  BFormGroup,
  BButton,
  BTable,
  BRow,
  BCol,
  BAvatar,
  BModal,
} from 'bootstrap-vue'

import dateFormat from 'dateformat'
import {
  formatFullDate,
} from 'node-format-date'
import useJwt from '@/auth/jwt/useJwt'
import httpKomship from '../../setting-kompship/http_komship'
// import AddOrderTable from './AddOrderTable.vue'

function changeDate(dateString) {
  if (dateString && dateString !== '') {
    let today = new Date(dateString)
    const dd = today.getDate()
    const monthArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const mm = today.getMonth()
    const yyyy = today.getFullYear()
    today = `${dd} ${monthArr[mm]} ${yyyy}`
    return today
  }
  return dateString
}

export default {
  components: {
    BFormGroup,
    BButton,
    vSelect,
    // BFormSelect,
    // BFormSelectOption,
    // AddOrderTable,
    BFormDatepicker,
    BTable,
    BRow,
    BCol,
    BAvatar,
    BModal,
  },
  props: {
    screens: {
      type: String,
      default: '',
    },
    disableSubmitButtonStatus: {
      type: Boolean,
      default: true,
    },
    dateText: {
      type: String,
      default: '',
    },
    profile: {
      type: Object,
      default: () => {},
    },
    // listProduct: {
    //   type: Array,
    //   default: () => [],
    // },
    listSelected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dateValue: this.dateText,
      listProduct2: [],
      dateLabel: '',
      fields: [
        { key: 'no', label: 'No' },
        { key: 'product_name', label: 'Nama Produk' },
        { key: 'variation', label: 'Variasi' },
        { key: 'price', label: 'Harga Satuan' },
        { key: 'input', label: 'Jumlah' },
        { key: 'subtotal', label: 'Subtotal' },
      ],
      selectedItems: this.listSelected,
      selectedVariation: [],
      selectedProductVariant: [],
      selectedProdukIndexOnModal: -1,
      disableSubmitBtn: this.disableSubmitButtonStatus,

      dataTree: [],
      productCount: null,
      addressCount: null,

      // Refactor
      itemsOrder: [],
      fieldsOrder: [
        {
          key: 'no',
          label: 'No',
        },
        {
          key: 'product_name',
          label: 'Nama Produk',
        },
        {
          key: 'variation',
          label: 'Variasi',
        },
        {
          key: 'jumlah',
          label: 'Jumlah',
        },
        {
          key: 'price',
          label: 'Harga Satuan',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'subtotal',
          label: 'Subtotal',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'action',
          label: 'Hapus Produk',
          class: 'col-action',
        },
      ],
      itemsChooseVariation: {
        item: {
          variant: [
            {
              variant_name: null,
              variant_option: [],
            },
            {
              variant_name: null,
              variant_option: [],
            },
          ],
        },
      },
      itemParentNoVariant: [],
      itemParentVariant: [],
      itemFirstChildVariant: [],
      itemSecondChildVariant: [],

      isActiveVariant: '',
      isActiveVariantFirstChild: '',
      isActiveVariantSecondChild: '',

      nameFirstChildVariation: '',
      nameSecondChildVariation: '',

      // Data Table
      variationProductParent: null,
      variationProductFirstChild: null,
      variationProductSecondChild: null,
      price: null,
      stock: null,
      total: null,
      subtotal: null,
      optionId: null,

      stockAvailable: null,
      totalToOrder: 1,

      choosenProduct: '',
      choosenAddres: '',
      buttonNext: true,
      buttonParentVariant: true,
      buttonVariationSecond: true,
      buttonVariationFirst: true,
      addressList: [],

      listProduct: [],
    }
  },
  created() {
    this.dateValue = dateFormat(new Date(), 'yyyy-mm-dd')
    this.customerDate = dateFormat(this.dateValue, 'yyyy-mm-dd')
    this.date = formatFullDate(this.dateValue)
    this.getProfile()
    this.listProduct2 = this.listProduct
    this.$http_komship.delete(`v1/cart/clear/${this.profile.user_id}`)
  },
  methods: {
    async bulkStore() {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.itemsOrder.length; x++) {
        if (this.itemsOrder[x].itemsSelected.length > 0) {
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.itemsOrder[x].itemsSelected.length; y++) {
            this.$http_komship.delete(`v1/cart/clear/${this.profile.user_id}`)
              .then(async res => {
                if (res.data.code === 200) {
                  return this.$http_komship.post('v1/cart/bulk-store', {
                    params: {
                      product_id: this.itemsOrder[x].product_id,
                      product_name: this.itemsOrder[x].product_name,
                      variant_id: this.itemsOrder[x].itemsSelected[y].option_id,
                      variant_name: this.itemsOrder[x].itemsSelected[y].variation,
                      product_price: this.itemsOrder[x].itemsSelected[y].price,
                      qty: this.itemsOrder[x].itemsSelected[y].stockToDisplay,
                      subtotal: this.itemsOrder[x].itemsSelected[y].stockToDisplay * this.itemsOrder[x].itemsSelected[y].price,
                    },
                  })
                    .then(async result => {
                      if (result.data.code === 200) {
                        this.$router.push({ path: '/add-order/detail-checkout', query: { address_id: this.choosenAddres.value, date: this.dateValue } })
                      }
                    })
                }
                return this.cartId
              })
          }
        }
        if (this.itemsOrder[x].itemsSelected.length === 0) {
          this.$http_komship.delete(`v1/cart/clear/${this.profile.user_id}`)
            .then(async res => {
              if (res.data.code === 200) {
                return this.$http_komship.post('v1/cart/bulk-store', {
                  params: {
                    product_id: this.itemsOrder[x].product_id,
                    product_name: this.itemsOrder[x].product_name,
                    variant_id: 0,
                    variant_name: '',
                    product_price: this.itemsOrder[x].price,
                    qty: this.itemsOrder[x].stockToDisplayNoVariant,
                    subtotal: this.itemsOrder[x].stockToDisplayNoVariant * this.itemsOrder[x].price,
                  },
                })
                  .then(async result => {
                    if (result.data.code === 200) {
                      this.$router.push({ path: '/add-order/detail-checkout', query: { address_id: this.choosenAddres.value, date: this.dateValue } })
                    }
                  })
              }
              return this.cartId
            })
        }
      }
    },
    getProfile() {
      return this.$http_komship.post('v1/my-profile').then(response => {
        const { data } = response.data
        this.profile = data
        this.getAddress()
      }).catch(() => {
        // handle error
      })
    },
    getAddress() {
      httpKomship.get('/v1/address', {
        headers: { Authorization: `Bearer ${useJwt.getToken()}` },
      }).then(async response => {
        const { data } = response.data
        if (data.length === 0) this.$refs['modal-validate-address'].show()
        if (data.length !== 0) {
          const sortData = data.slice().sort((a, b) => b.is_default - a.is_default)
          this.addressList = await sortData.map(val => ({
            value: val.address_id,
            label: val.address_name,
          }))
          this.addressCount = this.addressList.length
          // eslint-disable-next-line prefer-destructuring
          this.choosenAddres = this.addressList[0]
          this.cekListProduct()
        }
      })
    },
    cekListProduct() {
      const partnerId = this.profile.partner_id
      return this.$http_komship.get(`v1/partner-product/${partnerId}`).then(response => {
        const { data } = response.data
        this.listProduct = data
        if (this.listProduct.length === 0) this.$refs['modal-validate-product'].show()
      }).catch(() => {
        // handle error
      })
    },
    chooseVariation(data) {
      this.buttonParentVariant = true
      this.buttonVariationFirst = true
      this.buttonVariationSecond = true
      if (this.nameFirstChildVariation !== '') this.nameFirstChildVariation = ''
      if (this.nameSecondChildVariation !== '') this.nameSecondChildVariation = ''
      if (this.itemFirstChildVariant !== []) this.itemFirstChildVariant = []
      if (this.itemSecondChildVariant !== []) this.itemSecondChildVariant = []
      if (this.isActiveVariant !== '') this.isActiveVariant = ''
      if (this.isActiveVariantFirstChild !== '') this.isActiveVariantFirstChild = ''
      if (this.isActiveVariantSecondChild !== '') this.isActiveVariantSecondChild = ''
      this.itemsChooseVariation = data

      if (data.item.variant[1] === undefined) {
        this.itemParentNoVariant = data
      }

      this.$root.$emit('bv::show::modal', 'modal-choose-variation')
    },
    selectParentVariation(itemsVariant, items) {
      this.buttonParentVariant = true
      this.buttonVariationFirst = true
      this.buttonVariationSecond = true

      if (this.itemFirstChildVariant !== []) this.itemFirstChildVariant = []
      if (this.itemSecondChildVariant !== []) this.itemSecondChildVariant = []
      if (this.nameSecondChildVariation !== '') this.nameSecondChildVariation = ''
      if (this.isActiveVariantFirstChild !== '') this.isActiveVariantFirstChild = ''
      if (this.isActiveVariantSecondChild !== '') this.isActiveVariantSecondChild = ''

      if (items.variant[1] !== undefined) {
        this.nameFirstChildVariation = items.variant[1].variant_name
        if (items.variant[2] !== undefined) {
          this.isActiveVariant = itemsVariant.option_name
          // eslint-disable-next-line no-plusplus
          for (let x = 0; x < items.variant[1].variant_option.length; x++) {
            if (items.variant[1].variant_option[x].option_parent === itemsVariant.option_id) {
              this.itemFirstChildVariant.push(items.variant[1].variant_option[x])
            }
          }
          this.variationProduct = itemsVariant.option_name
        } else if (items.variant[2] === undefined) {
        // eslint-disable-next-line no-plusplus
          for (let x = 0; x < items.product_variant.length; x++) {
            if (items.product_variant[x].parent === itemsVariant.option_id) {
              this.itemFirstChildVariant.push(items.product_variant[x])
            }
          }
          this.isActiveVariant = itemsVariant.option_name
          this.variationProduct = itemsVariant.option_name
          this.optionId = itemsVariant.options_id
          if (items.price !== undefined) this.price = itemsVariant.price
          if (items.stock !== undefined) this.stock = itemsVariant.stock
        }
      }
      if (items.variant[1] === undefined) {
        this.isActiveVariant = itemsVariant.name
        this.variationProduct = itemsVariant.name
        this.optionId = itemsVariant.options_id
        if (items.price !== undefined) this.price = itemsVariant.price
        if (items.stock !== undefined) this.stock = itemsVariant.stock
      }
      if (this.isActiveVariant === this.variationProduct) this.buttonParentVariant = false
    },
    selectVariationFirstChild(data, items) {
      if (this.itemSecondChildVariant !== []) {
        this.itemSecondChildVariant = []
      }

      if (items.variant[2] !== undefined) {
        this.isActiveVariantFirstChild = data.option_name
        this.variationProductFirstChild = data.option_name
        this.nameSecondChildVariation = items.variant[2].variant_name
        // eslint-disable-next-line no-plusplus
        for (let y = 0; y < items.variant[2].variant_option.length; y++) {
          if (items.variant[2].variant_option[y].option_parent === data.option_id) {
            this.itemSecondChildVariant.push(items.product_variant[y])
          }
        }
      }
      if (items.variant[2] === undefined) {
        this.isActiveVariantFirstChild = data.name
        this.variationProductFirstChild = data.name
        this.optionId = data.options_id
        if (items.price !== undefined) this.price = data.price
        if (items.stock !== undefined) this.stock = data.stock
      }
      if (this.isActiveVariantFirstChild === this.variationProductFirstChild) this.buttonVariationFirst = false
    },
    selectVariationSecondChild(items) {
      this.isActiveVariantSecondChild = items.name
      this.variationProductSecondChild = items.name
      this.optionId = items.options_id
      if (items.price !== undefined) this.price = items.price
      if (items.stock !== undefined) this.stock = items.stock
      if (this.isActiveVariantSecondChild === this.variationProductSecondChild) this.buttonVariationSecond = false
    },
    getNameVariantParent(data) {
      let nameVariant = ''
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < data.variant_option.length; x++) {
        if (data.variant_option[x].option_parent === 0) {
          nameVariant = data.variant_name
        }
      }
      return nameVariant
    },
    getNameFirstChildVariant(data) {
      let nameVariant = ''
      if (data.option_parent === 0) {
        nameVariant = data.option_name
      }
      return nameVariant
    },
    addOrderToTable(data) {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.itemsOrder.length; x++) {
        if (this.itemsOrder[x].product_name === data.product_name) {
          if (this.variationProductSecondChild !== null) {
            this.itemsOrder[x].itemsSelected.push(
              {
                option_id: this.optionId,
                variation: `${this.variationProduct}, ${this.variationProductFirstChild}, ${this.variationProductSecondChild}`,
                price: this.price,
                stock: this.stock,
                stockToDisplay: 1,
                total: this.total,
                subtotal: this.subtotal,
              },
            )
          }
          if (this.variationProductSecondChild === null && this.variationProductFirstChild !== null) {
            this.itemsOrder[x].itemsSelected.push(
              {
                option_id: this.optionId,
                variation: `${this.variationProduct}, ${this.variationProductFirstChild}`,
                price: this.price,
                stock: this.stock,
                stockToDisplay: 1,
                total: this.total,
                subtotal: this.subtotal,
              },
            )
          }
          if (this.variationProductSecondChild === null && this.variationProductFirstChild === null) {
            this.itemsOrder[x].itemsSelected.push(
              {
                option_id: this.optionId,
                variation: `${this.variationProduct}`,
                price: this.price,
                stock: this.stock,
                stockToDisplay: 1,
                total: this.total,
                subtotal: this.subtotal,
              },
            )
          }
        }
      }
      // this.stockAvailable = data.itemSelected.stock - 1
      this.$refs.tableAddOrderOne.refresh()
      this.nextButtonIsActive()
      this.choosenProduct = ''
      this.$root.$emit('bv::hide::modal', 'modal-choose-variation')
    },
    addTotalToOrder(itemsVariation, data) {
      if (data !== undefined) {
        // eslint-disable-next-line no-param-reassign
        itemsVariation.stockToDisplay += 1
        // eslint-disable-next-line no-param-reassign
        itemsVariation.stock -= 1
        this.$refs.tableAddOrderOne.refresh()
      } else {
        // eslint-disable-next-line no-param-reassign
        itemsVariation.item.stockToDisplayNoVariant += 1
        // eslint-disable-next-line no-param-reassign
        itemsVariation.item.stock -= 1
      }
    },
    reduceTotalToOrder(itemsVariation, data) {
      if (data !== undefined) {
        // eslint-disable-next-line no-param-reassign
        itemsVariation.stockToDisplay -= 1
        // eslint-disable-next-line no-param-reassign
        itemsVariation.stock += 1
        this.$refs.tableAddOrderOne.refresh()
        if (itemsVariation.stockToDisplay < 1) {
          // eslint-disable-next-line no-plusplus
          for (let x = 0; x < data.item.itemsSelected.length; x++) {
            if (itemsVariation.option_id === data.item.itemsSelected[x].option_id) {
              data.item.itemsSelected.splice(x, 1)
            }
          }
          // this.itemsOrder.splice(data.index, 1)
          this.choosenProduct = ''
          this.listProduct2.unshift(data.item)
          this.productCount = this.listProduct.length
          this.$refs.tableAddOrderOne.refresh()
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        itemsVariation.item.stockToDisplayNoVariant -= 1
        // eslint-disable-next-line no-param-reassign
        itemsVariation.item.stock += 1
        this.$refs.tableAddOrderOne.refresh()
        if (itemsVariation.item.stockToDisplayNoVariant < 1) {
          this.itemsOrder.splice(itemsVariation.item.index, 1)
          this.choosenProduct = ''
          this.listProduct2.unshift(itemsVariation.item)
          this.productCount = this.listProduct.length
          this.$refs.tableAddOrderOne.refresh()
        }
      }
    },
    disableNextButton() {
      let result = true
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.itemsOrder.length; x++) {
        if (!this.itemsOrder[x].itemSelected) {
          result = true
        } else {
          result = false
        }
      }
      return result
    },
    onChangeDate(ctx) {
      this.dateLabel = changeDate(ctx.activeYMD)
      this.dateValue = ctx.activeYMD
      this.$emit('onUpdateDate', ctx.activeYMD)
    },
    handleShowVariationPopUp(productData) {
      this.selectedVariation = productData
      this.$root.$emit('bv::show::modal', 'modal-1')
    },
    findVariantIndex(variantName, variantList) {
      if (variantList && variantList.length && variantList.length > 0 && variantName !== '') {
        let variantIndex = -1
        for (let j = 0; j < variantList.length; j += 1) {
          if (variantList[j] && variantList[j].name && variantList[j].name === variantName) {
            variantIndex = j
          }
        }
        return variantIndex
      }
      return -1
    },
    updateSelectedVariation(variantSelected) {
      const currentSelectedVariation = this.selectedVariation
      for (let i = 0; i < currentSelectedVariation.variant.length; i += 1) { /* loop on selected product */
        if (currentSelectedVariation.variant[i] && currentSelectedVariation.variant[i] && variantSelected) {
          if (currentSelectedVariation.variant[i].variant_option) {
            for (let j = 0; j < currentSelectedVariation.variant[i].variant_option.length; j += 1) { /* loop on variant items of product */
              const searchParentIndex = this.findVariantIndex(currentSelectedVariation.variant[i].variant_option[j].option_name, currentSelectedVariation.selectedVariationData)
              if (currentSelectedVariation.variant[i].variant_option[j].option_name === variantSelected.option_name) {
                const variantSelectedIndex = this.findVariantIndex(variantSelected.option_name, currentSelectedVariation.product_variant)
                if (variantSelectedIndex > -1) {
                  const variantIndexOnSelected = this.findVariantIndex(variantSelected.option_name, currentSelectedVariation.selectedVariationData)
                  if (variantIndexOnSelected > -1) {
                    currentSelectedVariation.selectedVariationData.splice(variantIndexOnSelected, 1)
                    currentSelectedVariation.selectedVariationData.push({ ...currentSelectedVariation.product_variant[variantSelectedIndex] })
                  } else if (variantIndexOnSelected < 0) {
                    currentSelectedVariation.selectedVariationData.push({ ...currentSelectedVariation.product_variant[variantSelectedIndex] })
                  }
                }
              } else if (searchParentIndex > -1) { /* allow only one variant selected */
                currentSelectedVariation.selectedVariationData.splice(searchParentIndex, 1)
              }
            }
          }
        }
      }
      this.selectedVariation = currentSelectedVariation
      this.$forceUpdate()
    },
    handleUpdateSelectedVariationInsideList(productData) {
      this.selectedItems = this.updateAllSelectedProduct(productData, this.selectedItems)
      /* reset the variable after update the variation option : when user click ok button on variation popup */
      this.$root.$emit('bv::hide::modal', 'modal-1')
      this.resetTmpContainerOnTable()
      this.onUpdateSelectedItemsOnParent()
      this.checkValidButton()
      this.$refs.tableAddOrderOne.refreshTable()
    },
    onChangeAddress(item) {
      this.choosenAddres = item
    },
    onAddProduct(itemSelected) {
      // eslint-disable-next-line no-plusplus
      for (let x = 0; x < this.listProduct2.length; x++) {
        if (this.listProduct2[x].product_name === itemSelected.product_name) {
          this.listProduct2.splice(x, 1)
        }
      }
      Object.assign(itemSelected, { stockToDisplayNoVariant: 1 })
      if (itemSelected.itemSelected !== undefined) {
        // eslint-disable-next-line no-param-reassign
        delete itemSelected.itemSelected
      }
      if (itemSelected) {
        Object.assign(itemSelected, { itemsSelected: [] })
        this.itemsOrder.push(itemSelected)
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.itemsOrder.length; x++) {
          if (this.itemsOrder[x].variant[0] === undefined) {
            this.stockAvailable = this.itemsOrder[x].stock - 1
          }
          // eslint-disable-next-line no-plusplus
          for (let y = 0; y < this.listProduct.length; y++) {
            if (this.itemsOrder[x].product_id === this.listProduct[y].product_id) {
              this.listProduct.splice(y, 1)
            }
          }
        }
      } else if (itemSelected === null) {
        this.itemsOrder.splice(1, 1)
      }
      this.choosenProduct = ''
      this.nextButtonIsActive()
    },
    updateAllSelectedProduct(newItemToPush, oldListSelected) {
      if (newItemToPush && oldListSelected && oldListSelected.length && oldListSelected.length > 0) {
        let newListSelected = oldListSelected
        let sameStock = 0
        for (let j = 0; j < newListSelected.length; j += 1) {
          /* update the current selected list item */
          if (newListSelected && newListSelected[j] && newListSelected[j].id && newListSelected[j].id === newItemToPush.id) {
            /* update all stock based on variant */
            if (newListSelected[j].is_variant && newListSelected[j].stockDisplay < 1 && newListSelected[j].stockDisplay === 0) {
              newListSelected[j].stockDisplay = this.genStockByVariant(newListSelected[j].selectedVariationData)
            }
          }
          /* generate same stock to set it later */
          if (newListSelected[j].product_name === newItemToPush.product_name
            && JSON.stringify(newListSelected[j].selectedVariationData) === JSON.stringify(newItemToPush.selectedVariationData)
          ) {
            sameStock += newListSelected[j].input
          }
        }
        newListSelected = this.updateAllSameStock(sameStock, newItemToPush, newListSelected)
        return newListSelected
      }
      return oldListSelected
    },
    updateAllSameStock(sameStock, newItemToPush, listData) {
      const newListSelected = listData
      for (let j = 0; j < listData.length; j += 1) {
        /* update all same product with same stock */
        const fullStock = newItemToPush.is_variant ? this.genStockByVariant(newListSelected[j].selectedVariationData) : newItemToPush.stock
        if (newListSelected[j].product_name === newItemToPush.product_name
          && JSON.stringify(newListSelected[j].selectedVariationData) === JSON.stringify(newItemToPush.selectedVariationData)
        ) {
          newListSelected[j].stockDisplay = fullStock - sameStock
        }
      }
      return newListSelected
    },
    genStockByVariant(pointedVariant) {
      if (pointedVariant && pointedVariant.length && pointedVariant.length > 0) {
        let newStock = 0
        for (let j = 0; j < pointedVariant.length; j += 1) {
          if (pointedVariant[j]) {
            newStock += pointedVariant[j].stock
          }
        }
        return newStock
      }
      return 0
    },
    checkStock(currentInput, nameToFind, variantList) {
      if (variantList && variantList.length && variantList.length > 0 && nameToFind !== '') {
        let isStockAvailable = false
        for (let j = 0; j < variantList.length; j += 1) {
          if (variantList[j] && variantList[j].name && variantList[j].name === nameToFind) {
            isStockAvailable = ((variantList[j].stock - currentInput) > 0)
          }
        }
        return isStockAvailable
      }
      return false
    },
    onChangeSelectedProduct(param, itemSelectedIndex, itemSelected) {
      if (itemSelected) {
        let currentAmount = itemSelected.input
        currentAmount = param === '-' ? (currentAmount - 1) : (currentAmount + 1)
        if (currentAmount === 0) {
          this.selectedItems.splice(itemSelectedIndex, 1)
        } else {
          this.selectedItems[itemSelectedIndex].input = currentAmount
        }
        /* update all product with same characteristics */
        this.selectedItems = this.updateAllSelectedProduct(itemSelected, this.selectedItems)
        this.onUpdateSelectedItemsOnParent()
        this.checkValidButton()
      }
    },
    onUpdateSelectedItemsOnParent() {
      this.$emit('onUpdateSelectedItems', this.selectedItems)
    },
    onUpdateScreenViewParent() {
      const newInputScreen = this.screens === 'input' ? 'details' : 'input'
      this.selectedItems = this.itemsOrder
      this.$emit('onUpdateScreenView', newInputScreen)
    },
    deleteAllSelectedItems() {
      this.selectedItems = []
      this.itemsOrder = []

      this.productCount = null
      this.resetTmpContainerOnTable()
      this.onUpdateSelectedItemsOnParent()
    },
    resetTmpContainerOnTable() {
      this.selectedVariation = []
      this.selectedProdukIndexOnModal = 0
      this.selectedProdukIndexOnModal = -1
    },
    checkValidButton() {
      let isDisable = true
      const conditionArr = []
      if (this.selectedItems && this.selectedItems.length && this.selectedItems.length > 0) {
        for (let j = 0; j < this.selectedItems.length; j += 1) {
          if (this.selectedItems[j].is_variant) {
            if (this.selectedItems[j].selectedVariationData && this.selectedItems[j].selectedVariationData.length && this.selectedItems[j].selectedVariationData.length > 0) {
              conditionArr.push(true)
            } else {
              conditionArr.push(false)
            }
          } else {
            conditionArr.push(true)
          }
        }
        isDisable = (conditionArr.indexOf(false) > -1)
      }
      this.disableSubmitBtn = isDisable
      this.onUpdateEnableSubmitButton(this.disableSubmitBtn)
    },
    onUpdateEnableSubmitButton(value) {
      this.$emit('onUpdateSubmitButtonStatus', value)
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    nextButtonIsActive() {
      this.itemsOrder.every(this.checkButtonNextIsActive)
    },
    checkButtonNextIsActive(data) {
      if (data.variant[0] !== undefined) {
        if (data.itemsSelected[0] !== undefined) {
          this.buttonNext = false
        } else {
          this.buttonNext = true
        }
      }
      if (data.variant[0] === undefined) {
        this.buttonNext = false
      }
    },
    disableButtonAddOrderToTable() {
      let result = true
      if (this.itemsChooseVariation.item.variant.length === 3) {
        if (this.buttonParentVariant === false && this.buttonVariationFirst === false && this.buttonVariationSecond === false) {
          result = false
        } else {
          result = true
        }
      } else if (this.itemsChooseVariation.item.variant.length === 2) {
        if (this.buttonParentVariant === false && this.buttonVariationFirst === false) {
          result = false
        } else {
          result = true
        }
      } else if (this.itemsChooseVariation.item.variant.length === 1) {
        if (this.buttonParentVariant === false) {
          result = false
        } else {
          result = true
        }
      }
      return result
    },
    getStockToDisplay(value) {
      return value - 1
    },
    handleDisableVariation(itemsVariant, items) {
      let result = false
      if (items.itemsSelected[0] !== undefined) {
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < items.itemsSelected.length; x++) {
          if (items.itemsSelected[x].option_id === itemsVariant.options_id) {
            result = true
          }
        }
      }
      return result
    },
    handleRemoveProductOnList(data) {
      this.itemsOrder.splice(data.index, 1)
      this.listProduct.unshift(data.item)
    },
  },
}
</script>
<style scoped>
  [dir] .delete-product-to-order {
    border: 0px!important;
  }
</style>
