<template>
  <div class="add-order-main-wrapper">
    <b-card-title class="mb-4">
      Tambah Order
    </b-card-title>
    <div class="add-order-dsc-title top-right">
      {{ profile && profile.is_komship === 1 ? 'Pengiriman Komship' : 'Pengiriman Non Komship' }}
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
          class="add-order-date-button"
          button-only
          @context="onChangeDate"
        >
          <template v-slot:button-content>
            <img src="@/assets/images/icons/date-picker-icon.svg">
          </template>
        </b-form-datepicker>
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
          :options="listProduct"
          @input="onAddProduct"
        />
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
            />
          </b-col>
          <b-col cols="auto">
            <h4>
              <strong>
                {{ data.value }}
              </strong>
            </h4>
            <div v-if="data.item.itemSelected === undefined && data.item.variant[0] !== undefined">
              <b-button
                variant="outline-primary"
                class="btn-icon"
                @click="chooseVariation(data)"
              >
                Pilih variasi
              </b-button>
            </div>
            <div v-if="data.item.variant[0] === undefined">
              <h5>
                <strong>
                  Tidak ada variasi
                </strong>
              </h5>
            </div>
            <div v-if="data.item.itemSelected !== undefined">
              <h4 class="text-primary">
                <strong>
                  {{ data.item.itemSelected.variation }}
                </strong>
              </h4>
            </div>
          </b-col>
        </b-row>
      </template>

      <template #cell(price)="data">
        <div v-if="data.item.itemSelected !== undefined">
          <h4>
            <strong>
              Rp. {{ formatPrice(data.item.itemSelected.price) }}
            </strong>
          </h4>
        </div>
        <div v-else-if="data.item.variant[0] === undefined">
          <h4>
            <strong>
              Rp. {{ formatPrice(data.item.price) }}
            </strong>
          </h4>
        </div>
        <div v-else>
          <h4>
            <strong>
              0
            </strong>
          </h4>
        </div>
      </template>

      <template #cell(jumlah)="data">
        <div v-if="data.item.itemSelected !== undefined">
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
                {{ data.item.stockToDisplay }}
              </strong>
            </h4>
            <b-button
              variant="outline-primary"
              class="plus-button"
              :disabled="data.item.itemSelected.stock === 0"
              @click="addTotalToOrder(data)"
            >
              +
            </b-button>
          </b-row>
          <b-row class="justify-content-center">
            <h5 class="text-primary">
              Stock tersedia: {{ data.item.itemSelected.stock }}
            </h5>
          </b-row>
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
                {{ data.item.stockToDisplay }}
              </strong>
            </h4>
            <b-button
              variant="outline-primary"
              class="plus-button"
              :disabled="data.item.stock === 0"
              @click="addTotalToOrder(data)"
            >
              +
            </b-button>
          </b-row>
          <b-row class="justify-content-center">
            <h5 class="text-primary">
              Stock tersedia: {{ data.item.stock }}
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

      <template #cell(subtotal)="data">
        <div v-if="data.item.variant[0] === undefined">
          <h4>
            <strong>
              Rp. {{ formatPrice(data.item.price * data.item.stockToDisplay) }}
            </strong>
          </h4>
        </div>
        <div v-else-if="data.item.itemSelected !== undefined">
          <h4>
            <strong>
              Rp. {{ formatPrice(data.item.itemSelected.price * data.item.stockToDisplay) }}
            </strong>
          </h4>
        </div>
        <div v-else>
          <h4>
            <strong>
              Rp. {{ formatPrice(data.item.price * data.item.stockToDisplay) }}
            </strong>
          </h4>
        </div>
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
              @click="selectVariationSecondChild(itemsVariant)"
            >
              {{ itemsVariant.name }}
            </b-button>
          </div>
        </b-row>
      </div>

      <div v-if="itemSecondChildVariant !== []">
        <b-row class="d-flex justify-content-end">
          <b-button
            variant="primary"
            class="btn-icon mr-3 mb-2"
            @click="addOrderToTable(itemsChooseVariation.item)"
          >
            Ok
          </b-button>
        </b-row>
      </div>

      <div v-else>
        <b-row class="d-flex justify-content-end">
          <b-button
            variant="primary"
            class="btn-icon mr-3 mb-2"
            :disabled="checkButtonVariationSecondIsActive()"
            @click="addOrderToTable(itemsChooseVariation.item)"
          >
            Ok
          </b-button>
        </b-row>
      </div>

    </b-modal>

    <section class="view-order-summary">
      <div class="add-order-summary-text">
        <span>{{ itemsOrder.length }}</span> Produk ditambahkan
      </div>
      <div class="add-order-summary-button-wrapper">
        <b-button
          v-if="selectedItems.length > 0"
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
          tag="router-link"
          :to="{ name: $route.meta.routeDetail, params: { itemsOrder } }"
        >
          Lanjutkan
        </b-button>
      </div>
    </section>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import {
  BCardTitle,
  BFormDatepicker,
  BFormGroup,
  BButton,
} from 'bootstrap-vue'
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
function checkSameById(itemId, listData) {
  const index = -1
  for (let i = 0; i < listData.length; i += 1) {
    if (listData && listData[i] && listData[i].id && listData[i].id === itemId) return i
  }
  return index
}
function countStock(listData) {
  if (listData && listData.length && listData.length > 0) {
    let stockAmount = -1
    for (let i = 0; i < listData.length; i += 1) {
      if (listData[i].stock) {
        stockAmount += listData[i].stock
      }
    }
    return stockAmount
  }
  return -1
}
export default {
  components: {
    BCardTitle,
    BFormDatepicker,
    BFormGroup,
    BButton,
    vSelect,
    // AddOrderTable,
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
    listProduct: {
      type: Array,
      default: () => [],
    },
    listSelected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dateValue: this.dateText,
      dateLabel: '',
      fields: [
        { key: 'no', label: 'No' },
        { key: 'product_name', label: 'Nama Produk' },
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
          key: 'price',
          label: 'Harga Satuan',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'jumlah',
          label: 'Jumlah',
        },
        {
          key: 'subtotal',
          label: 'Subtotal',
          tdClass: 'text-center',
          thClass: 'text-center',
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

      buttonNext: true,
      buttonVariationSecond: true,
      buttonVariationFirst: true,
    }
  },
  methods: {
    chooseVariation(data) {
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
      console.log('items')
      console.log(items)
      console.log('itemsVariant')
      console.log(itemsVariant)
      if (this.itemFirstChildVariant !== []) {
        this.itemFirstChildVariant = []
      }
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
      this.checkButtonVariationSecondIsActive()
    },
    selectVariationSecondChild(items) {
      this.isActiveVariantSecondChild = items.name
      this.variationProductSecondChild = items.name
      this.optionId = items.options_id
      if (items.price !== undefined) this.price = items.price
      if (items.stock !== undefined) this.stock = items.stock
      // this.checkButtonVariationSecondIsActive()
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
            Object.assign(this.itemsOrder[x],
              {
                itemSelected: {
                  option_id: this.optionId,
                  variation: `${this.variationProduct}, ${this.variationProductFirstChild}, ${this.variationProductSecondChild}`,
                  price: this.price,
                  stock: this.stock,
                  total: this.total,
                  subtotal: this.subtotal,
                },
              })
          }
          if (this.variationProductSecondChild === null && this.variationProductFirstChild !== null) {
            Object.assign(this.itemsOrder[x],
              {
                itemSelected: {
                  option_id: this.optionId,
                  variation: `${this.variationProduct}, ${this.variationProductFirstChild}`,
                  price: this.price,
                  stock: this.stock,
                  total: this.total,
                  subtotal: this.subtotal,
                },
              })
          }
          if (this.variationProductSecondChild === null && this.variationProductFirstChild === null) {
            Object.assign(this.itemsOrder[x],
              {
                itemSelected: {
                  option_id: this.optionId,
                  variation: `${this.variationProduct}`,
                  price: this.price,
                  stock: this.stock,
                  total: this.total,
                  subtotal: this.subtotal,
                },
              })
          }
        }
      }
      console.log(data)
      this.stockAvailable = data.itemSelected.stock - 1
      this.$refs.tableAddOrderOne.refresh()
      this.nextButtonIsActive()
      this.$root.$emit('bv::hide::modal', 'modal-choose-variation')
    },
    addTotalToOrder(data) {
      // eslint-disable-next-line no-param-reassign
      data.item.stockToDisplay += 1
      if (data.item.itemSelected !== undefined) {
        // eslint-disable-next-line no-param-reassign
        data.item.itemSelected.stock -= 1
        this.$refs.tableAddOrderOne.refresh()
      } else {
        // eslint-disable-next-line no-param-reassign
        data.item.stock -= 1
      }
    },
    reduceTotalToOrder(data) {
      // eslint-disable-next-line no-param-reassign
      data.item.stockToDisplay -= 1
      if (data.item.itemSelected !== undefined) {
        // eslint-disable-next-line no-param-reassign
        data.item.itemSelected.stock += 1
        this.$refs.tableAddOrderOne.refresh()
      } else {
        // eslint-disable-next-line no-param-reassign
        data.item.stock += 1
      }
      if (data.item.stockToDisplay < 1) {
        this.itemsOrder.splice(data.index, 1)
        this.choosenProduct = ''
        this.$refs.tableAddOrderOne.refresh()
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
      if (ctx && ctx.activeYMD) {
        this.dateLabel = changeDate(ctx.activeYMD)
        this.$emit('onUpdateDate', ctx.activeYMD)
      }
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
    onAddProduct(itemSelected) {
      Object.assign(itemSelected, { stockToDisplay: 1 })
      if (itemSelected.itemSelected !== undefined) {
        // eslint-disable-next-line no-param-reassign
        delete itemSelected.itemSelected
      }
      if (itemSelected) {
        this.itemsOrder.push(itemSelected)
        // eslint-disable-next-line no-plusplus
        for (let x = 0; x < this.itemsOrder.length; x++) {
          if (this.itemsOrder[x].variant[0] === undefined) {
            this.stockAvailable = this.itemsOrder[x].stock - 1
          }
        }
        console.log(this.itemsOrder)
      } else if (itemSelected === null) {
        this.itemsOrder.splice(1, 1)
      }
      this.nextButtonIsActive()
    },
    updateAllSelectedProduct(newItemToPush, oldListSelected) {
      console.log('newItemToPush')
      console.log(newItemToPush)
      console.log('oldListSelected')
      console.log(oldListSelected)
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
        const fullStock = newItemToPush.is_variant !== '0' ? this.genStockByVariant(newListSelected[j].selectedVariationData) : newItemToPush.stock
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
      console.log('onChangeSelectedProduct')
      console.log(itemSelected)
      if (itemSelected) {
        let currentAmount = itemSelected.input
        console.log(param)
        console.log(currentAmount = param === '-' ? (currentAmount - 1) : (currentAmount + 1))
        console.log('current amount')
        console.log(currentAmount)
        if (currentAmount === 0) {
          this.selectedItems.splice(itemSelectedIndex, 1)
          this.productSelect = ''
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
          if (this.selectedItems[j].is_variant !== '0') {
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
        if (data.itemSelected !== undefined) {
          console.log('false')
          this.buttonNext = false
        } else {
          console.log('true')
          this.buttonNext = true
        }
      }
    },
    checkButtonVariationSecondIsActive() {
      let finalResult = true
      this.itemSecondChildVariant.every(this.checkButtonVariationSecond)
      if (this.buttonVariationSecond === false) {
        finalResult = false
      } else {
        finalResult = true
      }
      console.log(this.isActiveVariantSecondChild)
      return finalResult
    },
    checkButtonVariationSecond(data) {
      if (data.name === this.isActiveVariantSecondChild) {
        this.buttonVariationSecond = false
      } else {
        this.buttonVariationSecond = true
      }
    },
  },
}
</script>
<style scoped>

</style>
