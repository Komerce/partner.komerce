<template>
  <div class="add-order-main-wrapper">
    <b-card-title class="mb-4">
      Tambah Order
    </b-card-title>
    <div class="add-order-dsc-title top-right">
      {{ profile && profile.is_komship === 1 ? 'Pengiriman Kompship' : 'Pengiriman Non Kompship' }}
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
          v-model="productSelect"
          class="add-order-product-input"
          label="product_name"
          label-cols-md="2"
          :options="listProduct"
          @input="onAddProduct"
        />
      </b-form-group>
    </section>

    <add-order-table
      ref="tableAddOrderOne"
      :items="selectedItems"
      :fields="fields"
      table-ref-name="tableAddOrder"
      :is-editable="true"
      @onShowPopUp="handleShowVariationPopUp"
      @onAddTotalItem="onChangeSelectedProduct"
    />

    <section class="view-order-summary">
      <div class="add-order-summary-text">
        <span>
          {{ selectedItems.length }}
        </span> Produk ditambahkan
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
          :disabled="disableSubmitBtn"
          @click="onUpdateScreenViewParent"
        >
          Lanjutkan
        </b-button>
      </div>
    </section>
    <b-modal
      id="modal-1"
      ref="modalVariationAddOrder"
      hide-footer
      hide-header
      centered
      no-close-on-backdrop
    >
      <div class="modal-add-order-variation">
        <b-form-group
          v-for="(selectedVar, indexVar) in selectedVariation.variant"
          :key="indexVar+'selectedVar'"
        >
          <label :for="indexVar+'selectedVar'">{{ selectedVar.variant_name }}</label>
          <b-button
            v-for="(selectedVarItem, indexVarItem) in selectedVar.variant_option"
            :key="indexVarItem+'selectedVarItem'"
            :class="'add-order-modal-header-item-button' + (findVariantIndex(selectedVarItem.option_name, selectedVariation.selectedVariationData) > -1 ? ' add-order-modal-selected' : '')"
            :disabled="!checkStock(selectedVariation.input, selectedVarItem.option_name, selectedVariation.product_variant)"
            @click="updateSelectedVariation(selectedVarItem)"
          >
            {{ selectedVarItem.option_name }}
          </b-button>
        </b-form-group>
        <div class="add-order-variation-modal-submit">
          <b-button
            class="next-button"
            @click="() => handleUpdateSelectedVariationInsideList(selectedVariation)"
          >
            Ok
          </b-button>
        </div>
      </div>
    </b-modal>
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
import AddOrderTable from './AddOrderTable.vue'

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
    AddOrderTable,
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
      productSelect: '',
    }
  },
  methods: {
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
      if (itemSelected) {
        const currentIndex = this.selectedItems.length + 1
        let container = {}
        let selectedItemsContainer = []
        container = itemSelected
        selectedItemsContainer = this.selectedItems
        container.no = currentIndex
        container.id = `selectedProduct${itemSelected.product_id + (Math.floor(Math.random() * 1000))}`
        container.selectedVariationData = []
        container.input = 1
        container.stockDisplay = itemSelected.stock
        container.isStockExist = itemSelected.is_variant === '0' ? (countStock(itemSelected.product_variant) > 0) : (itemSelected.stock > 0)
        const findIndex = checkSameById(container.id, this.selectedItems)
        if (findIndex < 0) { /* push new item */
          selectedItemsContainer.push({ ...container })
        } else {
          selectedItemsContainer.push({ ...container })
        }
        this.selectedItems = selectedItemsContainer
        if (itemSelected.is_variant === '0') {
          this.selectedItems = this.updateAllSelectedProduct(itemSelected, this.selectedItems)
        }
        this.onUpdateSelectedItemsOnParent()
        this.checkValidButton()
        this.$refs.tableAddOrderOne.refreshTable()
      }
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
  },
}
</script>
