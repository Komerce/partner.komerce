<template>
  <b-card>
    <div
      id="addOrderDetailsMainWrapper"
      class="add-order-main-wrapper"
    >
      <b-card-title class="mt-4 mb-4">
        Tambah Order
      </b-card-title>
      <div class="add-order-dsc-title top-right">
        {{ profile && profile.is_komship === 1 ? 'Pengiriman Kompship' : 'Pengiriman Non Kompship' }}
      </div>
      <section class="add-order-form mb-4">
        <b-form-group
          class="add-order-label mb-2"
          label="Tanggal"
          label-cols-md="3"
          label-for="input-date2"
        >
          <div class="add-order-date-label">
            {{ customerDate }}
          </div>
          <b-form-datepicker
            id="input-date2"
            ref="dp2"
            v-model="dateValue"
            class="add-order-date-button"
            button-only
            @context="onChangeDate"
          />
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2"
          label="Nama Pelanggan"
          label-cols-md="3"
        >
          <b-form-input
            ref="addCustomerName"
            v-model="customerName"
            class="add-order-product-input-v-select"
            placeholder="Masukkan Nama"
            list="customer-list-id"
            @input="handleSearchCustomer"
            @change="handleChangeCustomer"
          />
          <datalist id="customer-list-id">
            <option
              v-for="(customerItem, customerItemIndex) in detailCustomerList"
              :key="'optionCustomer'+customerItemIndex"
            >
              {{ customerItem.name }}
            </option>
          </datalist>
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2"
          label="No Telepon"
          label-cols-md="3"
        >
          <b-input-group
            class="input-phone-add-order-details-wrapper"
          >
            <b-input-group-prepend>
              <v-select
                v-model="customerPhoneCode"
                :clearable="false"
                class="input-phone-code-add-order-details"
                label=""
                label-cols-md="2"
                :options="customerPhoneCodeList"
                @input="onChangePhoneCode"
              />
              <span class="straight-line" />
            </b-input-group-prepend>

            <b-form-input
              ref="addCustomerPhone"
              v-model.number="customerPhone"
              type="number"
              class="add-order-product-input-v-select input-phone-add-order-details"
              @input="onChangePhoneNumber"
            />
          </b-input-group>
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2"
          label="Masukan Kota/ Kabupaten"
          label-cols-md="3"
        >
          <b-form-input
            ref="addCustomerCity"
            v-model="customerCity"
            class="add-order-product-input-v-select max-wd-411"
            placeholder="Masukan Kota/Kabupaten"
            list="city-list-id"
            @input="handleSearchCity"
          />
          <datalist id="city-list-id">
            <option
              v-for="(destination, destinationIndex) in destinationCity"
              :key="'optionCity'+destinationIndex"
            >
              {{ destination.label }}
            </option>
          </datalist>
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2"
          label="Alamat Detail"
          label-cols-md="3"
        >
          <b-form-textarea
            ref="addCustomerAddress"
            v-model="customerAddress"
            class="add-order-product-input-v-select"
            placeholder="Masukan alamat lengkap"
            rows="4"
          />
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2"
          label="Ekspedisi"
          label-cols-md="3"
        >
          <v-select
            ref="addShippingRef"
            class="add-order-product-input-v-select v-select-expedition-order-detail mr-1"
            label=""
            label-cols-md="2"
            :options="profile.shipping"
            @input="onAddShipping"
          />

          <v-select
            ref="expOptionRef"
            class="add-order-product-input-v-select v-select-expedition-order-detail"
            label=""
            label-cols-md="2"
            placeholder="Opsi Pengiriman"
            :options="expeditionOption"
            @input="onAddExpeditionOption"
          />
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2 add-order-label-payment"
          label="Metode Pembayaran"
          label-cols-md="3"
        >
          <v-select
            ref="paymentMethodRef"
            class="add-order-product-input-v-select add-order-product-input-v-select-payment"
            label=""
            label-cols-md="2"
            :options="profile.payment_method"
            @input="onAddPaymentMethod"
          />
          <div class="anchor-exp-select-wrapper">
            <b-form-input
              ref="selectExpRef"
              class="anchor-exp-select"
            />
          </div>
        </b-form-group>
        <b-form-group
          class="add-order-label mb-2"
          label="Gunakan Potongan Harga"
          label-cols-md="3"
        >
          <div class="discount-button-wrapper">
            <b-icon-check-circle-fill
              v-if="isUseDiscount"
              aria-hidden="true"
              class="discount-checked-button"
              @click="useDiscount(isUseDiscount)"
            />
            <b-icon-circle
              v-else
              aria-hidden="true"
              class="discount-unchecked-button"
              @click="useDiscount(isUseDiscount)"
            />
          </div>
        </b-form-group>
        <b-form-group
          v-if="isUseDiscount"
          class="add-order-label"
          label="Nominal Potongan Harga"
          label-cols-md="3"
        >
          <b-form-input
            v-model.number="customerDiscountNumber"
            type="number"
            class="add-order-product-input-v-select"
            placeholder="0"
          />
        </b-form-group>
      </section>

      <b-table
        striped
        hover
        responsive
        class="position-relative"

        :items="itemsCheckoutOrder"
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
          <div v-if="data.item.variant[0] === undefined">
            Rp. {{ formatPrice(data.item.price) }}
          </div>
          <div v-else>
            Rp. {{ formatPrice(data.item.itemSelected.price) }}
          </div>
        </template>

        <template #cell(jumlah)="data">
          {{ data.item.stockToDisplay }}
        </template>

        <template #cell(subtotal)="data">
          <div v-if="data.item.variant[0] === undefined">
            <h4>
              <strong>
                Rp. {{ formatPrice(data.item.price * data.item.stockToDisplay) }}
              </strong>
            </h4>
          </div>
          <div v-else>
            <h4>
              <strong>
                Rp. {{ formatPrice(data.item.itemSelected.price * data.item.stockToDisplay) }}
              </strong>
            </h4>
          </div>
        </template>
      </b-table>

      <section class="view-order-price">
        <b-form-group
          class="mb-2"
          label="Total Harga Produk"
          label-cols-md="5"
        >
          <div>{{ `Rp ${onNumberWithCommas(sumAllProduct)}` }}</div>
        </b-form-group>
        <b-form-group
          class="mb-2"
          label="Ongkos Kirim"
          label-cols-md="5"
        >
          <div>{{ `Rp ${onNumberWithCommas(sendCostNumber)}` }}</div>
        </b-form-group>
        <b-form-group
          v-if="isUseDiscount"
          class="mb-2"
          label="Potongan Harga"
          label-cols-md="5"
        >
          <div>{{ `- Rp ${onNumberWithCommas(customerDiscountNumber)}` }}</div>
        </b-form-group>
        <b-form-group
          v-else
          class="mb-2 hide"
          label="Potongan Harga"
          label-cols-md="5"
        >
          <div>{{ `- Rp ${onNumberWithCommas(customerDiscountNumber)}` }}</div>
        </b-form-group>
        <b-form-group
          class="summary-little-container mb-2"
          :label="`Total Pembayaran${customerPaymentMethod !== '' ? ` (${customerPaymentMethod})` : ''}`"
          label-cols-md="6"
        >
          <div class="orange-bold">
            {{ `Rp ${onNumberWithCommas(sumAllProductWithShipPrice)}` }}
          </div>
        </b-form-group>
        <div
          v-if="visibleCollapse"
          class="collapse-trigger-button"
          @click="showDetailPriceNetto"
        >
          Tutup
          <b-icon-chevron-up
            aria-hidden="true"
          />
        </div>
        <div
          v-else
          class="collapse-trigger-button"
          @click="showDetailPriceNetto"
        >
          Buka
          <b-icon-chevron-down
            aria-hidden="true"
          />
        </div>
        <b-collapse
          id="collapse-1"
          v-model="visibleCollapse"
          class="mt-2"
        >
          <b-form-group
            class="mb-2"
            :label="`Biaya ${customerPaymentMethod !== '' ? `${customerPaymentMethod}` : ''} (${serviceFeeLabel}% sudah termasuk PPN)`"
            label-cols-md="6"
          >
            <div>{{ `- Rp ${onNumberWithCommas(serviceFeeCutCost)}` }}</div>
          </b-form-group>
          <b-form-group
            class="mb-2"
            :label="`Ongkos Kirim (dipotong cashback ${cashbackLabel}%)`"
            label-cols-md="5"
          >
            <div>{{ `- Rp ${onNumberWithCommas(sendCostNumberCut)}` }}</div>
          </b-form-group>
          <b-form-group
            class="orange-bold mb-2"
            label="Penghasilan bersih yang kamu dapatkan"
            label-cols-md="5"
          >
            <div>{{ `Rp ${onNumberWithCommas(totalCostNumberNetto)}` }}</div>
          </b-form-group>
        </b-collapse>
      </section>

      <section class="view-order-summary view-order-summary-details-mobile">
        <div class="add-order-summary-text detail-add-order-summary-text">
          <span>Total Pembayaran : <span class="orange-bold">{{ `Rp ${onNumberWithCommas(sumAllProductWithShipPrice)}` }}</span></span>
        </div>
        <div class="add-order-summary-button-wrapper">
          <b-button
            v-if="!isCalculating"
            class="next-button no-mg-mobile"
            @click="onCountButtonClicked"
          >
            Hitung
          </b-button>
          <b-button
            v-if="isCalculating"
            class="next-button no-mg-mobile"
            disabled
            @click="onCountButtonClicked"
          >
            Please wait...
          </b-button>
          <b-button
            v-if="isValidOrder && !isSubmitting"
            class="next-button"
            @click="handleSaveOrder"
          >
            Submit
          </b-button>
          <b-button
            v-else-if="!isValidOrder && !isSubmitting"
            class="next-button"
            disabled
          >
            Submit
          </b-button>
          <b-button
            v-else-if="isSubmitting"
            class="next-button"
            disabled
          >
            Please wait...
          </b-button>
        </div>
      </section>
      <b-modal
        id="modal-2"
        ref="modalAddOrderPopUp"
        hide-footer
        hide-header
        centered
        @hide="handleRedirectToDataOrder"
      >
        <div class="modal-add-order-popup-success">
          <div class="image-wrapper">
            <img src="@/assets/images/icons/success.svg">
          </div>
          <div class="text-wrapper">
            Berhasil Tambah Order
          </div>
          <b-button
            class="next-button no-mg"
            @click="handleRedirectToDataOrder"
          >
            Oke
          </b-button>
        </div>
      </b-modal>
    </div>
  </b-card>
</template>

<script>
import vSelect from 'vue-select'
import {
  BCardTitle,
  BFormDatepicker,
  BFormInput,
  BFormGroup,
  BFormTextarea,
  BInputGroup,
  BInputGroupPrepend,
  BCollapse,
  BButton,
  BIconCircle,
  BIconCheckCircleFill,
  BIconChevronUp,
  BIconChevronDown,
  BTable,
  BCard,
  BRow,
  BCol,
  BAvatar,
} from 'bootstrap-vue'

function numberWithCommas(x) {
  if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.')
  return x
}

function genBasePrice(pointedVariant) {
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
}

function countTotalPrice(listData) {
  // Refactor
  if (listData.length > 0) {
    let totalPrice = 0
    // eslint-disable-next-line no-plusplus
    for (let x = 0; x < listData.length; x++) {
      const basePrice = listData[x].variant[0] !== undefined ? listData[x].itemSelected.price : listData[x].price
      const subtotalPrice = basePrice * listData[x].stockToDisplay
      totalPrice += subtotalPrice
    }
    return totalPrice
  }

  //   if (listData && listData.length && listData.length > 0) {
  //     let totalPrice = 0
  //     for (let i = 0; i < listData.length; i += 1) {
  //       const basePrice = listData[i].is_variant ? genBasePrice(listData[i].selectedVariationData) : listData[i].price
  //       const subtotalPrice = basePrice * listData[i].input
  //       totalPrice += subtotalPrice
  //     }
  //     return totalPrice
  //   }
  console.log(listData)
  return 0
}

function getVariantPerItem(listData) {
  if (listData && listData.selectedVariationData && listData.selectedVariationData.length && listData.selectedVariationData.length > 0) {
    const variantData = {}
    for (let i = 0; i < listData.selectedVariationData.length; i += 1) {
      variantData.id = i === 0 || i === (listData.selectedVariationData.length - 1) ? listData.selectedVariationData[i].options_id : (`${listData.selectedVariationData[i].options_id}, `)
      variantData.name = i === 0 || i === (listData.selectedVariationData.length - 1) ? listData.selectedVariationData[i].name : (`${listData.selectedVariationData[i].name} - `)
      variantData.price = genBasePrice(listData.selectedVariationData)
    }
    return variantData
  }
  return {}
}

export default {
  components: {
    BCardTitle,
    BFormDatepicker,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    BInputGroup,
    BInputGroupPrepend,
    BCollapse,
    BButton,
    vSelect,
    BIconCircle,
    BIconCheckCircleFill,
    BIconChevronUp,
    BIconChevronDown,
    BTable,
    BCard,
    BCol,
    BRow,
    BAvatar,
  },
  props: {
    screens: {
      type: String,
      default: '',
    },
    dateText: {
      type: String,
      default: '',
    },
    listSelected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dateValue: this.dateText,
      customerDate: '',
      customerName: '',
      customerId: '',
      detailCustomerList: [],
      customerTariffCode: '',
      customerPhone: '',
      customerPhoneCode: '+62',
      customerPhoneCodeList: ['+62'],
      customerAddress: '',
      customerCity: '',
      destinationCity: [],
      customerPaymentMethod: '',
      customerShippingMethod: '',
      customerExpeditionOption: '',
      expeditionOption: ['OKE', 'REG', 'YES'],
      isUseDiscount: false,
      customerDiscountNumber: 0,
      serviceFeeCutCost: 0,
      serviceFeeLabel: 0,
      sendCostNumber: 0,
      sendCostNumberCut: 0,
      cashbackLabel: 0,
      sumAllProduct: countTotalPrice(this.listSelected),
      sumAllProductWithShipPrice: 0,
      totalCostNumberNetto: 0,
      totalCostNumber: [],
      visibleCollapse: true,
      isValidOrder: false,
      isCalculating: false,
      isSubmitting: false,
      fields: [
        { key: 'no', label: 'No' },
        { key: 'product_name', label: 'Nama Produk' },
        { key: 'price', label: 'Harga Satuan' },
        { key: 'input', label: 'Jumlah' },
        { key: 'subtotal', label: 'Subtotal' },
      ],
      selectedItems: this.listSelected,
      cartOrder: [],

      profile: [],
      itemsCheckoutOrder: [],
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
          tdClass: 'text-center',
          thClass: 'text-center',
        },
        {
          key: 'subtotal',
          label: 'Subtotal',
          tdClass: 'text-center',
          thClass: 'text-center',
        },
      ],
    }
  },
  mounted() {
    this.onUpdateOverAllPrice()
    this.getProfile()
    this.itemsCheckoutOrder = this.$route.params.itemsOrder
  },
  methods: {
    getProfile() {
      return this.$http_komship.post('v1/my-profile').then(response => {
        const { data } = response.data
        // console.log('this.profile', data)
        this.profile = data
        console.log(this.profile)
      }).catch(() => {
        console.log('failed to get the profile data')
      })
    },
    onChangeDate(ctx) {
      if (ctx && ctx.activeYMD) {
        this.customerDate = this.changeDate(ctx.activeYMD)
        this.$emit('onUpdateDate', ctx.activeYMD)
      }
    },
    changeDate(dateString, type) {
      if (dateString && dateString !== '') {
        let today = new Date(dateString)
        const dd = today.getDate()
        const monthArr = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const mm = today.getMonth()
        const yyyy = today.getFullYear()
        today = `${dd} ${monthArr[mm]} ${yyyy}`
        if (type && type === 2) {
          today = `${yyyy}-${mm + 1}-${dd}`
        }
        return today
      }
      return dateString
    },
    onNumberWithCommas(x) {
      return numberWithCommas(x)
    },
    onUpdateAllPrice() {
      this.sumAllProductWithShipPrice = this.sumAllProduct + this.sendCostNumber - this.customerDiscountNumber
    },
    onUpdateNettoPrice() {
      this.totalCostNumberNetto = this.sumAllProductWithShipPrice - this.serviceFeeCutCost - this.sendCostNumberCut
    },
    onUpdateOverAllPrice() {
      this.sumAllProduct = countTotalPrice(this.itemsCheckoutOrder)
      this.onUpdateAllPrice()
      this.onUpdateNettoPrice()
    },
    handleSaveOrder() {
      this.submitOrder()
    },
    handleShowPopUp() {
      this.$root.$emit('bv::show::modal', 'modal-2')
    },
    onUpdateScreenViewParent() {
      const newInputScreen = this.screens === 'input' ? 'details' : 'input'
      this.$emit('onUpdateScreenView', newInputScreen)
    },
    useDiscount() {
      this.isUseDiscount = !this.isUseDiscount
      this.customerDiscountNumber = this.isUseDiscount ? this.customerDiscountNumber : 0
    },
    onAddShipping(itemSelected) {
      this.customerShippingMethod = itemSelected
    },
    onAddExpeditionOption(itemSelected) {
      this.customerExpeditionOption = itemSelected
    },
    onAddPaymentMethod(itemSelected) {
      this.customerPaymentMethod = itemSelected
    },
    onChangePhoneCode(itemSelected) {
      this.customerPhoneCode = itemSelected
    },
    onChangePhoneNumber(phoneNumber) {
      if (phoneNumber) this.customerPhone = phoneNumber
    },
    showDetailPriceNetto() {
      this.visibleCollapse = !this.visibleCollapse
    },
    handleRedirectToDataOrder() {
      this.$router.push('data-order')
    },
    findCorrectData(dataArr) {
      let selectedCost = {}
      if (dataArr && dataArr.length && dataArr.length > 0) {
        for (let j = 0; j < dataArr.length; j += 1) {
          if (dataArr[j] && dataArr[j].shipping_type && dataArr[j].shipping_type === this.customerExpeditionOption) {
            selectedCost = dataArr[j]
          }
        }
      }
      return selectedCost
    },
    calculateOnView() {
      this.sendCostNumber = this.totalCostNumber && typeof this.totalCostNumber.shipping_cost !== 'undefined' ? this.totalCostNumber.shipping_cost : 0
      this.serviceFeeCutCost = this.totalCostNumber && typeof this.totalCostNumber.service_fee !== 'undefined' ? this.totalCostNumber.service_fee : 0
      this.sendCostNumberCut = this.totalCostNumber && typeof this.totalCostNumber.cashback !== 'undefined' ? this.totalCostNumber.cashback : 0
      this.serviceFeeLabel = this.totalCostNumber && typeof this.totalCostNumber.service_fee_percentage !== 'undefined' ? this.totalCostNumber.service_fee_percentage.toString().replace('.', ',') : 0
      this.cashbackLabel = this.totalCostNumber && typeof this.totalCostNumber.cashback_percentage !== 'undefined' ? this.totalCostNumber.cashback_percentage.toString().replace('.', ',') : 0
      this.onUpdateOverAllPrice()
      this.isCalculating = false
      this.isValidOrder = true
    },
    genCart(dataArr) {
      const newCart = []
      let cartItem = {}
      if (dataArr && dataArr.length && dataArr.length > 0) {
        for (let j = 0; j < dataArr.length; j += 1) {
          if (dataArr[j]) {
            const isVariant = dataArr[j].is_variant === '1'
            const variantData = isVariant ? getVariantPerItem(dataArr[j]) : {}
            cartItem = {
              product_id: dataArr[j].product_id,
              product_name: dataArr[j].product_name,
              variant_id: isVariant ? variantData.id : null,
              variant_name: isVariant ? variantData.name : null,
              product_price: isVariant ? variantData.price : dataArr[j].price,
              product_weight: dataArr[j].weight,
              qty: dataArr[j].input,
              subtotal: dataArr[j].input * (isVariant ? variantData.price : dataArr[j].price),
            }
            newCart.push({ ...cartItem })
          }
        }
      }
      return newCart
    },
    alertFail(textWarn) {
      this.$swal({
        title: `<span class="font-weight-bold h4">${textWarn}</span>`,
        imageUrl: require('@/assets/images/icons/fail.svg'), // eslint-disable-line
        showCloseButton: false,
        focusConfirm: true,
        confirmButtonText: 'Oke',
        customClass: {
          confirmButton: 'btn bg-orange2 btn-primary rounded-lg',
        },
        buttonsStyling: false,
      })
    },
    formCheck() {
      let countValidation = 0
      if (this.customerName === '') {
        this.$refs.addCustomerName.focus()
        countValidation += 1
      } else if (this.customerPhone === '') {
        this.$refs.addCustomerPhone.focus()
        countValidation += 1
      } else if (this.customerCity === '') {
        this.$refs.addCustomerCity.focus()
        countValidation += 1
      } else if (this.customerAddress === '') {
        this.$refs.addCustomerAddress.focus()
        countValidation += 1
      } else if (typeof this.customerShippingMethod === 'undefined' || this.customerShippingMethod === '') {
        if (!this.$refs.addShippingRef.open) this.$refs.addShippingRef.select()
        this.$refs.selectExpRef.focus()
        countValidation += 1
      } else if (typeof this.customerExpeditionOption === 'undefined' || this.customerExpeditionOption === '') {
        if (!this.$refs.expOptionRef.open) this.$refs.expOptionRef.select()
        this.$refs.selectExpRef.focus()
        countValidation += 1
      } else if (typeof this.customerPaymentMethod === 'undefined' || this.customerPaymentMethod === '') {
        if (!this.$refs.paymentMethodRef.open) this.$refs.paymentMethodRef.select()
        this.$refs.selectExpRef.focus()
        countValidation += 1
      }
      if (countValidation > 0) {
        this.alertFail('Tidak Boleh Ada Field Yang Kosong!')
        return false
      }
      return true
    },
    findCity(label, listArr) {
      for (let j = 0; j < listArr.length; j += 1) {
        if (listArr[j] && listArr[j].label === label) {
          return listArr[j]
        }
      }
      return {}
    },
    findCustomer(names, listArr) {
      for (let j = 0; j < listArr.length; j += 1) {
        if (listArr[j] && listArr[j].name === names) {
          return listArr[j]
        }
      }
      return {}
    },
    handleChangeCustomer(text) {
      if (text && this.detailCustomerList.length && this.detailCustomerList.length > 0) {
        const chosenCustomerData = this.findCustomer(text, this.detailCustomerList)
        if (chosenCustomerData && chosenCustomerData.customer_id) {
          this.customerName = chosenCustomerData.name
          this.customerTariffCode = chosenCustomerData.tariff_code
          this.customerId = chosenCustomerData.customer_id
          this.customerPhone = chosenCustomerData.phone[0] === '0' ? chosenCustomerData.phone.substring(1) : chosenCustomerData.phone
          this.customerAddress = chosenCustomerData.address
        } else {
          this.customerId = 0
        }
      }
    },
    async onCountButtonClicked() {
      this.onUpdateOverAllPrice()
      const validForm = this.formCheck()
      if (validForm) await this.calculate()
    },
    async handleSearchCity(text) {
      await this.searchCustomerCity(text)
    },
    async handleSearchCustomer(text) {
      await this.searchCustomerDetail(text)
    },
    async submitOrder() {
      const cityChosen = this.findCity(this.customerCity, this.destinationCity)
      const formData = {
        date: this.changeDate(this.dateValue, 2),
        tariff_code: this.customerTariffCode !== '' ? this.customerTariffCode : cityChosen.value,
        subdistrict_name: cityChosen.subdistrict_name,
        district_name: cityChosen.district_name,
        city_name: cityChosen.city_name,
        is_komship: this.profile.is_komship,
        customer_id: this.customerId,
        customer_name: this.customerName,
        customer_phone: this.customerPhoneCode !== '' ? `0${this.customerPhone}` : null,
        detail_address: this.customerAddress,
        shipping: this.customerShippingMethod,
        shipping_type: this.customerExpeditionOption,
        payment_method: this.customerPaymentMethod,
        bank: null,
        bank_account_name: null,
        bank_account_no: null,
        subtotal: this.sumAllProduct,
        grandtotal: this.sumAllProductWithShipPrice,
        shipping_cost: this.totalCostNumber.shipping_cost,
        service_fee: this.totalCostNumber.service_fee,
        discount: this.totalCostNumber.discount,
        shipping_cashback: this.totalCostNumber.cashback,
        net_profit: this.totalCostNumberNetto,
      }
      await this.storeSelectedItemsToCart(formData)
    },
    async storeSelectedItemsToCart(formData) {
      const allItemsToPost = this.genCart(this.selectedItems)
      await this.onPostCart(allItemsToPost)
      Object.assign(formData, { cart: this.cartOrder })
      this.storeOrder(formData)
    },
    async storeOrder(formData) {
      // console.log('formData', formData)
      await this.onPostOrder(formData)
    },
    searchCustomerCity(cityName) {
      return this.$http_komship.get(`v1/destination?search=${cityName}`).then(response => {
        const { data } = response.data.data
        this.destinationCity = data
      }).catch(() => {
        console.log('fail to search destination')
      })
    },
    searchCustomerDetail(customerName) {
      return this.$http_komship.get(`v1/customer?search=${customerName}`).then(response => {
        const { data } = response.data
        this.detailCustomerList = data
      }).catch(() => {
        console.log('fail to search customer')
      })
    },
    calculate() {
      this.isCalculating = true
      return this.$http_komship.get('v1/calculate', {
        params: {
          discount: this.customerDiscountNumber,
          shipping: this.customerShippingMethod,
          tariff_code: this.customerTariffCode !== '' ? this.customerTariffCode : this.findCity(this.customerCity, this.destinationCity).value,
          payment_method: this.customerPaymentMethod,
          cart: this.sumAllProduct,
        },
      }).then(response => {
        const { data } = response.data
        // console.log('dataCost', data)
        this.totalCostNumber = this.findCorrectData(data)
        this.calculateOnView()
      }).catch(() => {
        this.isCalculating = false
        this.alertFail('Unable to calculate the table data. Please check on Ekspedisi, Opsi Pengiriman, and Metode Pembayaran and try again later or contact support.')
      })
    },
    onPostOrder(formData) {
      this.isSubmitting = true
      if (formData.bank === null) {
        // eslint-disable-next-line no-param-reassign
        formData.bank = 0
      }
      if (formData.bank_account_name === null) {
        // eslint-disable-next-line no-param-reassign
        formData.bank_account_name = 0
      }
      if (formData.bank_account_no === null) {
        // eslint-disable-next-line no-param-reassign
        formData.bank_account_no = 0
      }
      console.log(formData)
      return this.$http_komship.post(`v1/order/${this.profile.partner_id}/store`, formData).then(response => {
        const { data } = response.data
        // console.log('detail post order', data)
        if (data) {
          this.isSubmitting = false
          if (this.profile.is_onboarding) {
            this.$emit('onBoardingShow')
          } else {
            this.handleShowPopUp()
          }
        }
      }).catch(() => {
        this.isSubmitting = false
        this.alertFail('Unable to Send Your Order. Please and try again later or contact support.')
      })
    },
    onPostCart(cartItem) {
      return this.$http_komship.post('v1/cart/bulk-store', cartItem).then(response => {
        const { data } = response.data
        // console.log('detail post cart', data)
        this.cartOrder = data.cart_id
      }).catch(() => {
        this.alertFail('Unable to Update Your Cart. Please and try again later or contact support.')
      })
    },
    formatPrice(value) {
      const val = value
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
  },
}
</script>

<style lang="scss">
  @import '~@core/scss/vue/libs/vue-select.scss';
  @import '../add-order.scss';
</style>
