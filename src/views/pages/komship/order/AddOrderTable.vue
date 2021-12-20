<template>
  <section :class="isEditable ? 'view-order-table' : 'view-order-table-no-edit'">
    <b-table
      :ref="tableRefName"
      :items="items"
      :fields="fields"
      class="add-order-table"
      responsive
    >
      <template
        v-if="!isEditable"
        #head(input)="totalData"
      >
        <div class="div-mid-text">
          {{ totalData.label }}
        </div>
      </template>
      <template #cell(product_name)="nameData">
        <div class="add-product-name-wrapper">
          <div class="product-name-img-wrapper">
            <img :src="nameData.item.product_image">
          </div>
          <div class="product-name-desc">
            <div class="product-name-text">
              {{ nameData.value }}
            </div>
            <div v-if="isEditable && nameData.item.is_variant && nameData.item.selectedVariationData.length < 1 && nameData.item.product_variant.length > 0">
              <b-button
                v-if="isEditable && nameData.item.is_variant && nameData.item.selectedVariationData.length < 1"
                class="product-name-button"
                variant="outline-primary"
                @click="handleShowVariation(nameData.item)"
              >
                Pilih Variasi
              </b-button>
            </div>
            <div v-if="nameData.item.product_variant.length === 0">
              Tidak Ada Variasi
            </div>
            <div
              v-if="isEditable && nameData.item.selectedVariationData.length > 0"
              class="variation-text-content"
            >
              Variasi : {{ genVariantText(nameData.item.selectedVariationData) }}
            </div>
            <div
              v-if="!isEditable && nameData.item.selectedVariationData.length > 0"
              class="variation-text-content"
            >
              Variasi : {{ genVariantText(nameData.item.selectedVariationData) }}
            </div>
          </div>
        </div>
      </template>

      <template #cell(price)="priceData">
        {{ priceData.item.is_variant !== '0' ? `Rp ${numberWithCommas(genPriceText(priceData.item.selectedVariationData))}` : `Rp ${numberWithCommas(priceData.item.price)}` }}
      </template>

      <template #cell(input)="inputData">
        <div class="add-product-total-wrapper">
          <div
            v-if="isEditable"
            class="product-total-input-wrapper"
          >
            <b-button
              v-if="inputData.item.is_variant === '0' || (inputData.item.is_variant && inputData.item.selectedVariationData.length > 0)"
              class="minus-button"
              variant="outline-primary"
              @click="addTotalItem('-', inputData.index, inputData.item)"
            >
              -
            </b-button>
            <div class="input-text">
              {{ inputData.value }}
            </div>
            <b-button
              v-if="inputData.item.is_variant === '0' || (inputData.item.is_variant && inputData.item.selectedVariationData.length > 0)"
              class="plus-button"
              variant="outline-primary"
              :disabled="inputData.item.stockDisplay === 0 || inputData.value >= 10"
              @click="addTotalItem('+', inputData.index, inputData.item)"
            >
              +
            </b-button>
          </div>
          <div
            v-if="isEditable && (inputData.item.is_variant !== '0' ? inputData.item.stockDisplay > 0 : true)"
            class="product-stock-input"
          >
            {{ `Stok tersedia: ${inputData.item.is_variant !== '0' ? inputData.item.stockDisplay : inputData.item.stockDisplay}` }}
          </div>
          <div
            v-if="!isEditable"
            class="product-total-input-wrapper no-mg"
          >
            <div class="input-text div-mid-text">
              {{ inputData.value }}
            </div>
          </div>
        </div>
      </template>

      <template #cell(subtotal)="subtotalData">
        {{ subtotalData.item.is_variant !== '0' ? `Rp ${numberWithCommas(genPriceText(subtotalData.item.selectedVariationData) * subtotalData.item.input)}` : `Rp ${numberWithCommas(subtotalData.item.price * subtotalData.item.input)}` }}
      </template>
    </b-table>
  </section>
</template>

<script>
import {
  BTable,
  BButton,
} from 'bootstrap-vue'

export default {
  components: {
    BTable,
    BButton,
  },
  props: {
    tableRefName: {
      type: String,
      default: 'tableOne',
    },
    fields: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    addTotalItem(param, itemSelectedIndex, itemSelected) {
      this.$emit('onAddTotalItem', param, itemSelectedIndex, itemSelected)
    },
    handleShowVariation(selectedProduct) {
      this.$emit('onShowPopUp', selectedProduct)
    },
    refreshTable() {
      this.$refs[this.tableRefName].refresh()
    },
    genVariantText(varArr) {
      if (varArr && varArr.length && varArr.length > 0) {
        let newText = ''
        for (let i = 0; i < varArr.length; i += 1) {
          newText += varArr[i].name + (i !== (varArr.length - 1) ? ', ' : '')
        }
        return newText
      }
      return ''
    },
    genPriceText(pointedVariant) {
      if (pointedVariant && pointedVariant.length && pointedVariant.length > 0) {
        let newPrice = 0
        for (let j = 0; j < pointedVariant.length; j += 1) {
          if (pointedVariant[j]) {
            newPrice += pointedVariant[j].price
          }
        }
        return newPrice
      }
      return 0
    },
    genStockText(pointedVariant) {
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
    numberWithCommas(x) {
      if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.')
      return x
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
  },
}

</script>

<style>

</style>
