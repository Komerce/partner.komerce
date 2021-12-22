<template>
  <div class="add-pickup-table-wrapper">
    <div class="add-pickup-table-title">
      Orderan
    </div>
    <div
      class="add-pickup-table-content-animated"
      :style="{ maxHeight: (isExpand ? (items && items.length ? `${ (items.length * 100.15) + 43.85 }px` : '100%') : '244.15px') }"
    >
      <b-table
        :fields="fields"
        :items="items"
        borderless
      >

        <template #head(qty)="data">
          <div class="add-pickup-header-table-qty">
            {{ data.label }}
          </div>
        </template>

        <template #cell(product)="productData">
          <div
            v-for="(prodItem, prodIndex) in productData.value"
            :key="prodIndex+'prodItem'"
            class="product-item-wrapper"
          >
            <div class="product-name-img-wrapper">
              <img :src="prodItem.product_image">
            </div>
            <div class="product-name-wrapper">
              <div class="product-name-content">
                <div class="product-name-text">
                  {{ prodItem.product_name }}
                </div>
                <div class="product-name-variant-wrapper org-text">
                  {{ (prodItem && prodItem.variant_name) ? (prodItem.variant_name.replace(' -', ',')) : ((prodItem && prodItem.product_variant_name) ? (prodItem.product_variant_name.replace(' -', ',')) : '') }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #cell(qty)="jumlahData">
          <div
            v-for="(prodItem, prodIndex) in jumlahData.item.product"
            :key="prodIndex+'jumlahProdukItem'"
            class="product-item-wrapper total-product-item-wrapper-on-pickup"
          >
            <div class="product-name-qty">
              {{ `x${prodItem.qty}` }}
            </div>
          </div>
        </template>

      </b-table>
    </div>

    <div
      v-if="items.length === 0"
      class="add-pickup-input-notice-empty"
    >
      <div class="add-pickup-input-notice-title">
        Pilih orderan  yang akan di pickup
      </div>
      <div class="add-pickup-input-notice-button">
        <b-button
          class="org-button"
          @click="onChooseOrder"
        >
          Pilih Orderan
        </b-button>
      </div>
    </div>

    <div
      v-else
      class="add-pickup-input-notice-filled mb-2"
    >
      <div
        :class="`add-pickup-input-notice-filled-button ${ items && items.length && items.length < 3 ? 'hide-details-button' : '' }`"
        @click="handleOpenDetailView"
      >
        Lihat detail...
      </div>
      <div class="add-pickup-input-notice-filled-desc">
        Total Produk : <span class="ml-2">{{ genTotalAmount(items) }}</span>
      </div>
    </div>
  </div>
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
    fields: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isExpand: false,
    }
  },
  methods: {
    handleOpenDetailView() {
      this.isExpand = !this.isExpand
    },
    onChooseOrder() {
      this.$emit('onChooseOrder')
    },
    genTotalAmount(arrValue) {
      let amount = 0
      for (let i = 0; i < arrValue.length; i += 1) {
        if (arrValue[i] && arrValue[i].product && arrValue[i].product.length && arrValue[i].product.length > 0) {
          for (let j = 0; j < arrValue[i].product.length; j += 1) {
            amount += arrValue[i].product[j].qty
          }
        }
      }
      return amount
    },
  },
}
</script>

<style lang="scss">
  @import 'add-pickup-table.scss';
</style>
