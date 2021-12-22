<template>
  <div class="data-order-detail-wrapper">
    <div
      v-if="detailOrder.order_status.toLowerCase() === 'perlu dikirim'"
      class="details-wrapper top-right delete-button space-top"
    >
      <b-button
        variant="outline-danger"
        class="detail-button"
        @click="handleDeleteOrder"
      >
        Delete
      </b-button>
    </div>

    <b-button
      class="detail-data-order-back-btn org-button mb-4"
      @click="exitDetailView"
    >
      <b-icon-chevron-left
        aria-hidden="true"
      />
    </b-button>

    <b-card-title class="mb-4">
      Detail Order
    </b-card-title>

    <div class="data-order-detail-content">
      <div class="data-order-detail-title-wrapper">
        Informasi Order
      </div>

      <div class="data-order-detail-section">
        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="No Order"
          label-cols-md="4"
          label-for="no-order"
        >
          <div
            id="no-order"
            class="data-order-detail-text"
          >
            {{ detailOrder.order_no }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Tanggal Order"
          label-cols-md="4"
          label-for="date-order"
        >
          <div
            id="date-order"
            class="data-order-detail-text"
          >
            {{ getDate(detailOrder.order_date) }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Metode Pembayaran"
          label-cols-md="4"
          label-for="methods-order"
        >
          <div
            id="methods-order"
            class="data-order-detail-text"
          >
            {{ detailOrder.payment_method }}
          </div>
        </b-form-group>

        <b-form-group
          class="data-order-detail-label grey-text mb-2"
          label="Status"
          label-cols-md="4"
          label-for="status-order"
        >
          <div
            id="status-order"
            class="data-order-detail-text"
          >
            <b-badge
              v-if="detailOrder.order_status.toLowerCase() === 'diterima' || detailOrder.order_status.toLowerCase() === 'dikirim' || detailOrder.order_status.toLowerCase() === 'dikembalikan'"
              variant="light-success"
            >
              {{ detailOrder.order_status }}
            </b-badge>
            <b-badge
              v-else-if="detailOrder.order_status.toLowerCase() === 'perlu dikirim'"
              variant="light-warning"
            >
              {{ detailOrder.order_status }}
            </b-badge>
            <b-badge
              v-else-if="detailOrder.order_status.toLowerCase() === 'retur'"
              variant="light-danger"
            >
              {{ detailOrder.order_status }}
            </b-badge>
            <b-badge
              v-else
              variant="light-dark"
            >
              {{ detailOrder.order_status }}
            </b-badge>
          </div>
        </b-form-group>

        <div class="info-detail-data-order grey-text mt-4">
          {{ `Telah ditambahkan oleh ‘${detailOrder.user_fullname}’ pada ${detailOrder.order_date} WIB` }}
        </div>
      </div>

      <div class="data-order-detail-title-wrapper">
        Informasi Pengiriman
      </div>

      <div class="data-order-detail-section">
        <div class="data-order-detail-profile mb-2">
          <div class="data-order-detail-profile-img">
            <b-icon-person-fill />
          </div>
          <div class="data-order-detail-profile-text">
            <div class="data-order-detail-profile-name">
              {{ detailOrder.customer_name }}
            </div>
            <div class="data-order-detail-profile-number grey-text">
              {{ detailOrder.customer_phone }}
            </div>
          </div>
        </div>
        <div
          v-if="detailOrder.is_komship"
          class="data-order-detail-status top-right org-text mt-2"
        >
          Pengiriman Komship
        </div>
        <div
          v-else
          class="data-order-detail-status top-right org-text mt-2"
        >
          Pengiriman Non Komship
        </div>
        <section>
          <b-form-group
            class="data-order-detail-label grey-text mb-2"
            label="Ekspedisi"
            label-cols-md="4"
            label-for="ekspedisi-order"
          >
            <div
              id="ekspedisi-order"
              class="data-order-detail-text"
            >
              {{ detailOrder.shipping }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label grey-text mb-2"
            label="No Resi"
            label-cols-md="4"
            label-for="resi-order"
          >
            <div
              v-if="detailOrder.airway_bill"
              id="resi-order"
              class="data-order-detail-text"
            >
              {{ detailOrder.airway_bill }}
            </div>
            <div
              v-else
              id="resi-order"
              class="data-order-detail-text"
            >
              -
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label grey-text mb-2"
            label="Detail Alamat"
            label-cols-md="4"
            label-for="address-order"
          >
            <div
              id="address-order"
              class="data-order-detail-text"
            >
              {{ detailOrder.customer_address }}
            </div>
          </b-form-group>
        </section>
      </div>

      <div class="data-order-detail-title-wrapper">
        Informasi Penjualan
      </div>

      <div class="data-order-detail-section">
        <b-table
          :ref="tableRefName"
          :fields="fields"
          :items="detailOrder.product"
          class="view-data-order-table"
        >
          <template #cell(product_name)="prodData">
            <div class="product-name-img-wrapper">
              <img src="prodData.item.product_image">
            </div>
            <div class="product-name-wrapper">
              <div class="product-name-content">
                <div class="product-name-text">
                  {{ prodData.value }}
                </div>
                <div class="product-name-variant-wrapper org-text">
                  {{ prodData.item.variant_name.replace(' -', ',') }}
                </div>
              </div>
            </div>
          </template>
          <template #cell(price)="priceData">
            {{ `Rp ${numberWithCommas(priceData.value)}` }}
          </template>
          <template #cell(weight)="totalData">
            {{ `Rp ${numberWithCommas(totalData.item.price * totalData.item.qty)}` }}
          </template>
        </b-table>

        <section class="summary-data-order-detail-wrapper mt-2">
          <b-form-group
            class="data-order-detail-label-small grey-text mb-2"
            label="Total Harga Produk"
            label-cols-md="9"
            label-for="total-prod-order"
          >
            <div
              id="total-prod-order"
              class="data-order-detail-text-small"
            >
              {{ `Rp ${numberWithCommas(detailOrder.subtotal)}` }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label-small grey-text mb-2"
            label="Ongkos Kirim"
            label-cols-md="9"
            label-for="ongkos-prod-order"
          >
            <div
              id="ongkos-prod-order"
              class="data-order-detail-text-small"
            >
              {{ `Rp ${numberWithCommas(detailOrder.shipping_cost)}` }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label-small grey-text mb-2"
            label="Potongan Harga"
            label-cols-md="9"
            label-for="cut-prod-order"
          >
            <div
              id="cut-prod-order"
              class="data-order-detail-text-small"
            >
              {{ `Rp ${numberWithCommas(detailOrder.discount)}` }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label-small grey-text mb-2 summary-text"
            :label="`Total Pembayaran (${detailOrder.payment_method}) :`"
            label-cols-md="9"
            label-for="summary-total-prod-order"
          >
            <div
              id="summary-total-prod-order"
              class="data-order-detail-text-small org-text"
            >
              {{ `Rp ${numberWithCommas(detailOrder.subtotal + detailOrder.shipping_cost - detailOrder.discount)}` }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label-small grey-text mb-2"
            :label="`Biaya ${detailOrder.payment_method} (2,8 sudah termasuk PPN)`"
            label-cols-md="9"
            label-for="cod-prod-order"
          >
            <div
              id="cod-prod-order"
              class="data-order-detail-text-small"
            >
              {{ `Rp ${numberWithCommas(detailOrder.service_fee)}` }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label-small grey-text mb-2"
            label="Cashback Ongkir (2,5%)"
            label-cols-md="9"
            label-for="cashback-prod-order"
          >
            <div
              id="cashback-prod-order"
              class="data-order-detail-text-small"
            >
              {{ `Rp ${numberWithCommas(detailOrder.shipping_cashback)}` }}
            </div>
          </b-form-group>

          <b-form-group
            class="data-order-detail-label-small grey-text mb-2"
            label="Total Harga Produk"
            label-cols-md="9"
            label-for="netto-prod-order"
          >
            <div
              id="netto-prod-order"
              class="data-order-detail-text-small org-text"
            >
              {{ `Rp ${numberWithCommas(detailOrder.subtotal + detailOrder.shipping_cost - detailOrder.discount - detailOrder.service_fee - detailOrder.shipping_cashback)}` }}
            </div>
          </b-form-group>
        </section>
      </div>
    </div>
    <data-order-detail-popup
      ref="popuprefresi"
      :profile="profile"
      :detail-order="detailOrder"
      @onUpdateAirwayBill="handleChangeAirwayBill"
    />
  </div>
</template>

<script>
import {
  BButton,
  BCardTitle,
  BFormGroup,
  BBadge,
  BIconPersonFill,
  BIconChevronLeft,
  BTable,
} from 'bootstrap-vue'
import DataOrderDetailPopup from './DataOrderDetailPopup.vue'

export default {
  components: {
    BButton,
    BCardTitle,
    BFormGroup,
    BBadge,
    BIconPersonFill,
    BIconChevronLeft,
    BTable,
    DataOrderDetailPopup,
  },
  props: {
    detailOrder: {
      type: Object,
      default: () => {},
    },
    tableRefName: {
      type: String,
      default: 'tableOne',
    },
    profile: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      fields: [
        { key: 'no', label: 'No' },
        { key: 'product_name', label: 'Nama Produk' },
        { key: 'price', label: 'Harga Satuan' },
        { key: 'qty', label: 'Jumlah' },
        { key: 'weight', label: 'Subtotal' },
      ],
    }
  },
  mounted() {
    this.setIndex()
  },
  methods: {
    setIndex() {
      for (let i = 0; i < this.detailOrder.product.length; i += 1) {
        this.detailOrder.product[i].no = i + 1
      }
    },
    exitDetailView() {
      this.$emit('onExitDetailView')
    },
    refreshTable() {
      this.$refs[this.tableRefName].refresh()
    },
    numberWithCommas(x) {
      if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.')
      return x
    },
    getDate(dateVal) {
      if (dateVal) {
        const today = dateVal.split(' ')[0]
        return today
      }
      return dateVal
    },
    showModalInputResi() {
      this.$refs.popuprefresi.showModalInputResi()
    },
    handleChangeAirwayBill(airwayBillText) {
      if (this.detailOrder) {
        this.detailOrder.airway_bill = airwayBillText
      }
    },
    reloadPage() {
      this.$router.go()
    },
    alertPopUp(textWarn, params = null, cb = null) {
      const swalOption = {
        title: `<span class="font-weight-bold h4">${textWarn}</span>`,
        showCloseButton: false,
        showConfirmButton: false,
      }
      if (params === 'success') {
        Object.assign(swalOption, {
          imageUrl: require('@/assets/images/icons/success.svg') // eslint-disable-line
        })
      } else {
        Object.assign(swalOption, {
          imageUrl: require('@/assets/images/icons/fail.svg') // eslint-disable-line
        })
      }

      this.$swal({
        ...swalOption,
      }).then(() => {
        if (typeof cb === 'function') cb()
      })
    },
    async handleDeleteOrder() {
      await this.onDeleteOrder()
    },
    onDeleteOrder() {
      // this.alertPopUp('Success To Delete Order', 'success', () => this.reloadPage())
      return this.$http_komship.delete(`v1/order/${this.profile.partner_id}/delete/${this.detailOrder.order_id}`).then(response => {
        const { data } = response
        // console.log('success to delete order', data)
        if (data && data.code && data.code === 200) {
          this.alertPopUp('Success To Delete Order', 'success', () => this.reloadPage())
        } else {
          this.alertPopUp((data.message && data.message !== '' ? data.message : 'Failed To Delete Order'), 'fail')
        }
      }).catch(() => {
        // console.log('failed to delete order')
        this.alertPopUp('Failed To Delete Order', 'fail')
      })
    },
  },
}
</script>
